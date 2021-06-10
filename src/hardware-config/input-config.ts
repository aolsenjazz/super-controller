import {
  MidiMessage,
  Channel,
  MidiValue,
  EventType,
} from 'midi-message-parser';

import { inputIdFor } from '../device-util';
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
  nickname?: string;
  number?: MidiValue;
  channel?: Channel;
  eventType?: EventType;
  response?: 'gate' | 'toggle' | 'linear' | 'constant';
  lightConfig: Map<string, Color>;
};

export class InputConfig {
  outputPropagator: OutputPropagator;

  devicePropagator: Propagator;

  /* Array of `Color`s the hardware input can be. */
  readonly availableColors: Color[];

  readonly overrideable: boolean;

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

  static msgFor(i: InputConfig, c?: Color) {
    if (!c) return undefined;

    return new MidiMessage(
      c.eventType,
      i.default.number,
      c.value,
      i.default.channel,
      0
    );
  }

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

  static fromDriver(other: InputDriver) {
    const inputOverride = {
      lightConfig: new Map<string, Color>(),
    };

    const instance = new InputConfig(
      other.default,
      inputOverride,
      other.availableColors,
      other.overrideable,
      other.type
    );

    return instance;
  }

  constructor(
    defaultVals: InputDefault,
    override: InputOverride,
    availableColors: Color[],
    overrideable: boolean,
    type: 'pad' | 'knob' | 'slider' | 'wheel',
    value?: MidiValue,
    lastPropagated?: MidiMessage,
    lastResponse?: MidiMessage
  ) {
    this.default = defaultVals;
    this.override = override;
    this.availableColors = availableColors;
    this.overrideable = overrideable;
    this.type = type;

    this.outputPropagator = new OutputPropagator(
      this.default.response,
      this.override.response || this.default.response,
      this.override.eventType || this.default.eventType,
      this.override.number || this.default.number,
      this.override.channel || this.default.channel,
      value,
      lastPropagated
    );

    if (['gate', 'toggle'].includes(this.default.response)) {
      const defaultColor =
        this.availableColors.length > 0
          ? this.availableColors.filter((c) => c.default)[0]
          : undefined;

      const isOffSet = override.lightConfig.get('off') !== undefined;
      const offColor = isOffSet
        ? override.lightConfig.get('off')
        : defaultColor;

      type Type = 'gate' | 'toggle' | 'constant';
      this.devicePropagator = new BinaryPropagator(
        this.default.response as 'gate' | 'toggle',
        (this.override.response || this.default.response) as Type,
        InputConfig.msgFor(this, override.lightConfig.get('on')),
        InputConfig.msgFor(this, offColor),
        lastResponse
      );
    } else {
      this.devicePropagator = new NullPropagator(
        this.default.response,
        this.override.response || this.default.response
      );
    }
  }

  handleMessage(msg: MidiValue[]): (MidiValue[] | null)[] {
    const toPropagate = this.outputPropagator.handleMessage(msg);
    const toDevice = this.devicePropagator.handleMessage(msg);

    return [toDevice, toPropagate];
  }

  colorForState(state: string) {
    return this.#lightConfig().get(state);
  }

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

  restoreDefaults() {
    this.number = this.default.number;
    this.eventType = this.default.eventType;
    this.channel = this.default.channel;
    this.response = this.default.response;
  }

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

    if (this.eventType === 'pitchbend') return ['pitchbend'];

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
    if (this.response === 'constant') {
      return ['gate', 'toggle'];
    }

    if (this.response === 'gate') {
      return ['gate', 'toggle'];
    }

    if (this.response === 'toggle') {
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
      this.default.number,
      this.default.channel,
      this.default.eventType
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

    if (response === 'toggle') {
      this.devicePropagator.outputResponse = 'toggle';
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

  /**
   * Serialize a similar representation of the object. Can't use JSON.stringify
   * because we neeed to serialize a map.
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

  /* Basically just a smarter equality operator */
  equals(other: InputConfig | null) {
    if (other === null) return false;

    return (
      this.id === other.id &&
      this.nickname === other.nickname &&
      this.number === other.number &&
      this.eventType === other.eventType &&
      this.channel === other.channel &&
      this.response === other.response &&
      this.overrideable === other.overrideable
    );
  }
}
