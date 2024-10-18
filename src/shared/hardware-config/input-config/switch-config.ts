import { byteToStatusString } from '@shared/midi-util';
import { SwitchDriver } from '../../driver-types/input-drivers/switch-driver';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';

export class SwitchConfig extends MonoInputConfig<
  InputDefault,
  MonoInputDTO,
  SwitchDriver
> {
  public defaults: InputDefault;

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
    };
  }

  public process(): NumberArrayWithStatus | undefined {
    throw new Error(
      'SwitchConfigs shoudlnt process messages; this is the responsbility of its children'
    );
  }

  public init() {
    // noop, for now
  }

  public applyStub(dto: MonoInputDTO) {
    super.applyStub(dto);
  }
}
