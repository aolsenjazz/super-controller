import * as Revivable from '../../revivable';
import { ContinuousPropagator } from '../../propagators';
import { KnobDriver } from '../../driver-types';
import {
  MonoInputConfig,
  InputDefault,
  MonoInputConfigStub,
} from './mono-input-config';
import { InputState } from './base-input-config';

export interface KnobConfigStub extends MonoInputConfigStub<KnobDefaults> {
  valueType: 'absolute' | 'endless';
  type: 'knob';
}

export interface KnobState extends InputState {
  value: number;
}

interface KnobDefaults extends InputDefault {
  knobType: 'endless' | 'absolute';
}

@Revivable.register
export class KnobConfig extends MonoInputConfig<KnobDefaults> {
  outputPropagator: ContinuousPropagator;

  static fromDriver(d: KnobDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
      knobType: d.knobType,
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
    defaultVals: KnobDefaults,
    outputPropagator: ContinuousPropagator,
    nickname?: string
  ) {
    super(defaultVals, outputPropagator, nickname);
    this.outputPropagator = outputPropagator;
  }

  applyStub(s: KnobConfigStub) {
    super.applyStub(s);

    this.valueType = s.valueType;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.defaults, this.outputPropagator, this.nickname],
    };
  }

  get config(): KnobConfigStub {
    return {
      id: this.id,
      defaults: this.defaults,
      colorCapable: false,
      statusString: this.statusString,
      outputResponse: this.response,
      channel: this.channel,
      number: this.number,
      value: this.value,
      valueType: this.valueType,
      type: 'knob',
    };
  }

  get state(): KnobState {
    return {
      value: this.outputPropagator.value,
    };
  }

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
