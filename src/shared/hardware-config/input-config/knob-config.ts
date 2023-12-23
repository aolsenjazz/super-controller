import * as Revivable from '../../revivable';
import { ContinuousPropagator } from '../../propagators';
import { KnobDriver } from '../../driver-types';
import {
  MonoInputConfig,
  InputDefault,
  MonoInputConfigStub,
} from './mono-input-config';
import { InputState } from './base-input-config';

export interface KnobConfigStub extends MonoInputConfigStub {
  knobType: 'absolute' | 'endless';
  valueType: 'absolute' | 'endless';
  type: 'knob';
}

export interface KnobState extends InputState {
  value: number;
}

@Revivable.register
export class KnobConfig extends MonoInputConfig {
  readonly knobType: 'endless' | 'absolute';

  outputPropagator: ContinuousPropagator;

  static fromDriver(d: KnobDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const prop = new ContinuousPropagator(
      'continuous',
      d.status,
      d.number,
      d.channel,
      undefined,
      d.knobType
    );

    return new KnobConfig(def, prop, d.knobType);
  }

  constructor(
    defaultVals: InputDefault,
    outputPropagator: ContinuousPropagator,
    knobType: 'endless' | 'absolute',
    nickname?: string
  ) {
    super(defaultVals, outputPropagator, nickname);
    this.outputPropagator = outputPropagator;
    this.knobType = knobType;
  }

  applyStub(s: KnobConfigStub) {
    super.applyStub(s);

    this.valueType = s.valueType;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.defaults,
        this.outputPropagator,
        this.knobType,
        this.nickname,
      ],
    };
  }

  restoreDefaults() {
    super.restoreDefaults();

    this.valueType = this.knobType;
  }

  get config(): KnobConfigStub {
    return {
      defaults: this.defaults,
      statusString: this.statusString,
      outputResponse: this.response,
      channel: this.channel,
      number: this.number,
      value: this.value,
      knobType: this.knobType,
      valueType: this.valueType,
      type: 'knob',
    };
  }

  get state(): KnobState {
    return {
      value: this.outputPropagator.value,
    };
  }

  // TODO: Why on earth is this valueType? Should really just use knobType
  // and store the defaultKnobType in a defaults object
  get valueType() {
    return this.outputPropagator.valueType;
  }

  set valueType(type: 'endless' | 'absolute') {
    this.outputPropagator.valueType = type;
  }

  get response(): 'continuous' | 'constant' {
    return this.outputPropagator.outputResponse;
  }

  set response(response: 'continuous' | 'constant') {
    this.outputPropagator.outputResponse = response;
  }
}
