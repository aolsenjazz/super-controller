import randomstring from 'randomstring';

import { applyNondestructiveThrottle } from '@shared/util';

import { Port } from './port';
import { DeviceStub } from '@shared/device-stub';

/**
 * Couples input and output ports. Each pair doesn't necessarily have to have both an input and
 * output port; pairs of (iPort && null) or (null ** oPort) may exist.
 */
export class PortPair {
  iPort: Port | null;

  oPort: Port | null;

  connectionId: string;

  constructor(iPort: Port | null, oPort: Port | null) {
    this.iPort = iPort;
    this.oPort = oPort;
    this.connectionId = randomstring.generate();
  }

  /**
   * Open the input and/or output ports if not null.
   */
  open() {
    if (this.iPort !== null) this.iPort.open();
    if (this.oPort !== null) this.oPort.open();
  }

  /**
   * Open the input and/or output ports if not null.
   */
  close() {
    if (this.iPort !== null) this.iPort.close();
    if (this.oPort !== null) this.oPort.close();
  }

  /**
   * Send a message through the output port. If output port is null, does nothing.
   */
  send(msg: number[]) {
    if (this.oPort !== null) this.oPort.send(msg);
  }

  /**
   * Set a callback to be invoked when the input port receives a message. If input port is null, does nothing.
   */
  onMessage(cb: (deltaTime: number, msg: MidiTuple) => void) {
    if (this.iPort !== null) {
      this.iPort.onMessage(cb);
    }
  }

  isPortOpen() {
    const open =
      this.iPort != null ? this.iPort.isPortOpen() : this.oPort?.isPortOpen();

    if (open === undefined)
      throw new Error(`isPortOpen should not be undefined`);

    return open;
  }

  applyThrottle(throttleMs: number | undefined) {
    if (!throttleMs || throttleMs === 0) return;

    this.send = applyNondestructiveThrottle(this.send.bind(this), throttleMs);
  }

  /** getters */
  get hasInput() {
    return this.iPort != null;
  }

  get hasOutput() {
    return this.oPort != null;
  }

  get name() {
    const name = this.iPort != null ? this.iPort.name : this.oPort?.name;

    if (name === undefined) throw new Error(`name should not be undefined`);

    return name;
  }

  get siblingIndex() {
    const occurNum =
      this.iPort !== null ? this.iPort.siblingIndex : this.oPort?.siblingIndex;

    if (occurNum === undefined)
      throw new Error(`occurNum should not be undefined`);

    return occurNum;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
  }

  get stub(): DeviceStub {
    return {
      id: this.id,
      name: this.name,
      siblingIndex: this.siblingIndex,
    };
  }
}
