import type { MonoInteractiveDriver } from '../../../types';
import { statusStringToNibble } from '../util';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface PitchbendMessageResolverDTO
  extends MessageResolverDTO<'PitchbendMessageResolver'> {
  defaultStatus: PitchbendMessageResolver['defaultStatus'];
  defaultChannel: PitchbendMessageResolver['defaultChannel'];

  statusOverride: PitchbendMessageResolver['statusOverride'];
  channelOverride: PitchbendMessageResolver['channelOverride'];
}

export class PitchbendMessageResolver extends MessageResolver {
  public eligibleStatuses = ['pitchbend'] as StatusString[];

  private readonly defaultStatus = 'pitchbend';

  private readonly defaultChannel: Channel;

  private statusOverride: 'pitchbend' | 'controlchange';

  private channelOverride: Channel;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    if (driver.status === 'noteon/noteoff')
      throw new Error(
        'continuous resolvers must not be used for noteon/noteoff inputs',
      );

    this.defaultChannel = driver.channel;

    this.statusOverride = driver.status as 'pitchbend';
    this.channelOverride = driver.channel;
  }

  public resolve(
    _state: number,
    msg: NumberArrayWithStatus,
  ): NumberArrayWithStatus {
    return [
      statusStringToNibble(this.statusOverride) + this.channelOverride,
      msg[1],
      msg[2],
    ] as NumberArrayWithStatus;
  }

  public toDTO(): PitchbendMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,
      statusOverride: this.statusOverride,
      channelOverride: this.channelOverride,
      defaultStatus: this.defaultStatus,
      defaultChannel: this.defaultChannel,
      className: 'PitchbendMessageResolver',
    };
  }

  public applyDTO(other: PitchbendMessageResolverDTO) {
    this.statusOverride = other.statusOverride;
    this.channelOverride = other.channelOverride;
  }
}
