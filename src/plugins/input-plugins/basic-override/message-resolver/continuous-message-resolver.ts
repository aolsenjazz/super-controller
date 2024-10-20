import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { statusStringToNibble } from '@shared/midi-util';
import { MessageResolver } from './message-resolver';

export class ContinuousMessageResolver extends MessageResolver {
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
}
