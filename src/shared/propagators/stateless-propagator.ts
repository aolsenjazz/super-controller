import { statusStringToNibble } from '@shared/midi-util';

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
  protected getResponse(msg: NumberArrayWithStatus): NumberArrayWithStatus {
    let response;
    if (this.outputResponse === 'constant') {
      response = this.handleAsConstant(msg);
    } else {
      const nextStatus = this.nextEventType();
      const statusNibble = statusStringToNibble(nextStatus);

      return [(statusNibble | this.channel) as StatusByte, this.number, msg[2]];
    }

    return response;
  }
}
