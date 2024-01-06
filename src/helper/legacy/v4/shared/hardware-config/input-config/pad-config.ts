/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { InputDefault } from './mono-input-config';
import {
  OverrideablePropagator,
  ColorConfigPropagator,
  createPropagator,
} from '../../propagators';
import { LightCapableInputConfig } from './light-capable-input-config';
import { InputResponse, PadDriver, FxDriver, Color } from '../../driver-types';

@Revivable.register
export class PadConfig extends LightCapableInputConfig {
  defaultValue?: MidiNumber;

  static fromDriver(d: PadDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const prop = createPropagator(
      d.response,
      d.response,
      d.status,
      d.number,
      d.channel,
      d.value
    );

    return new PadConfig(
      def,
      d.availableColors,
      d.availableFx,
      prop,
      undefined,
      d.value
    );
  }

  constructor(
    defaultVals: InputDefault,
    availableColors: Color[],
    availableFx: FxDriver[],
    outputPropagator: OverrideablePropagator<InputResponse, InputResponse>,
    devicePropagator?: ColorConfigPropagator,
    defaultValue?: MidiNumber,
    nickname?: string
  ) {
    super(
      defaultVals,
      availableColors,
      availableFx,
      outputPropagator,
      devicePropagator,
      nickname
    );
    this.defaultValue = defaultValue;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.defaults,
        this.availableColors,
        this.availableFx,
        this.outputPropagator,
        this.devicePropagator,
        this.defaultValue,
        this.nickname,
      ],
    };
  }

  restoreDefaults() {
    super.restoreDefaults();

    if (this.defaultValue !== undefined) {
      this.value = this.defaultValue;
    }
  }

  get eligibleResponses() {
    const gateC = 'gate' as const;
    const togC = 'toggle' as const;
    const constC = 'constant' as const;

    switch (this.defaults.response) {
      case 'gate':
        return [gateC, togC, constC];
      case 'toggle':
        return [togC, constC];
      case 'constant':
        return ['noteon/noteoff', 'controlchange'].includes(this.statusString)
          ? [togC, constC]
          : [constC];
      default:
        throw new Error(`unrecognized response ${this.defaults.response}`);
    }
  }

  get eligibleStatusStrings() {
    return (
      this.response === 'constant'
        ? ['noteon', 'noteoff', 'controlchange', 'programchange']
        : ['noteon/noteoff', 'controlchange', 'programchange']
    ) as StatusString[];
  }

  get value(): MidiNumber {
    return this.outputPropagator.value;
  }

  set value(value: MidiNumber) {
    this.outputPropagator.value = value;
  }

  get eligibleLightResponses() {
    const gateC = 'gate' as const;
    const togC = 'toggle' as const;

    switch (this.defaults.response) {
      case 'constant':
      case 'gate':
        return [gateC, togC];
      case 'toggle':
        return [togC];
      default:
        return [];
    }
  }

  get eligibleLightStates() {
    return [0, 1];
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
        ? this.defaults.statusString
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
