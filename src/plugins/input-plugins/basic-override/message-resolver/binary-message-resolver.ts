import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface BinaryMessageResolverDTO
  extends MessageResolverDTO<'BinaryMessageResolver'> {
  bindings: BinaryMessageResolver['bindings'];
}

type BinaryOverride = {
  status: StatusByte;
  channel: Channel;
  number: MidiNumber;
};

export class BinaryMessageResolver extends MessageResolver {
  public eligibleStatuses = [
    'noteon/noteoff',
    'controlchange',
  ] as StatusString[];

  private bindings: Record<number, BinaryOverride> = {};

  public constructor(_driver: MonoInteractiveDriver) {
    super();
  }

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

  public toDTO(): BinaryMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,
      bindings: this.bindings,
      className: 'BinaryMessageResolver' as const,
    };
  }
}
