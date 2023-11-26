import { useSelectedDevice } from '@context/selected-device-context';
import { useConfigStub } from '@hooks/use-config-stub';
import { useDeviceStub } from '@hooks/use-device-stub';

import { DRIVERS, getDriver } from '@shared/drivers';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import NoMatchingDriverView from './NoMatchingDriverView';
import NoDevicesView from './NoDevicesView';
import UsbView from './UsbView';
import SelectAdapterChild from './SelectAdapterChild';

export default function DevicePanel() {
  const { selectedDevice } = useSelectedDevice();

  const { deviceStub } = useDeviceStub(selectedDevice || '');
  const { configStub } = useConfigStub(selectedDevice || '');

  const driverName = configStub?.driverName || deviceStub?.name || '';
  const isSupported =
    configStub !== undefined || getDriver(driverName) !== undefined;
  const driver = DRIVERS.get(driverName);

  let Element: React.ReactElement;

  if (selectedDevice === undefined) {
    Element = <NoDevicesView />;
  } else if (driver === undefined) {
    Element = <NoMatchingDriverView deviceName={deviceStub?.name || ''} />;
  } else if (isSupported === true) {
    Element = <DeviceLayoutWrapper driver={driver} />;
  } else if (configStub) {
    if (configStub.isAdapterChildSet === true) {
      Element = <DeviceLayoutWrapper driver={driver} />;
    } else {
      return <SelectAdapterChild />;
    }
  } else {
    Element = <UsbView />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div className={`device-container ${configStub ? 'configured' : ''}`}>
        {Element || null}
      </div>
    </div>
  );
}
