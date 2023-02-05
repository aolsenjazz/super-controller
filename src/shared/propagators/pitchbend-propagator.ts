import { MidiArray } from '../midi-array';
import { CorrelatedResponse } from './propagator';
import { OverrideablePropagator } from './overrideable-propagator';

export class PitchbendPropagator<
  T extends 'continuous',
  U extends CorrelatedResponse<T>
> extends OverrideablePropagator<T, U> {
  constructor(
    outputResponse: U,
    eventType: StatusString | 'noteon/noteoff',
    number: MidiNumber,
    channel: Channel,
    value?: MidiNumber
  ) {
    super('continuous' as T, outputResponse, eventType, number, channel, value);
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
  protected getResponse(msg: MidiArray) {
    const response = MidiArray.create(
      this.nextEventType(),
      this.channel,
      msg[1],
      msg[2]
    );

    return response;
  }
}
