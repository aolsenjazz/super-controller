import { MidiArray } from '../midi-array';
import { OverrideablePropagator } from './overrideable-propagator';
import { CorrelatedResponse } from './propagator';

export class StatelessPropagator extends OverrideablePropagator<
  'continuous' | 'toggle',
  CorrelatedResponse<'continuous' | 'toggle'>
> {
  nextEventType() {
    return this.eventType as StatusString;
  }

  /**
   * Returns the next message to propagate given the received message
   *
   * @param msg The message to respond to
   * @returns The message to propagate
   */
  protected getResponse(msg: MidiArray) {
    let response;
    if (this.outputResponse === 'constant') {
      response = this.handleAsConstant(msg);
    } else {
      response = MidiArray.create(
        this.nextEventType(),
        this.channel,
        this.number,
        msg[2]
      );
    }

    return response;
  }
}
