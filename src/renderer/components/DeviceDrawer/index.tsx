import { useSelectedDevice } from '@context/selected-device-context';

import DeviceDetailsPanel from './DeviceDetailsPanel';
import DeviceListPanel from './DeviceListPanel';

export default function DeviceDrawer() {
  const { selectedDevice } = useSelectedDevice();

  const Element = selectedDevice ? (
    <>
      <DeviceDetailsPanel selectedDevice={selectedDevice} />
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: 5 }} />
      <DeviceListPanel />
    </>
  ) : null;

  return (
    <div id="device-drawer" className="top-level">
      {Element}
    </div>
  );
}
