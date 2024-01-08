import { DeviceStub } from '@shared/device-stub';
import { PortInfo } from '@shared/port-info';

/**
 * Couples sister `Port`s and provides convenience functions for accessing
 * identifying information for both input and output port.
 *
 * 'Sister' ports would be the Input and Output port for a single MIDI device,
 * however, not all MIDI devices provide both an input and output port.
 *
 * TODO: no reason to have iPort and oPort be PortInfo | null; can just be PortInfo?
 */
export class PortInfoPair {
  iPort: PortInfo | null;

  oPort: PortInfo | null;

  constructor(iPort: PortInfo | null, oPort: PortInfo | null) {
    this.iPort = iPort;
    this.oPort = oPort;
  }

  /**
   * Returns the name of the input port if exists, or output port if it doesn't.
   * Throws if both ports are undefined
   */
  get name() {
    const name = this.iPort != null ? this.iPort.name : this.oPort?.name;

    if (name === undefined) throw new Error(`name should not be undefined`);

    return name;
  }

  /**
   * Returns the siblingIndex of the input port if exists, or output port if it doesn't.
   * Throws if both ports are undefined
   *
   * 'SiblingIndex' is relevant when two devices of the same model exist. OSX (and likely
   * other) OS's don't disambiguate between the two devices; they will both appear as
   * DeviceName in the system registry. This number is used to disambiguate
   */
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
