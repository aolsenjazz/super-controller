import { MonoInteractiveDriver } from '../../../types';
import { statusStringToNibble } from '../util';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface BinaryMessageResolverDTO
  extends MessageResolverDTO<'BinaryMessageResolver'> {
  defaultStatus: BinaryMessageResolver['defaultStatus'];
  defaultChannel: BinaryMessageResolver['defaultChannel'];
  defaultNumber: BinaryMessageResolver['defaultNumber'];
  defaultValue: BinaryMessageResolver['defaultValue'];

  statusOverride: BinaryMessageResolver['statusOverride'];
  channelOverride: BinaryMessageResolver['channelOverride'];
  numberOverride: BinaryMessageResolver['numberOverride'];
  valueOverride: BinaryMessageResolver['valueOverride'];
}

export class BinaryMessageResolver extends MessageResolver {
  public eligibleStatuses = [
    'noteon/noteoff',
    'controlchange',
  ] as StatusString[];

  private readonly defaultStatus: StatusString | 'noteon/noteoff';

  private readonly defaultChannel: Channel;

  private readonly defaultNumber: MidiNumber;

  private readonly defaultValue: MidiNumber = 127;

  private statusOverride: StatusString | 'noteon/noteoff';

  private channelOverride: Channel;

  private numberOverride: MidiNumber;

  private valueOverride: MidiNumber;

  public constructor(driver: MonoInteractiveDriver) {
    super();

    this.defaultStatus = driver.status;
    this.defaultChannel = driver.channel;
    this.defaultNumber = driver.number;

    this.statusOverride = driver.status;
    this.channelOverride = driver.channel;
    this.numberOverride = driver.number;
    this.valueOverride = this.defaultValue;
  }

  public resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    let status = this.statusOverride;

    if (this.statusOverride === 'noteon/noteoff') {
      status = state === 1 ? 'noteon' : 'noteoff';
    }

    if (status === 'noteon/noteoff')
      throw new Error('compiler is not satisfied!');

    const value = state === 1 ? msg[2] : 0;

    return [
      statusStringToNibble(status) + this.channelOverride,
      this.numberOverride,
      value,
    ] as NumberArrayWithStatus;
  }

  public toDTO(): BinaryMessageResolverDTO {
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

      className: 'BinaryMessageResolver' as const,
    };
  }

  public applyDTO(other: BinaryMessageResolverDTO) {
    this.statusOverride = other.statusOverride;
    this.channelOverride = other.channelOverride;
    this.numberOverride = other.numberOverride;
    this.valueOverride = other.valueOverride;
  }
}
