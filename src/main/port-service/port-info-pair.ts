import { DeviceStub } from '@shared/device-stub';
import { PortInfo } from '@shared/port-info';

export class PortInfoPair {
  iPort: PortInfo | null;

  oPort: PortInfo | null;

  constructor(iPort: PortInfo | null, oPort: PortInfo | null) {
    this.iPort = iPort;
    this.oPort = oPort;
  }

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
