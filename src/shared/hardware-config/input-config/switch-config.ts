import { MessageProcessorMeta } from '@shared/message-processor';
import { byteToStatusString } from '@shared/midi-util';
import { SwitchDriver } from '../../driver-types/input-drivers/switch-driver';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';
import { SwitchStepConfig, SwitchStepDTO } from './switch-step-config';

export interface SwitchDTO extends MonoInputDTO {
  steps: SwitchStepDTO[];
}

export class SwitchConfig extends MonoInputConfig {
  public defaults: InputDefault;

  public type = 'switch' as const;

  private steps: SwitchStepConfig[] = [];

  public constructor(deviceId: string, nickname: string, driver: SwitchDriver) {
    super(deviceId, nickname, [], driver);

    const initialStep = driver.steps[driver.initialStep];
    this.defaults = {
      statusString: byteToStatusString(initialStep[0], true),
      number: initialStep[1] as MidiNumber,
      channel: (initialStep[0] & 0x0f) as Channel,
      response: 'enumerated',
    };

    for (let i = 0; i < driver.steps.length; i++) {
      const stepConfig = new SwitchStepConfig(
        deviceId,
        '',
        [],
        driver,
        driver.steps[i]
      );
      this.steps.push(stepConfig);
    }
  }

  public toDTO() {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      steps: this.steps.map((s) => s.toDTO()),
    };
  }

  public process(
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined {
    const step = this.steps.find((s) => s.defaults.value === msg[2]);
    return step!.process(msg, meta);
  }

  public init() {
    // noop, for now
  }

  public applyStub(dto: SwitchDTO) {
    super.applyStub(dto);
  }
}
