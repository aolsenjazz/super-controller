/* eslint @typescript-eslint/no-unused-vars: 0 */

import { useSelectedDevice } from '@context/selected-device-context';
import { useDeviceStub } from '@hooks/use-device-stub';
import { DRIVERS } from '@shared/drivers';
import AdapterNotConfigured from './AdapterNotConfigured';
import BasicNotConfigured from './BasicNotConfigured';

const drivers = new Map(Array.from(DRIVERS.entries()));
const adapters = Array.from(drivers.entries())
  .filter(([_k, v]) => v.type === 'adapter')
  .map(([k]) => k);

export default function OSXNotConfigured() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceStub } = useDeviceStub(selectedDevice || '');

  return adapters.includes(deviceStub?.name || '') ? (
    <AdapterNotConfigured device={deviceStub!} />
  ) : (
    <BasicNotConfigured />
  );
}
