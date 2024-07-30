/**
 * Basic information used to identify a port
 */
export type PortIdentifier = {
  /* `${name} ${siblingIndex}` */
  readonly id: string;

  /* Device-reported name */
  readonly name: string;

  /* nth-occurrence of device. Relevant when >1 devices of same model are connected */
  siblingIndex: number;
};

/**
 * Contains identifying information and connection status. useful for describing
 * devices which are configured, but not connected
 */
export class PortInfo {
  /* Device-reported name */
  name: string;

  /* nth-occurrence of device. Relevant when >1 devices of same model are connected */
  siblingIndex: number;

  /* is a device with matching ID connected? */
  connected: boolean;

  constructor(name: string, siblingIndex: number, connected: boolean) {
    this.name = name;
    this.siblingIndex = siblingIndex;
    this.connected = connected;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
  }
}
