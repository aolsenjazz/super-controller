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
  value: MidiNumber;
}

interface KnobDefaults extends InputDefault {
  knobType: 'endless' | 'absolute';
}

export class KnobConfig extends MonoInputConfig<KnobDefaults> {
  static fromDriver(d: KnobDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
      knobType: d.knobType,
    };

    return new KnobConfig('', [], def);
  }

  applyStub(s: KnobConfigStub) {
    super.applyStub(s);
  }

  get config(): KnobConfigStub {
    return {
      ...super.config,
      valueType: this.defaults.knobType, // TODO: this will be buggy
      type: this.type,
    };
  }

  get state() {
    return { value: 0 };
  }

  get type() {
    return 'knob' as const;
  }
}
