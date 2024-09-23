/* eslint @typescript-eslint/no-unused-vars: 0 */

import { useSelectedDevice } from '@context/selected-device-context';
import { useDeviceConnectionDetails } from '@hooks/use-device-connection-details';
import { DRIVERS } from '@shared/drivers';
import AdapterNotConfigured from './AdapterNotConfigured';
import BasicNotConfigured from './BasicNotConfigured';

const drivers = new Map(Array.from(DRIVERS.entries()));
const adapters = Array.from(drivers.entries())
  .filter(([_k, v]) => v.type === 'adapter')
  .map(([k]) => k);

export default function OSXNotConfigured() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceConnectionDetails } = useDeviceConnectionDetails(
    selectedDevice || ''
  );

  return adapters.includes(deviceConnectionDetails?.name || '') ? (
    <AdapterNotConfigured device={deviceConnectionDetails!} />
  ) : (
    <BasicNotConfigured />
  );
}
