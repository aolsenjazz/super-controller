import { setStatus, getStatus } from '@shared/midi-util';

import { inputIdFor, msgForColor } from '../util';
import { Propagator } from '../propagators/propagator';
import { OutputPropagator } from '../propagators/output-propagator';
import { NullPropagator } from '../propagators/null-propagator';
import { BinaryPropagator } from '../propagators/binary-propagator';
import {
  InputDefault,
  Color,
  InputDriver,
  InputResponse,
  InputType,
} from '../driver-types';

/**
 * Overrides the values which are propagated from devices. Default values remain
 * accessible via `InputConfig.default`.
 */
export type InputOverride = {
  /* User-defined nickname */
  nickname?: string;

  /* Note number, CC number, program number, etc */
  number?: number;

  /* MIDI channel */
  channel?: Channel;

  /* MIDI event type */
  eventType?: StatusString | 'noteon/noteoff';

  /* See InputResponse */
  response?: InputResponse;

  /**
   * Maintains hardware color per state. For more, see `DevicePropagator`
   *
   * TODO: this is smelly. might make more sense to make this a member of
   * `DevicePropagator`.
   */
  lightConfig: Map<string, Color>;
};

/**
 * Contains configuration details and maintains state for individual hardware
 * inputs. Layout information is delegated to the `VirtualInput` class.
 */
export class InputConfig {
  /**
   * Manages event propagation to clients and maintains state related to event
   * propagation to clients.
   */
  outputPropagator: OutputPropagator;

  /**
   * Manages event propagation to device and maintains state related to event
   * propagation to device.
   */
  devicePropagator: Propagator;

  /* Array of `Color`s the hardware input can be. */
  readonly availableColors: Color[];

  /* Can this control be overridden? `false` if events aren't transmitted from device */
  readonly overrideable: boolean;

  /**
   * Input type. 'xy' is the only non-straightforward type; xy inputs are comprised of
   * *two* inputs which aren't aware of one-another.
   */
  readonly type: InputType;

  /**
   * Object containing overridden values. E.g. a given Pad which typically send
   * noteon/noteoff events on channel 1 can send controlchange on channel 4.
   * Generic value represents the type of input - Knob, Pad, etc.
   */
  override: InputOverride;

  /**
   * Object containing default values for input number, EventType, etc. Generic
   * value represents the type of input - Knob, Pad, etc.
   */
  default: InputDefault;

  /**
   * Convert from JSON string into an InputConfig object. Reconstructs
   * state if state was saved to JSON string.
   *
   * @param json JSON string
   * @returns new instance of InputConfig
   */
  static fromJSON(json: string) {
    const other = JSON.parse(json);

    const inputOverride = other.override;
    inputOverride.lightConfig = new Map<string, Color>(
      other.override.lightConfig
    );

    const instance = new InputConfig(
      other.default,
      inputOverride,
      other.availableColors,
      other.overrideable,
      other.type,
      other.value,
      other.lastPropagated,
      other.lastResponse
    );
    instance.devicePropagator.outputResponse = other.lightResponse;

    return instance;
  }

  /**
   * Constructs and initialize a new instance of `InputConfig` from driver
   *
   * @param other Input driver
   * @returnsnew instance of InputConfig
   */
  static fromDriver(other: InputDriver) {
    const inputOverride = {
      lightConfig: new Map<string, Color>(),
    };

    const instance = new InputConfig(
      other.default,
      inputOverride,
      other.availableColors,
      other.overrideable,
      other.type,
      other.value
    );

    return instance;
  }

  constructor(
    defaultVals: InputDefault,
    override: InputOverride,
    availableColors: Color[],
    overrideable: boolean,
    type: InputType,
    value?: number,
    lastPropagated?: number[],
    lastResponse?: number[]
  ) {
    this.default = defaultVals;
    this.override = override;
    this.availableColors = availableColors;
    this.overrideable = overrideable;
    this.type = type;

    const isPitchbend = defaultVals.eventType === 'pitchbend';

    this.outputPropagator = new OutputPropagator(
      this.default.response,
      this.override.response || this.default.response,
      this.override.eventType || this.default.eventType,
      this.override.number || this.default.number,
      this.override.channel || this.default.channel,
      isPitchbend ? 64 : value,
      lastPropagated
    );

    // create the devicePropagator
    if (['gate', 'toggle'].includes(this.default.response)) {
      const offColor = override.lightConfig.get('off') || this.defaultColor;
      const offColorMsg = offColor
        ? msgForColor(defaultVals.number, defaultVals.channel, offColor)
        : undefined;

      const onColor = override.lightConfig.get('on') || this.defaultColor;
      const onColorMsg = onColor
        ? msgForColor(defaultVals.number, defaultVals.channel, onColor)
        : undefined;

      type Type = 'gate' | 'toggle';
      this.devicePropagator = new BinaryPropagator(
        this.default.response as Type | 'constant',
        (this.override.response || this.default.response) as Type,
        onColorMsg,
        offColorMsg,
        lastResponse
      );
    } else {
      this.devicePropagator = new NullPropagator(
        this.default.response,
        this.override.response || this.default.response
      );
    }
  }

  /**
   * Handles a message from a device.
   *
   * @param msg The midi value array
   * @returns [message_to_device | undefined, message_to_clients | undefined]
   */
  handleMessage(msg: number[]): (number[] | null)[] {
    const toPropagate = this.outputPropagator.handleMessage(msg);
    const toDevice = this.devicePropagator.handleMessage(msg);

    return [toDevice, toPropagate];
  }

  /**
   * Returns the Color for the given state or undefined
   *
   * @param state The state
   * @returns The associated color or undefined if not set
   */
  colorForState(state: string) {
    return this.#lightConfig().get(state);
  }

  /**
   * Set a color for the given state.
   *
   * @param state The state value
   * @param color The color
   */
  setColorForState(state: string, color: Color) {
    // this is terrible, but I don't know how to handle RBG, n-step, etc
    this.override.lightConfig.set(state, color);

    if (this.devicePropagator instanceof BinaryPropagator) {
      const msg = setStatus(
        [this.channel, this.number, color.value],
        color.eventType
      );

      if (state === 'on') this.devicePropagator.onMessage = msg;
      else this.devicePropagator.offMessage = msg;
    }
  }

  /* Restores all default, numeric values (nothing color-related) */
  restoreDefaults() {
    this.number = this.default.number;
    this.eventType = this.default.eventType;
    this.channel = this.default.channel;
    this.response = this.default.response;
  }

  /**
   * Serialize a similar representation of the object. Can't use JSON.stringify
   * because we neeed to serialize a map.
   *
   * @param includeState Should we include state?
   */
  toJSON(includeState: boolean) {
    return JSON.stringify({
      default: this.default,
      override: {
        nickname: this.nickname,
        lightConfig: Array.from(this.override.lightConfig.entries()),
        number: this.number,
        eventType: this.eventType,
        channel: this.channel,
        response: this.response,
      },
      type: this.type,
      overrideable: this.overrideable,
      response: this.response,
      availableColors: this.availableColors,
      lightResponse: this.lightResponse,
      value: this.outputPropagator.value,
      lastPropagated: includeState
        ? this.outputPropagator.lastPropagated
        : undefined,
      lastResponse: includeState
        ? this.devicePropagator.lastPropagated
        : undefined,
    });
  }

  /**
   * Constructs a map of `Color`-per-state configurations.
   *
   * TODO: This is just disgusting. Gotta figure out how to handle RGB before this
   * is worth fixing.
   *
   * @returns Color-per-state map
   */
  #lightConfig = () => {
    const config = new Map<string, Color>();

    if (this.devicePropagator instanceof BinaryPropagator) {
      const on = this.devicePropagator.onMessage;
      const off = this.devicePropagator.offMessage;

      if (on) {
        const color = this.availableColors.filter(
          (c) => c.value === on[2] && c.eventType === getStatus(on).string
        )[0];
        config.set('on', color);
      }

      if (off) {
        const color = this.availableColors.filter(
          (c) => c.value === off[2] && c.eventType === getStatus(off).string
        )[0];
        config.set('off', color);
      }
    }

    return config;
  };

  get eligibleResponses() {
    if (this.default.response === 'gate') return ['gate', 'toggle', 'constant'];

    if (this.default.response === 'toggle') return ['toggle', 'constant'];

    if (this.default.response === 'constant') {
      return ['noteon/noteoff', 'controlchange'].includes(this.eventType)
        ? ['toggle', 'constant']
        : ['constant'];
    }

    return ['continuous'];
  }

  get eligibleEventTypes() {
    if (this.response === 'constant') {
      return ['noteon', 'noteoff', 'controlchange', 'programchange'];
    }

    if (this.default.eventType === 'pitchbend') {
      return [
        'pitchbend',
        'noteon',
        'noteoff',
        'controlchange',
        'programchange',
      ];
    }

    if (this.response === 'continuous') {
      return ['noteon', 'noteoff', 'controlchange', 'programchange'];
    }

    return ['noteon/noteoff', 'controlchange', 'programchange'];
  }

  get defaultColor(): Color | undefined {
    return this.availableColors.length > 0
      ? this.availableColors.filter((c) => c.default === true)[0]
      : undefined;
  }

  get value(): number {
    return this.outputPropagator.value;
  }

  set value(value: number) {
    this.outputPropagator.value = value;
  }

  get currentColor(): Color | undefined {
    const config = this.#lightConfig();
    return config.get(this.devicePropagator.state);
  }

  get eligibleLightResponses() {
    if (this.default.response === 'constant') {
      return ['gate', 'toggle'];
    }

    if (this.default.response === 'gate') {
      return ['gate', 'toggle'];
    }

    if (this.default.response === 'toggle') {
      return ['toggle'];
    }

    return [];
  }

  get eligibleLightStates() {
    return this.devicePropagator.eligibleStates;
  }

  get channel() {
    return this.outputPropagator.channel;
  }

  set channel(channel: Channel) {
    this.outputPropagator.channel = channel;
  }

  get number() {
    return this.outputPropagator.number;
  }

  set number(number: number) {
    this.outputPropagator.number = number;
  }

  get id() {
    return inputIdFor(
      this.default.eventType,
      this.default.channel,
      this.default.number
    );
  }

  get eventType(): StatusString | 'noteon/noteoff' {
    return this.outputPropagator.eventType;
  }

  set eventType(eventType: StatusString | 'noteon/noteoff') {
    this.outputPropagator.eventType = eventType;
  }

  get nickname() {
    const overridden = this.override.nickname;
    return overridden === undefined ? `Input ${this.number}` : overridden;
  }

  get response(): InputResponse {
    return this.outputPropagator.outputResponse;
  }

  set response(response: InputResponse) {
    if (response === 'constant') {
      this.eventType =
        this.eventType === 'noteon/noteoff' ? 'noteon' : this.eventType;
    } else {
      this.eventType = ['noteon', 'noteoff'].includes(this.eventType)
        ? this.default.eventType
        : this.eventType;
    }

    if (response === 'toggle' || response === 'gate') {
      this.devicePropagator.outputResponse = response;
    }

    this.outputPropagator.outputResponse = response;

    this.outputPropagator.lastPropagated = undefined; // reset propagator state
    this.devicePropagator.lastPropagated = undefined; // reset propagator state
  }

  get lightResponse() {
    return this.devicePropagator.outputResponse as 'gate' | 'toggle';
  }

  set lightResponse(response: 'gate' | 'toggle') {
    if (this.default.response === 'toggle' && response === 'gate') {
      throw new Error(
        `light response cannot be 'gate' for 'toggle' hardware response`
      );
    }

    if (this.default.response === 'continuous') {
      throw new Error(
        'continuous hardware response doesnt support lights right now'
      );
    }

    this.devicePropagator.outputResponse = response;
    this.devicePropagator.lastPropagated = undefined; // reset propagator state
    this.outputPropagator.lastPropagated = undefined; // reset propagator state
  }
}
