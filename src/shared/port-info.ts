/**
 * Basic information used to identify a port
 */
export type PortIdentifier = {
  /* `${name} ${occurrenceNumber}` */
  id: string;

  /* Device-reported name */
  name: string;

  /* nth-occurrence of device. Relevant when >1 devices of same model are connected */
  occurrenceNumber: number;
};

/**
 * Contains identifying information and connection status. useful for describing
 * devices which are configured, but not connected
 */
export class PortInfo implements PortIdentifier {
  /* `${name} ${occurrenceNumber}` */
  id: string;

  /* Device-reported name */
  name: string;

  /* nth-occurrence of device. Relevant when >1 devices of same model are connected */
  occurrenceNumber: number;

  /* is a device with matching ID connected? */
  connected: boolean;

  constructor(
    id: string,
    name: string,
    occurrenceNumber: number,
    connected: boolean
  ) {
    this.id = id;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;
    this.connected = connected;
  }
}
