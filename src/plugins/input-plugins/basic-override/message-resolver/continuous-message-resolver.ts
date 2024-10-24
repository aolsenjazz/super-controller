import type { MonoInteractiveDriver } from '../../../types';
import { statusStringToNibble } from '../util';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface ContinuousMessageResolverDTO
  extends MessageResolverDTO<'ContinuousMessageResolver'> {
  defaultStatus: ContinuousMessageResolver['defaultStatus'];
  defaultChannel: ContinuousMessageResolver['defaultChannel'];
  defaultNumber: ContinuousMessageResolver['defaultNumber'];
  defaultValue: ContinuousMessageResolver['defaultValue'];

  statusOverride: ContinuousMessageResolver['statusOverride'];
  channelOverride: ContinuousMessageResolver['channelOverride'];
  numberOverride: ContinuousMessageResolver['numberOverride'];
  valueOverride: ContinuousMessageResolver['valueOverride'];
}

export class ContinuousMessageResolver extends MessageResolver {
  public eligibleStatuses = [
    'noteon',
    'noteoff',
    'controlchange',
    'pitchbend',
  ] as StatusString[];

  private readonly defaultStatus: StatusString;

  private readonly defaultChannel: Channel;

  private readonly defaultNumber: MidiNumber;

  // this won't be set in continuous input drivers
  private readonly defaultValue: MidiNumber = 127;

  private statusOverride: StatusString;

  private channelOverride: Channel;

  private numberOverride: MidiNumber;

  // this will only be used if a user has set output response to constant
  private valueOverride: MidiNumber;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    if (driver.status === 'noteon/noteoff')
      throw new Error(
        'continuous resolvers must not be used for noteon/noteoff inputs'
      );

    this.defaultStatus = driver.status;
    this.defaultChannel = driver.channel;
    this.defaultNumber = driver.number;

    this.statusOverride = driver.status;
    this.channelOverride = driver.channel;
    this.numberOverride = driver.number;
    this.valueOverride = this.defaultValue;
  }

  public resolve(
    _state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    return [
      statusStringToNibble(this.statusOverride) + this.channelOverride,
      this.numberOverride,
      msg[2],
    ] as NumberArrayWithStatus;
  }

  public toDTO(): ContinuousMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,

      defaultStatus: this.defaultStatus,
      defaultChannel: this.defaultChannel,
      defaultNumber: this.defaultNumber,
      defaultValue: this.defaultValue,

      statusOverride: this.statusOverride,
      channelOverride: this.channelOverride,
      numberOverride: this.numberOverride,
      valueOverride: this.valueOverride,

      className: 'ContinuousMessageResolver',
    };
  }

  public applyDTO(other: ContinuousMessageResolverDTO) {
    this.statusOverride = other.statusOverride;
    this.channelOverride = other.channelOverride;
    this.numberOverride = other.numberOverride;
    this.valueOverride = other.valueOverride;
  }
}
