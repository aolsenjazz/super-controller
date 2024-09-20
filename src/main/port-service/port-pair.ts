import { MessageTransport } from '@shared/message-transport';
import { applyNondestructiveThrottle } from '@shared/util';

import { InputPort } from './input-port';
import { OutputPort } from './output-port';
import { PortInfoPair } from './port-info-pair';

/**
 * Couples sister `Port`s and provides convenience functions for accessing
 * identifying information and connection management functions for both input and
 * output port.
 *
 * 'Sister' ports would be the Input and Output port for a single MIDI device,
 * however, not all MIDI devices provide both an input and output port.
 */
export class PortPair
  extends PortInfoPair<InputPort, OutputPort>
  implements MessageTransport
{
  /**
   * Open the input and/or output ports if not null.
   */
  public close() {
    if (this.iPort !== undefined) this.iPort.close();
    if (this.oPort !== undefined) this.oPort.close();
  }

  /**
   * Send a message through the output port. If output port is null, does nothing.
   */
  public send(msg: number[]) {
    if (this.oPort !== undefined) this.oPort.send(msg);
  }

  /**
   * Set a callback to be invoked when the input port receives a message. If input port is null, does nothing.
   */
  public onMessage(cb: (deltaTime: number, msg: MidiTuple) => void) {
    if (this.iPort !== undefined) {
      this.iPort.onMessage(cb);
    }
  }

  /**
   * Some older 5 pin devices are nice + slow, so they can only process message so
   * fast. In the event that messages are sent too fast, they may not receive
   * excess messages. Applying a nondestructive throttle ensures that every message
   * is received.
   */
  public applyThrottle(throttleMs: number | undefined) {
    if (!throttleMs || throttleMs === 0) return;

    this.send = applyNondestructiveThrottle(this.send.bind(this), throttleMs);
  }
}
