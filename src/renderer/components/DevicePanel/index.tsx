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

  if (selectedDevice === undefined || (!deviceStub && !configStub)) {
    Element = <NoDevicesView />;
  } else if (driverName === 'Anonymous' || driver === undefined) {
    Element = <NoMatchingDriverView deviceName={deviceStub!.name} />;
  } else if (isSupported === true && !configStub) {
    Element =
      driver.type === 'adapter' ? (
        <UsbView />
      ) : (
        <DeviceLayoutWrapper driver={driver} />
      );
  } else if (driver.type === 'adapter' && configStub!.child) {
    const childDriver = getDriver(configStub!.child.driverName!);
    Element = <DeviceLayoutWrapper driver={childDriver} />;
  } else if (driver.type === 'adapter') {
    Element = <SelectAdapterChild />;
  } else {
    Element = <DeviceLayoutWrapper driver={driver} />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div className={`device-container ${configStub ? 'configured' : ''}`}>
        {Element || null}
      </div>
    </div>
  );
}
