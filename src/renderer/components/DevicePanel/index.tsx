import { useSelectedDevice } from '@context/selected-device-context';
import { useDeviceConnectionDetails } from '@hooks/use-device-connection-details';
import { DRIVERS, getDriver } from '@shared/drivers';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import NoMatchingDriverView from './NoMatchingDriverView';
import NoDevicesView from './NoDevicesView';
import UsbView from './UsbView';
import SelectAdapterChild from './SelectAdapterChild';
import { useDeviceConfig } from '@hooks/use-device-config';

export default function DevicePanel() {
  const { selectedDevice } = useSelectedDevice();

  const { deviceConnectionDetails } = useDeviceConnectionDetails(
    selectedDevice || ''
  );
  const { deviceConfig } = useDeviceConfig(selectedDevice || '');

  const driverName =
    deviceConfig?.driverName || deviceConnectionDetails?.name || '';
  const isSupported =
    deviceConfig !== undefined || getDriver(driverName) !== undefined;
  const driver = DRIVERS.get(driverName);

  let Element: React.ReactElement;

  if (
    selectedDevice === undefined ||
    (!deviceConnectionDetails && !deviceConfig)
  ) {
    Element = <NoDevicesView />;
  } else if (deviceConnectionDetails === undefined) {
    Element = <NoDevicesView />;
  } else if (driverName === 'Anonymous' || driver === undefined) {
    Element = (
      <NoMatchingDriverView deviceName={deviceConnectionDetails!.name} />
    );
  } else if (isSupported === true && !deviceConfig) {
    Element =
      driver.type === 'adapter' ? (
        <UsbView />
      ) : (
        <DeviceLayoutWrapper driver={driver} />
      );
  } else if (driver.type === 'adapter' && deviceConfig!.child) {
    const childDriver = getDriver(deviceConfig!.child.driverName!)!;
    Element = <DeviceLayoutWrapper driver={childDriver} />;
  } else if (driver.type === 'adapter') {
    Element = <SelectAdapterChild />;
  } else {
    Element = <DeviceLayoutWrapper driver={driver} />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div className={`device-container ${deviceConfig ? 'configured' : ''}`}>
        {Element || null}
      </div>
    </div>
  );
}
