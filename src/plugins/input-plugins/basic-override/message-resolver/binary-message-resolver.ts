import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { MessageResolver } from './message-resolver';

type BinaryOverride = {
  status: StatusByte;
  channel: Channel;
  number: MidiNumber;
};

export class BinaryMessageResolver extends MessageResolver {
  private bindings: Record<number, BinaryOverride> = {};

  public constructor(driver: MonoInteractiveDriver) {}

  public resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    const override = this.bindings[state];

    if (override) {
      return [
        override.status + override.channel,
        override.number,
        msg[2],
      ] as NumberArrayWithStatus;
    }

    return msg;
  }
}
