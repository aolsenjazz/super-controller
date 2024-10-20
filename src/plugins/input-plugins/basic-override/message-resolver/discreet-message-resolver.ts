import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface DiscreetMessageResolverDTO
  extends MessageResolverDTO<'DiscreetMessageResolver'> {
  bindings: DiscreetMessageResolver['bindings'];
}

export class DiscreetMessageResolver extends MessageResolver {
  public eligibleStatuses = [
    'noteon',
    'noteoff',
    'controlchange',
    'pitchbend',
  ] as StatusString[];

  private bindings: Record<number, NumberArrayWithStatus> = {};

  public constructor(_driver: MonoInteractiveDriver) {
    super();
  }

  public resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    return this.bindings[state] || msg;
  }

  public toDTO(): DiscreetMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,
      bindings: this.bindings,
      className: 'DiscreetMessageResolver',
    };
  }
}
