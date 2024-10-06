import { KnobDriver } from '../../driver-types';
import { MonoInputConfig, InputDefault } from './mono-input-config';
import { InputState } from './base-input-config';
import type { MonoInputDTO } from './mono-input-dto';

export interface KnobDTO extends MonoInputDTO<KnobDefaults> {
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
  static fromDriver(deviceId: string, d: KnobDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
      knobType: d.knobType,
    };

    return new KnobConfig(deviceId, '', [], def);
  }

  applyStub(s: KnobDTO) {
    super.applyStub(s);
  }

  public toDTO(): KnobDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
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
