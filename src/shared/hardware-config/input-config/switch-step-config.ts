import { SwitchDriver } from '@shared/driver-types/input-drivers/switch-driver';
import { byteToStatusString, idForMsg } from '@shared/midi-util';
import { msgEquals } from '@shared/util';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';

export interface SwitchStepDTO extends MonoInputDTO {
  label: string;
}

export class SwitchStepConfig extends MonoInputConfig {
  public defaults: InputDefault;

  public type = 'switch' as const;

  public label: string;

  /**
   * Switch step IDs need to be value-inclusive; just using channel, number,
   * statusstring may not necessarily be enough to determine the identity of a
   * switch step.
   */
  public id: string;

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
      value: step[2] as MidiNumber,
    };
    this.id = `${idForMsg(step)}.${step[2]}`;

    // this is gross, but failing fast is ok here :)
    let label: string;
    driver.steps.forEach((s, i) => {
      if (msgEquals(s, step)) label = driver.stepLabels[i];
    });
    this.label = label!;
  }

  public toDTO(): SwitchStepDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      label: this.label,
    };
  }
}
