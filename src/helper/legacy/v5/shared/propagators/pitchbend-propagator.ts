import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import { OverrideablePropagator } from './overrideable-propagator';

@Revivable.register
export class PitchbendPropagator extends OverrideablePropagator<
  'continuous',
  'continuous' | 'constant'
> {
  constructor(
    outputResponse: 'continuous' | 'constant',
    statusString: StatusString | 'noteon/noteoff',
    number: MidiNumber,
    channel: Channel,
  ) {
    super('continuous', outputResponse, statusString, number, channel, 64);
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.outputResponse, this.statusString, this.number, this.channel],
    };
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
    const response = create(
      this.nextEventType(),
      this.channel,
      msg[1] as MidiNumber,
      msg[2] as MidiNumber,
    );

    // eslint-disable-next-line prefer-destructuring
    this.value = msg[2] as MidiNumber;

    return response;
  }
}
