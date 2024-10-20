import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { statusStringToNibble } from '@shared/midi-util';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface PitchbendMessageResolverDTO
  extends MessageResolverDTO<'PitchbendMessageResolver'> {
  statusOverride: PitchbendMessageResolver['statusOverride'];
  channelOverride: PitchbendMessageResolver['channelOverride'];
}

export class PitchbendMessageResolver extends MessageResolver {
  public eligibleStatuses = ['pitchbend'] as StatusString[];

  private statusOverride: StatusByte;

  private channelOverride: Channel;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    if (driver.status === 'noteon/noteoff')
      throw new Error(
        'continuous resolvers must not be used for noteon/noteoff inputs'
      );

    this.statusOverride = statusStringToNibble(driver.status);
    this.channelOverride = driver.channel;
  }

  public resolve(
    _state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    return [
      this.statusOverride + this.channelOverride,
      msg[1],
      msg[2],
    ] as NumberArrayWithStatus;
  }

  public toDTO(): PitchbendMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,
      statusOverride: this.statusOverride,
      channelOverride: this.channelOverride,
      className: 'PitchbendMessageResolver',
    };
  }
}
