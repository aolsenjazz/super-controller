import { MidiArray, create } from '../midi-array';
import { OverrideablePropagator } from './overrideable-propagator';
import { InputResponse } from '../driver-types';

export abstract class StatelessPropagator<
  T extends InputResponse,
  U extends InputResponse
> extends OverrideablePropagator<T, U> {
  nextEventType() {
    return this.statusString as StatusString;
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
      response = create(
        this.nextEventType(),
        this.channel,
        this.number,
        msg[2] as MidiNumber
      );
    }

    return response;
  }
}
