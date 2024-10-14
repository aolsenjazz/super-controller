import { SwitchDriver } from '@shared/driver-types/input-drivers/switch-driver';
import { MessageProcessorMeta } from '../../message-processor';
import { msgEquals } from '../../util';
import { BaseInputConfig, InputDTO } from './base-input-config';

export interface SwitchDTO extends InputDTO {
  steps: NumberArrayWithStatus[];
  bindings: Record<string, NumberArrayWithStatus>;
}

export class SwitchConfig extends BaseInputConfig<SwitchDTO, SwitchDriver> {
  // TODO: lol, this goes in a plugin
  public bindings: Record<string, NumberArrayWithStatus> = {};

  public type = 'switch' as const;

  public constructor(deviceId: string, nickname: string, driver: SwitchDriver) {
    super(deviceId, nickname, driver);
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
