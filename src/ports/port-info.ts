export type PortIdentifier = {
  id: string;

  name: string;

  occurrenceNumber: number;
};

export class PortInfo implements PortIdentifier {
  id: string;

  name: string;

  occurrenceNumber: number;

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
