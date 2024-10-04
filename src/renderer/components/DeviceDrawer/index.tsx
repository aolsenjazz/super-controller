import { useSelector } from 'react-redux';

import { selectSelectedDevice } from '@selectors/selected-device-selector';

import DeviceDetailsPanel from './DeviceDetailsPanel';
import DeviceListPanel from './DeviceListPanel';

export default function DeviceDrawer() {
  const selectedDevice = useSelector(selectSelectedDevice);

  const Element = selectedDevice ? (
    <>
      <DeviceDetailsPanel selectedDevice={selectedDevice} />
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: 5 }} />
      <DeviceListPanel selectedDevice={selectedDevice} />
    </>
  ) : null;

  return (
    <div id="device-drawer" className="top-level">
      {Element}
    </div>
  );
}
