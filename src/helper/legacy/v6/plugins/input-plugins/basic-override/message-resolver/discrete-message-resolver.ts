import type { MonoInteractiveDriver } from '../../../types';
import { statusStringToNibble } from '../util';
import { StateManager } from '../state-manager/state-manager';
import { MessageResolver, MessageResolverDTO } from './message-resolver';

const TWO_BYTES = ['programchange', 'pitchbend'];

export function initMessage(
  statusString: StatusString | 'noteon/noteoff',
  channel: Channel,
  number: MidiNumber,
  value: MidiNumber,
) {
  const defaultStatus =
    statusString === 'noteon/noteoff' ? 'noteon' : statusString;

  if (TWO_BYTES.includes(statusString)) {
    return [
      statusStringToNibble(defaultStatus) + channel,
      number,
    ] as NumberArrayWithStatus;
  }

  return [
    statusStringToNibble(defaultStatus) + channel,
    number,
    value,
  ] as NumberArrayWithStatus;
}

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
    'sysex',
  ] as StatusString[];

  private defaults: Record<number, NumberArrayWithStatus> = {};

  private bindings: Record<number, NumberArrayWithStatus> = {};

  public constructor(
    outputStrategy: StateManager['outputStrategy'],
    driver: MonoInteractiveDriver,
  ) {
    super();
    // init with 1 default binding
    if (outputStrategy === 'constant' || outputStrategy === 'n-step') {
      const def = initMessage(
        driver.status,
        driver.channel,
        driver.number,
        driver.value !== undefined ? driver.value : 127,
      );
      this.bindings[0] = def;
      this.defaults[0] = def;
    }

    // init with 2 default bindings
    if (outputStrategy === 'toggle') {
      const offStatus =
        driver.status === 'noteon/noteoff' ? 'noteoff' : driver.status;
      const off = initMessage(offStatus, driver.channel, driver.number, 0);
      const on = initMessage(driver.status, driver.channel, driver.number, 127);

      this.defaults[0] = off;
      this.bindings[0] = off;

      this.defaults[1] = on;
      this.bindings[1] = on;
    }
  }

  public resolve(
    state: number,
    msg: NumberArrayWithStatus,
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

  public get nSteps() {
    return Object.keys(this.bindings).length;
  }
}
