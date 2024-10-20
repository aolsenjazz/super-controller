import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { statusStringToNibble } from '@shared/midi-util';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface ContinuousMessageResolverDTO
  extends MessageResolverDTO<'ContinuousMessageResolver'> {
  statusOverride: ContinuousMessageResolver['statusOverride'];
  channelOverride: ContinuousMessageResolver['channelOverride'];
  numberOverride: ContinuousMessageResolver['numberOverride'];
}

export class ContinuousMessageResolver extends MessageResolver {
  public eligibleStatuses = [
    'noteon',
    'noteoff',
    'controlchange',
    'pitchbend',
  ] as StatusString[];

  private statusOverride: StatusByte;

  private channelOverride: Channel;

  private numberOverride: MidiNumber;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    if (driver.status === 'noteon/noteoff')
      throw new Error(
        'continuous resolvers must not be used for noteon/noteoff inputs'
      );

    this.statusOverride = statusStringToNibble(driver.status);
    this.channelOverride = driver.channel;
    this.numberOverride = driver.number;
  }

  public resolve(
    _state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    return [
      this.statusOverride + this.channelOverride,
      this.numberOverride,
      msg[2],
    ] as NumberArrayWithStatus;
  }

  public toDTO(): ContinuousMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,
      statusOverride: this.statusOverride,
      channelOverride: this.channelOverride,
      numberOverride: this.numberOverride,
      className: 'ContinuousMessageResolver',
    };
  }
}
