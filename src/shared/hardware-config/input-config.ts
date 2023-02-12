import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { inputIdFor } from '../util';
import {
  OverrideablePropagator,
  NStepPropagator,
  createPropagator,
  ContinuousPropagator,
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
  devicePropagator: NStepPropagator;

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
    const colors = availableColors.map((c) =>
      ColorImpl.fromDrivers(c, number, channel)
    );

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
    devicePropagator?: NStepPropagator,
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

    if (devicePropagator) {
      this.devicePropagator = devicePropagator;
    } else {
      const defaultMsg = this.defaultColor
        ? this.defaultColor.deepCopy()
        : undefined;

      const defaultColorConfig = new Map([
        [0, defaultMsg],
        [1, defaultMsg],
      ]);
      this.devicePropagator = new NStepPropagator(r, r, defaultColorConfig);
    }

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
    const arr = this.devicePropagator.responseForStep(state);

    if (arr === undefined) return this.defaultColor;

    let c = this.defaultColor;
    this.availableColors.forEach((color) => {
      if (arr.statusString === color.eventType && arr.value === color.value) {
        c = color;
        c.channel = arr.channel;
      }
    });

    return c;
  }

  getActiveFx(state: number) {
    const msg = this.devicePropagator.responseForStep(state);

    let fx: undefined | FxDriver;
    this.availableFx.forEach((f) => {
      if (msg && f.validVals.includes(msg.channel)) fx = f;
    });

    return fx;
  }

  getFxVal(state: number) {
    return this.devicePropagator.responseForStep(state)?.channel;
  }

  setFx(state: number, fxTitle: string) {
    let isSet = false;

    this.availableFx.forEach((fx) => {
      if (fx.title === fxTitle) {
        isSet = true;
        this.setFxVal(state, fx.defaultVal);
      }
    });

    if (!isSet) {
      throw new Error(`no FX exists for title[${fxTitle}]`);
    }
  }

  setFxVal(state: number, fxVal: Channel) {
    const currentMsg = this.devicePropagator.responseForStep(state);
    if (currentMsg) {
      const deepCopy = currentMsg.deepCopy();
      deepCopy.channel = fxVal;
      this.devicePropagator.setStep(state, deepCopy);
    } else {
      throw new Error(`there is no current response for state[${state}]`);
    }
  }

  /**
   * Set a color for the given state.
   *
   * @param state The state value
   * @param color The color
   */
  setColorForState(state: number, displayName: string) {
    if (state >= this.devicePropagator.nSteps) {
      throw new Error(
        `tried to set step[${state}] when nSteps is ${this.devicePropagator.nSteps}`
      );
    }
    const colors = this.availableColors.filter(
      (c) => c.displayName === displayName
    );

    if (colors.length === 0) {
      throw new Error(
        `color with displayName[${displayName}] is not in availableColors`
      );
    }

    this.devicePropagator.setStep(state, colors[0].deepCopy());
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

  get currentColor(): ColorImpl | undefined {
    const arr = this.devicePropagator.responseForCurrentStep();

    if (arr === undefined) return undefined;

    let c;
    this.availableColors.forEach((color) => {
      if (arr.statusString === color.eventType && arr.value === color.value) {
        c = color.deepCopy();
        c.channel = arr.channel;
      }
    });

    return c;
  }

  get currentFx(): FxDriver | undefined {
    const colorArray = this.devicePropagator.responseForCurrentStep();

    let fx;
    if (colorArray) {
      const { channel } = colorArray;
      this.availableFx.forEach((f) => {
        if (f.validVals.includes(channel)) {
          fx = f;
        }
      });
    }

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
