import { MidiArray, create } from '../midi-array';
import { InputResponse } from '../driver-types';
import { Propagator, CorrelatedResponse } from './propagator';

/**
 * Propagates messages to clients. Responds differently depending on `outputResponse`,
 * and can be set to change response behaviour
 */
export abstract class OverrideablePropagator<
  T extends InputResponse,
  U extends CorrelatedResponse<T>
> extends Propagator<T, U> {
  statusString: StatusString | 'noteon/noteoff';

  number: MidiNumber;

  channel: Channel;

  value: MidiNumber = 127;

  constructor(
    hardwareResponse: T,
    outputResponse: U,
    statusString: StatusString | 'noteon/noteoff',
    number: MidiNumber,
    channel: Channel,
    value?: MidiNumber
  ) {
    super(hardwareResponse, outputResponse);

    this.statusString = statusString;
    this.number = number;
    this.channel = channel;

    this.value = value === undefined ? this.value : value;
  }

  /**
   * Returns the next message that should be propagated while in 'constant' mode
   *
   * @returns The message to propagate
   */
  protected handleAsConstant(msg: MidiArray) {
    return create(
      this.nextEventType(msg),
      this.channel,
      this.number,
      this.value
    );
  }

  protected abstract nextEventType(msg: MidiArray): StatusString;
}
