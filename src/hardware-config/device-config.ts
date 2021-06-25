import { PortIdentifier } from '../ports/port-info';

/**
 * Base interface for SupportedDeviceConfig and UnsupportedDeviceConfig.
 */
export interface DeviceConfig extends PortIdentifier {
  /* True if a driver exists for the given name */
  readonly supported: boolean;

  /* Device-reported name */
  readonly name: string;

  /* nth-occurence of this device. applicable if > 1 device of same model is connected/configured */
  readonly occurrenceNumber: number;

  /* `${name} ${occurrenceNumber}` */
  id: string;
}
