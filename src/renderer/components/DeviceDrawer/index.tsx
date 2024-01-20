import DeviceDetailsPanel from './DeviceDetailsPanel';
import DeviceListPanel from './DeviceListPanel';

export default function DeviceDrawer() {
  return (
    <div id="device-drawer" className="top-level">
      <DeviceDetailsPanel />
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: 5 }} />
      <DeviceListPanel />
    </div>
  );
}
