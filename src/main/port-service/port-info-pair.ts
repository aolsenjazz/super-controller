import type { DeviceConnectionDetails } from '@shared/device-connection-details';
import { PortInfo } from '@shared/port-info';

import { InputPort } from './input-port';
import { OutputPort } from './output-port';

/**
 * Couples sister `Port`s and provides convenience functions for accessing
 * identifying information for both input and output port.
 *
 * 'Sister' ports would be the Input and Output port for a single MIDI device,
 * however, not all MIDI devices provide both an input and output port.
 */
export class PortInfoPair<
  InputType extends PortInfo | InputPort = PortInfo,
  OutputType extends PortInfo | OutputPort = PortInfo
> {
  public iPort?: InputType;

  public oPort?: OutputType;

  constructor(iPort?: InputType, oPort?: OutputType) {
    this.iPort = iPort;
    this.oPort = oPort;
  }

  /**
   * Returns the name of the input port if exists, or output port if it doesn't.
   * Throws if both ports are undefined
   */
  public get name() {
    const name = this.iPort?.name || this.oPort?.name;

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
  public get siblingIndex() {
    const occurNum = this.iPort?.siblingIndex || this.oPort?.siblingIndex || 0;

    if (occurNum === undefined)
      throw new Error(`occurNum should not be undefined`);

    return occurNum;
  }

  public get id() {
    return `${this.name} ${this.siblingIndex}`;
  }

  public get stub(): DeviceConnectionDetails {
    return {
      id: this.id,
      name: this.name,
      siblingIndex: this.siblingIndex,
    };
  }
}
