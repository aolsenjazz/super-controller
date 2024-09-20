import { statusStringToNibble } from '@shared/midi-util';
import { OverrideablePropagator } from './overrideable-propagator';

export class PitchbendPropagator extends OverrideablePropagator<
  'continuous',
  'continuous' | 'constant'
> {
  constructor(
    outputResponse: 'continuous' | 'constant',
    statusString: StatusString | 'noteon/noteoff',
    number: MidiNumber,
    channel: Channel
  ) {
    super('continuous', outputResponse, statusString, number, channel, 64);
  }

  protected nextEventType() {
    return 'pitchbend' as StatusString;
  }

  /**
   * Returns the next message to propagate given the received message
   *
   * @param msg The message to respond to
   * @returns The message to propagate
   */
  protected getResponse(msg: NumberArrayWithStatus) {
    const nextStatus = this.nextEventType();
    const statusNibble = statusStringToNibble(nextStatus);
    const response = [
      (statusNibble | this.channel) as StatusByte,
      msg[1],
      msg[2],
    ] as NumberArrayWithStatus;

    // eslint-disable-next-line prefer-destructuring
    this.value = msg[2] as MidiNumber;

    return response;
  }
}
