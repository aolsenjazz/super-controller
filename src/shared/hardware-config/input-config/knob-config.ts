import * as Revivable from '../../revivable';
import { ContinuousPropagator } from '../../propagators';
import { InputResponse, KnobDriver } from '../../driver-types';
import { MonoInputConfig, InputDefault } from './mono-input-config';

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

  get eligibleResponses() {
    return ['continuous', 'constant'] as InputResponse[];
  }

  get valueType() {
    return this.outputPropagator.valueType;
  }

  set valueType(type: 'endless' | 'absolute') {
    this.outputPropagator.valueType = type;
  }

  get eligibleStatusStrings() {
    return [
      'noteon',
      'noteoff',
      'controlchange',
      'programchange',
    ] as StatusString[];
  }

  get response(): 'continuous' | 'constant' {
    return this.outputPropagator.outputResponse;
  }

  set response(response: 'continuous' | 'constant') {
    this.outputPropagator.outputResponse = response;
  }
}
