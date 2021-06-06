import { PortIdentifier } from '../ports/port-info';

/**
 * Base interface for SupportedDeviceConfig and UnsupportedDeviceConfig.
 */
export interface DeviceConfig extends PortIdentifier {
  /* True if a driver exists for the given name */
  readonly supported: boolean;

  /* Device-reported name */
  readonly name: string;

  readonly occurrenceNumber: number;

  /* `${name} ${occurrenceNumber}` */
  id: string;
}
