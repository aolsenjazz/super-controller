/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import {
  OverrideablePropagator,
  createPropagator,
  ContinuousPropagator,
  ColorConfigPropagator,
} from '../propagators';
import {
  InputDriver,
  InputResponse,
  InputType,
  InputGridDriver,
  FxDriver,
} from '../driver-types';
import { ColorImpl } from './color-impl';

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly eventType: StatusString | 'noteon/noteoff';

  /* See InputResponse */
  readonly response: InputResponse;
};

/**
 * Contains configuration details and maintains state for individual hardware
 * inputs. Layout information is delegated to the `VirtualInput` class.
 *
 * TODO: maybe worth extending DefaultPreservedMidiMessage ?
 */
@Revivable.register
export class InputConfig {
  /**
   * Object containing default values for input number, EventType, etc. Generic
   * value represents the type of input - Knob, Pad, etc.
   */
  default: InputDefault;

  /**
   * Manages event propagation to clients and maintains state related to event
   * propagation to clients.
   */
  outputPropagator: OverrideablePropagator<InputResponse, InputResponse>;

  /**
   * Manages event propagation to device and maintains state related to event
   * propagation to device.
   */
  devicePropagator: ColorConfigPropagator;

  #nickname?: string;

  /* Array of `Color`s the hardware input can be. */
  readonly availableColors: ColorImpl[];

  readonly availableFx: FxDriver[];

  /* Can this control be overridden? `false` if events aren't transmitted from device */
  readonly overrideable: boolean;

  /**
   * Input type. 'xy' is the only non-straightforward type; xy inputs are comprised of
   * *two* inputs which aren't aware of one-another.
   */
  readonly type: InputType;

  readonly knobType?: 'endless' | 'absolute';

  /**
   * Constructs and initialize a new instance of `InputConfig` from driver.
   *
   * @param other Input driver
   * @returnsnew instance of InputConfig
   */
  static fromDriver(
    overrides: InputDriver,
    defaults: InputGridDriver['inputDefaults']
  ) {
    const { number, value } = overrides;
    const channel =
      overrides.channel !== undefined ? overrides.channel : defaults.channel!;
    const response = (overrides.response || defaults.response)!;
    const eventType = (overrides.eventType || defaults.eventType)!;
    const type = (overrides.type || defaults.type)!;
    const overrideable =
      overrides.overrideable !== undefined
        ? overrides.overrideable
        : defaults.overrideable!;
    const def = { number, channel, response, eventType };
    const knobType = overrides.knobType || defaults.knobType;

    const availableColors =
      overrides.availableColors || defaults.availableColors || [];
    const colors = availableColors.map((c) => new ColorImpl(c));

    const availableFx = overrides.availableFx || defaults.availableFx || [];

    const instance = new InputConfig(
      def,
      colors,
      availableFx,
      overrideable,
      type,
      value,
      undefined,
      undefined,
      knobType
    );

    return instance;
  }

  constructor(
    defaultVals: InputDefault,
    availableColors: ColorImpl[],
    availableFx: FxDriver[],
    overrideable: boolean,
    type: InputType,
    value?: MidiNumber,
    outputPropagator?: OverrideablePropagator<InputResponse, InputResponse>,
    devicePropagator?: ColorConfigPropagator,
    knobType?: 'endless' | 'absolute',
    valueType?: 'endless' | 'absolute',
    nickname?: string
  ) {
    this.default = defaultVals;
    this.availableColors = availableColors;
    this.availableFx = availableFx;
    this.overrideable = overrideable;
    this.type = type;
    this.knobType = knobType;
    this.#nickname = nickname;

    const r = this.default.response;

    this.devicePropagator = devicePropagator || new ColorConfigPropagator(r, r);

    this.outputPropagator =
      outputPropagator ||
      createPropagator(
        r,
        r,
        this.default.eventType,
        this.default.number,
        this.default.channel,
        value,
        knobType,
        valueType
      );
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.default,
        this.availableColors,
        this.availableFx,
        this.overrideable,
        this.type,
        this.value,
        this.outputPropagator,
        this.devicePropagator,
        this.knobType,
        this.valueType,
        this.nickname,
      ],
    };
  }

  /**
   * Handles a message from a device.
   *
   * @param msg The midi value array
   * @returns [message_to_device | undefined, message_to_clients | undefined]
   */
  handleMessage(msg: MidiArray): (MidiArray | undefined)[] {
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
  colorForState(state: number) {
    const color = this.devicePropagator.getColor(state);
    return color || this.defaultColor;
  }

  getFx(state: number) {
    let fxVal = this.devicePropagator.getFx(state);
    let fx;

    if (fxVal === undefined) {
      const c = this.defaultColor;
      if (c) fxVal = (c.array[0] & 0x0f) as Channel;
      else return undefined;
    }

    this.availableFx.forEach((f) => {
      if (f.validVals.includes(fxVal as Channel)) fx = f;
    });

    return fx;
  }

  // TODO: the naming of this vs getActiveFx is weird
  getFxVal(state: number) {
    return this.devicePropagator.getFx(state);
  }

  // TODO: this sort of feels like some BS
  setFx(state: number, fxTitle: string) {
    let isSet = false;

    this.availableFx.forEach((fx) => {
      if (fx.title === fxTitle) {
        isSet = true;
        this.devicePropagator.setFx(state, fx.defaultVal);
      }
    });

    if (!isSet) {
      throw new Error(`no FX exists for title[${fxTitle}]`);
    }
  }

  setFxVal(state: number, fxVal: Channel) {
    this.devicePropagator.setFx(state, fxVal);
  }

  /**
   * Set a color for the given state.
   *
   * TODO: this kind of feels like some BS
   *
   * @param state The state value
   * @param color The color
   */
  setColorForState(state: number, displayName: string) {
    const colors = this.availableColors.filter(
      (c) => c.displayName === displayName
    );

    if (colors.length === 0) {
      throw new Error(
        `color with displayName[${displayName}] is not in availableColors`
      );
    }

    this.devicePropagator.setColor(state, colors[0]);
  }

  /* Restores all default, numeric values (nothing color-related) */
  restoreDefaults() {
    this.number = this.default.number;
    this.eventType = this.default.eventType;
    this.channel = this.default.channel;
    this.response = this.default.response;
  }

  get eligibleResponses() {
    switch (this.default.response) {
      case 'gate':
        return ['gate', 'toggle', 'constant'];
      case 'toggle':
        return ['toggle', 'constant'];
      case 'constant':
        return ['noteon/noteoff', 'controlchange'].includes(this.eventType)
          ? ['toggle', 'constant']
          : ['constant'];
      default:
        return ['continuous', 'constant'];
    }
  }

  get valueType() {
    if (this.outputPropagator instanceof ContinuousPropagator) {
      return this.outputPropagator.valueType;
    }

    return 'absolute';
  }

  set valueType(type: 'endless' | 'absolute') {
    if (this.outputPropagator instanceof ContinuousPropagator) {
      this.outputPropagator.valueType = type;
    }
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

  get defaultColor(): ColorImpl | undefined {
    let c;
    this.availableColors.forEach((color) => {
      if (color.isDefault) c = color;
    });

    return c;
  }

  get value(): MidiNumber {
    return this.outputPropagator.value;
  }

  set value(value: MidiNumber) {
    this.outputPropagator.value = value;
  }

  // TODO: should probably have currentCOlorArray or something to distinguinsh
  get currentColor(): ColorImpl | undefined {
    return this.devicePropagator.currentColor;
  }

  get currentFx(): FxDriver | undefined {
    const fxVal = this.devicePropagator.currentFx;

    if (fxVal === undefined) return undefined;

    let fx;
    this.availableFx.forEach((f) => {
      if (f.validVals.includes(fxVal)) fx = f;
    });

    return fx;
  }

  get eligibleLightResponses() {
    switch (this.default.response) {
      case 'constant':
      case 'gate':
        return ['gate', 'toggle'];
      case 'toggle':
        return ['toggle'];
      default:
        return [];
    }
  }

  // TODO: yeah, only 2-state lights are supported right now. that's ok.
  get eligibleLightStates() {
    return [0, 1];
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

  set number(number: MidiNumber) {
    this.outputPropagator.number = number;
  }

  get id() {
    const et = this.default.eventType;
    const c = this.default.channel;
    const n = this.default.number;

    return et === 'pitchbend' ? `${et}.${c}` : `${et}.${c}.${n}`;
  }

  get eventType(): StatusString | 'noteon/noteoff' {
    return this.outputPropagator.eventType;
  }

  set eventType(eventType: StatusString | 'noteon/noteoff') {
    this.outputPropagator.eventType = eventType;
  }

  get nickname() {
    return this.#nickname || `Input ${this.number}`;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
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
    this.devicePropagator.currentStep = 0; // reset propagator state
  }

  get lightResponse() {
    return this.devicePropagator.outputResponse as 'gate' | 'toggle';
  }

  set lightResponse(response: 'gate' | 'toggle') {
    this.devicePropagator.outputResponse = response;

    this.devicePropagator.currentStep = 0; // reset propagator state
  }
}
