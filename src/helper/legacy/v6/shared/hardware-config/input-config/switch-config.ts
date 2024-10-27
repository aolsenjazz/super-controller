import { MessageProcessorMeta } from '../../message-processor';
import { byteToStatusString } from '../../midi-util';
import { SwitchDriver } from '../../driver-types/input-drivers/switch-driver';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';
import { SwitchStepConfig, SwitchStepDTO } from './switch-step-config';
import { PluginProvider } from '../../plugin-provider';

export interface SwitchDTO extends MonoInputDTO {
  steps: SwitchStepDTO[];
}

export class SwitchConfig extends MonoInputConfig {
  public defaults: InputDefault;

  public type = 'switch' as const;

  public steps: SwitchStepConfig[] = [];

  public constructor(
    deviceId: string,
    nickname: string,
    driver: SwitchDriver,
    stepDTOs?: SwitchStepDTO[]
  ) {
    super(deviceId, nickname, [], driver);

    const initialStep = driver.steps[driver.initialStep];
    this.defaults = {
      statusString: byteToStatusString(initialStep[0], true),
      number: initialStep[1] as MidiNumber,
      channel: (initialStep[0] & 0x0f) as Channel,
      response: 'n-step',
    };

    for (let i = 0; i < driver.steps.length; i++) {
      let plugins: string[] = [];
      if (stepDTOs && stepDTOs.length > i) plugins = stepDTOs[i].plugins;

      const stepConfig = new SwitchStepConfig(
        deviceId,
        '',
        plugins,
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

  public initDefaultPlugins(provider: PluginProvider) {
    this.steps.forEach((s) => s.initDefaultPlugins(provider));
  }

  public applyStub(dto: SwitchDTO) {
    super.applyStub(dto);
  }

  public getPlugins() {
    return this.steps.map((s) => s.getPlugins()).flatMap((a) => a);
  }
}
