import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { statusStringToNibble } from '@shared/midi-util';
import { StateManager } from '../state-manager/state-manager';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

export interface DiscreteMessageResolverDTO
  extends MessageResolverDTO<'DiscreteMessageResolver'> {
  bindings: DiscreteMessageResolver['bindings'];
  defaults: DiscreteMessageResolver['defaults'];
}

export class DiscreteMessageResolver extends MessageResolver {
  public eligibleStatuses = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ] as StatusString[];

  private defaults: Record<number, NumberArrayWithStatus> = {};

  private bindings: Record<number, NumberArrayWithStatus> = {};

  public constructor(
    outputStrategy: StateManager['outputStrategy'],
    driver: MonoInteractiveDriver
  ) {
    super();
    // set default values
    const defaultStatus =
      driver.status === 'noteon/noteoff' ? 'noteon' : driver.status;

    // create override default bindings
    const statusByte = (statusStringToNibble(defaultStatus) +
      driver.channel) as StatusByte;

    // init with 1 default binding
    if (outputStrategy === 'constant' || outputStrategy === 'n-step') {
      this.bindings[0] = [statusByte, driver.number, 127];
      this.defaults[0] = [statusByte, driver.number, 127];
    }

    // init with 2 default bindings
    if (outputStrategy === 'toggle') {
      const off = [statusByte === 144 ? 128 : statusByte, driver.number, 0];
      const on = [statusByte, driver.number, 127];

      this.defaults[0] = off as NumberArrayWithStatus;
      this.bindings[0] = off as NumberArrayWithStatus;

      this.defaults[1] = on as NumberArrayWithStatus;
      this.bindings[1] = on as NumberArrayWithStatus;
    }
  }

  public resolve(
    state: number,
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus {
    return this.bindings[state] || msg;
  }

  public toDTO(): DiscreteMessageResolverDTO {
    return {
      eligibleStatuses: this.eligibleStatuses,
      bindings: this.bindings,
      defaults: this.defaults,
      className: 'DiscreteMessageResolver',
    };
  }

  public applyDTO(other: DiscreteMessageResolverDTO) {
    this.bindings = other.bindings;
    this.defaults = other.defaults;
  }
}
