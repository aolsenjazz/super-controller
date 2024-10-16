import { byteToStatusString } from '@shared/midi-util';
import { SwitchDriver } from '../../driver-types/input-drivers/switch-driver';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';

export interface SwitchDTO extends MonoInputDTO {
  steps: NumberArrayWithStatus[];
  bindings: Record<string, NumberArrayWithStatus>;
}

export class SwitchConfig extends MonoInputConfig<
  InputDefault,
  SwitchDTO,
  SwitchDriver
> {
  public defaults: InputDefault;

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

  public toDTO() {
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

  public applyDTO(dto: SwitchDTO) {
    this.bindings = dto.bindings;
  }
}
