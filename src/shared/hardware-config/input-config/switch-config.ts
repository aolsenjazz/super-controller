import { byteToStatusString } from '@shared/midi-util';
import { SwitchDriver } from '../../driver-types/input-drivers/switch-driver';
import { msgEquals, msgIdentityEquals } from '../../util';
import { BaseInputConfig, InputDefaults, InputDTO } from './base-input-config';

export interface SwitchDTO extends InputDTO {
  steps: NumberArrayWithStatus[];
  bindings: Record<string, NumberArrayWithStatus>;
}

export class SwitchConfig extends BaseInputConfig<SwitchDTO, SwitchDriver> {
  public defaults: InputDefaults;

  public bindings: Record<string, NumberArrayWithStatus> = {};

  public type = 'switch' as const;

  public constructor(deviceId: string, nickname: string, driver: SwitchDriver) {
    super(deviceId, nickname, [], driver);

    const initialStep = driver.steps[driver.initialStep];

    this.defaults = {
      statusString: byteToStatusString(initialStep[0], true),
      number: initialStep[1] as MidiNumber,
      channel: (initialStep[0] & 0x0f) as Channel,
      response: 'enumerated',
    };
  }

  public toDTO(): SwitchDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      steps: this.driver.steps,
      bindings: this.bindings,
    };
  }

  public process(
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus | undefined {
    return msg;
  }

  public init() {
    // noop, for now
  }

  public isOriginator(msg: NumberArrayWithStatus): boolean {
    for (let i = 0; i < this.driver.steps.length; i++) {
      if (msgEquals(msg, this.driver.steps[i])) {
        return true;
      }
    }

    return false;
  }

  public applyDTO(dto: SwitchDTO) {
    this.bindings = dto.bindings;
  }
}
