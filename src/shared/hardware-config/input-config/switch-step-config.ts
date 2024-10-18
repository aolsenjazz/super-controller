import { SwitchDriver } from '@shared/driver-types/input-drivers/switch-driver';
import { byteToStatusString } from '@shared/midi-util';
import { InputDefault, MonoInputConfig } from './mono-input-config';

export class SwitchStepConfig extends MonoInputConfig {
  public defaults: InputDefault;

  public type = 'switch' as const;

  constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: SwitchDriver,
    step: NumberArrayWithStatus
  ) {
    super(deviceId, nickname, plugins, driver);

    const status = byteToStatusString(step[0]);

    this.defaults = {
      number: step[1] as MidiNumber,
      channel: (step[0] & 0x0f) as Channel,
      statusString: status,
      response: 'constant' as const,
    };
  }

  public toDTO() {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
    };
  }
}
