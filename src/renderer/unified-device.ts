import { DeviceConnectionDetails } from '@shared/device-connection-details';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';

export interface UnifiedDevice {
  id: string;
  config?: DeviceConfigDTO;
  connectionDetails?: DeviceConnectionDetails;
}
