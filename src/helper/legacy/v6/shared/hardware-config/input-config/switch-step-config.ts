import { MonoInteractiveDriver } from '../../driver-types/input-drivers/mono-interactive-driver';
import { SwitchDriver } from '../../driver-types/input-drivers/switch-driver';
import { byteToStatusString, idForMsg } from '../../midi-util';
import { msgEquals } from '../../util';
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

  public driver: MonoInteractiveDriver;

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
    let label: string | null = null;
    driver.steps.forEach((s, i) => {
      if (msgEquals(s, step)) label = driver.stepLabels[i];
    });

    if (label === null) throw new Error('label must not be null');

    this.label = label!;

    // create and set mock driver. because this is a switch step and we treat
    // individual steps like their own input config, we need to create a fake driver
    // so that plugins receive a correct interpretation of this "input"
    this.driver = {
      ...driver,
      status,
      value: step[2] as MidiNumber,
      response: 'constant',
    };
  }

  public toDTO(): SwitchStepDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      label: this.label,
    };
  }
}
