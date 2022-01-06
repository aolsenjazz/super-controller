import { MidiValue } from 'midi-message-parser';

import { Port } from './port';

/**
 * Couples input and output ports. Each pair doesn't necessarily have to have both an input and
 * output port; pairs of (iPort && null) or (null ** oPort) may exist.
 */
export class PortPair {
  iPort: Port | null;

  oPort: Port | null;

  constructor(iPort: Port | null, oPort: Port | null) {
    this.iPort = iPort;
    this.oPort = oPort;
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
  send(msg: MidiValue[]) {
    if (this.oPort !== null) this.oPort.send(msg);
  }

  /**
   * Set a callback to be invoked when the input port receives a message. If input port is null, does nothing.
   */
  onMessage(cb: (deltaTime: number, msg: number[]) => void) {
    if (this.iPort !== null) {
      this.iPort.onMessage(cb);
    }
  }

  equals(other: PortPair) {
    if (this.hasInput !== other.hasInput) return false;
    if (this.hasOutput !== other.hasOutput) return false;
    if (this.name !== other.name) return false;
    if (this.occurrenceNumber !== other.occurrenceNumber) return false;
    return true;
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

  get occurrenceNumber() {
    const occurNum =
      this.iPort !== null
        ? this.iPort.occurrenceNumber
        : this.oPort?.occurrenceNumber;

    if (occurNum === undefined)
      throw new Error(`occurNum should not be undefined`);

    return occurNum;
  }

  get id() {
    return `${this.name} ${this.occurrenceNumber}`;
  }
}
