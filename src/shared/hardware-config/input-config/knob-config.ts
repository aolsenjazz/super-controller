import { MonoInputConfig, InputDefault } from './mono-input-config';
import { InputState } from './base-input-config';
import type { MonoInputDTO } from './mono-input-dto';
import { KnobDriver } from '../../driver-types/input-drivers/knob-driver';

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

export class KnobConfig extends MonoInputConfig<
  KnobDefaults,
  KnobDTO,
  KnobDriver
> {
  defaults: KnobDefaults;

  constructor(deviceId: string, nickname: string, driver: KnobDriver) {
    super(deviceId, nickname, [], driver);

    this.defaults = {
      number: driver.number,
      channel: driver.channel,
      statusString: driver.status,
      response: driver.response,
      knobType: driver.knobType,
    };
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
