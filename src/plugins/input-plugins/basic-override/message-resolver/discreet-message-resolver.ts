import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { MessageResolver } from './message-resolver';

export class DiscreetMessageResolver extends MessageResolver {
  private bindings: Record<number, NumberArrayWithStatus> = {};

  public constructor(driver: MonoInteractiveDriver) {}

  public resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    return this.bindings[state] || msg;
  }
}
