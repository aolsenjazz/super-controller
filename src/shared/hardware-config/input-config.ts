import {
  MidiMessage,
  Channel,
  MidiValue,
  EventType,
} from 'midi-message-parser';

import { inputIdFor, msgForColor } from '../util';
import { Propagator } from '../propagators/propagator';
import { OutputPropagator } from '../propagators/output-propagator';
import { NullPropagator } from '../propagators/null-propagator';
import { BinaryPropagator } from '../propagators/binary-propagator';
import { InputDefault, Color, InputDriver } from '../driver-types';

/**
 * Overrides the values which are propagated from devices. Default values remain
 * accessible via `InputConfig.default`.
 */
export type InputOverride = {
  /* User-defined nickname */
  nickname?: string;

  /* Note number, CC number, program number, etc */
  number?: MidiValue;

  /* MIDI channel */
  channel?: Channel;

  /* MIDI event type */
  eventType?: EventType;

  /**
   * Describes how event are propagated to clients. Not all inputs are eligible for
   * all responses; inputs who hardware response is 'toggle' can only propagate in
   * 'toggle' or 'constant' mode, because no events are fired from hardware on input release
   *
   * gate: event fired on press and release
   * toggle: event fired on press
   * linear: continuous input (TODO: should probably be renamed to 'continuous')
   * constant: event fired on press, always the same event
   */
  response?: 'gate' | 'toggle' | 'linear' | 'constant';

  /**
   * Maintains hardware color per state. For more, see `DevicePropagator`
   *
   * TODO: this is smelly. probably makes more sense to make this a member of
   * `DevicePropagator`
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
  readonly type: 'pad' | 'knob' | 'slider' | 'wheel' | 'xy';

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
      other.lastPropagated
        ? new MidiMessage(other.lastPropagated, 0)
        : undefined,
      other.lastResponse ? new MidiMessage(other.lastResponse, 0) : undefined
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
    type: 'pad' | 'knob' | 'slider' | 'wheel' | 'xy',
    value?: MidiValue,
    lastPropagated?: MidiMessage,
    lastResponse?: MidiMessage
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
    // TODO: this is gross. surely this can be made cleaner
    if (['gate', 'toggle'].includes(this.default.response)) {
      const defaultColor =
        availableColors.length > 0
          ? availableColors.filter((c) => c.default)[0]
          : undefined;

      const isOffSet = override.lightConfig.get('off') !== undefined;
      const offColor = isOffSet
        ? override.lightConfig.get('off')
        : defaultColor;

      const isOnSet = override.lightConfig.get('on') !== undefined;
      const onColor = isOnSet ? override.lightConfig.get('on') : defaultColor;

      type Type = 'gate' | 'toggle' | 'constant';
      this.devicePropagator = new BinaryPropagator(
        this.default.response as 'gate' | 'toggle',
        (this.override.response || this.default.response) as Type,
        msgForColor(defaultVals.number, defaultVals.channel, onColor),
        msgForColor(defaultVals.number, defaultVals.channel, offColor),
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
   * @returns [message_to_device | null, message_to_clients | null]
   */
  handleMessage(msg: MidiValue[]): (MidiValue[] | null)[] {
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
      const msg = new MidiMessage(
        color.eventType,
        this.number,
        color.value,
        this.channel,
        0
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
        ? this.outputPropagator.lastPropagated?.toMidiArray()
        : undefined,
      lastResponse: includeState
        ? this.devicePropagator.lastPropagated?.toMidiArray()
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
          (c) => c.value === on.value && c.eventType === on.type
        )[0];
        config.set('on', color);
      }

      if (off) {
        const color = this.availableColors.filter(
          (c) => c.value === off.value && c.eventType === off.type
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

    return ['linear'];
  }

  get eligibleEventTypes() {
    if (this.response === 'constant') {
      return ['noteon', 'noteoff', 'controlchange', 'programchange'];
    }

    // TODO: really shouldn't need this extra line. pitchbend should be treated as linear where possible
    if (this.eventType === 'pitchbend') return ['pitchbend'];

    if (this.response === 'linear') {
      return ['noteon', 'noteoff', 'controlchange', 'programchange'];
    }

    return ['noteon/noteoff', 'controlchange', 'programchange'];
  }

  get defaultColor(): Color | undefined {
    return this.availableColors.length > 0
      ? this.availableColors.filter((c) => c.default === true)[0]
      : undefined;
  }

  get value(): MidiValue {
    return this.outputPropagator.value;
  }

  set value(value: MidiValue) {
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

  set number(number: MidiValue) {
    this.outputPropagator.number = number;
  }

  get id() {
    return inputIdFor(
      this.default.eventType,
      this.default.channel,
      this.default.number
    );
  }

  get eventType(): EventType {
    return this.outputPropagator.eventType;
  }

  set eventType(eventType: EventType) {
    this.outputPropagator.eventType = eventType;
  }

  get nickname() {
    const overridden = this.override.nickname;
    return overridden === undefined ? `Input ${this.number}` : overridden;
  }

  get response(): 'linear' | 'gate' | 'toggle' | 'constant' {
    return this.outputPropagator.outputResponse;
  }

  set response(response: 'linear' | 'gate' | 'toggle' | 'constant') {
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

    if (this.default.response === 'linear') {
      throw new Error(
        'linear hardware response doesnt support lights right now'
      );
    }

    this.devicePropagator.outputResponse = response;
    this.devicePropagator.lastPropagated = undefined; // reset propagator state
    this.outputPropagator.lastPropagated = undefined; // reset propagator state
  }
}
