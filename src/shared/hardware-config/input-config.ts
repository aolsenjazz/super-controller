/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import {
  OverrideablePropagator,
  createPropagator,
  ContinuousPropagator,
  ColorConfigPropagator,
} from '../propagators';
import {
  InputResponse,
  InputType,
  FxDriver,
  InteractiveInputDrivers,
} from '../driver-types';
import { ColorImpl } from './color-impl';

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly statusString: StatusString | 'noteon/noteoff';

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
  static fromDriver(d: InteractiveInputDrivers) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const { availableColors, availableFx, interactive, type } = d;
    const colors = availableColors.map((c) => new ColorImpl(c));
    const value = d.type === 'pad' ? d.value : undefined;
    const knobType = d.type === 'knob' ? d.knobType : undefined;

    const instance = new InputConfig(
      def,
      colors,
      availableFx,
      interactive,
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
        this.default.statusString,
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
    let toDevice = this.devicePropagator.handleMessage(msg);

    // Here's a pretty whack little fix. Somme controllers will, by default, change colors
    // based on config of their native customizing program. This can be patched by sending
    // potentially-redundant messages to change the color back to SC-controlled state.
    //
    // TODO: this should probably take place in the ColorConfigPropagator
    if (toDevice === undefined && this.currentColor !== undefined) {
      toDevice = create(this.currentColor.array);
      // TODO: I suspect that this also doesn't work w.r.t. applying fx
    }

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
    const fxVal = this.devicePropagator.getFx(state);
    let fx = this.defaultFx;

    if (fxVal !== undefined) {
      this.availableFx.forEach((f) => {
        const contains =
          f.validVals.filter((v) => JSON.stringify(v) === JSON.stringify(fxVal))
            .length > 0;

        if (contains) {
          fx = f;
        }
      });
    }

    return fx;
  }

  getFxVal(state: number) {
    let fxVal = this.devicePropagator.getFx(state);

    if (fxVal === undefined && this.defaultFx !== undefined) {
      fxVal = this.defaultFx.defaultVal;
    }

    return fxVal;
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

  setFxVal(state: number, fxVal: MidiNumber[]) {
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

    // if this input has a default fx, set it now
    if (this.availableFx.length > 0) {
      this.availableFx.forEach((fx) => {
        if (fx.isDefault) {
          this.setFxVal(state, fx.defaultVal);
        }
      });
    }
  }

  /* Restores all default, numeric values (nothing color-related) */
  restoreDefaults() {
    this.number = this.default.number;
    this.statusString = this.default.statusString;
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
        return ['noteon/noteoff', 'controlchange'].includes(this.statusString)
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

    if (this.default.statusString === 'pitchbend') {
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

  get defaultFx(): FxDriver | undefined {
    let fx;
    this.availableFx.forEach((f) => {
      if (f.isDefault) fx = f;
    });

    return fx;
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

    let fx = this.defaultFx;
    this.availableFx.forEach((f) => {
      const contains =
        f.validVals.filter((v) => JSON.stringify(v) === JSON.stringify(fxVal))
          .length > 0;

      if (contains) fx = f;
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
    const et = this.default.statusString;
    const c = this.default.channel;
    const n = this.default.number;

    return et === 'pitchbend' ? `${et}.${c}` : `${et}.${c}.${n}`;
  }

  get statusString(): StatusString | 'noteon/noteoff' {
    return this.outputPropagator.statusString;
  }

  set statusString(statusString: StatusString | 'noteon/noteoff') {
    this.outputPropagator.statusString = statusString;
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
      this.statusString =
        this.statusString === 'noteon/noteoff' ? 'noteon' : this.statusString;
    } else {
      this.statusString = ['noteon', 'noteoff'].includes(this.statusString)
        ? this.default.statusString
        : this.statusString;
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
