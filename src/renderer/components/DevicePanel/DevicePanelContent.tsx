import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { DeviceConnectionDetails } from '@shared/device-connection-details';
import { DRIVERS, getDriver } from '@shared/drivers';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import NoMatchingDriverView from './NoMatchingDriverView';
import UsbView from './UsbView';
import SelectAdapterChild from './SelectAdapterChild';

type PropTypes = {
  config?: DeviceConfigDTO;
  connectionDetails?: DeviceConnectionDetails;
};

export default function DevicePanelContent(props: PropTypes) {
  const { config, connectionDetails } = props;

  const driverName = config?.driverName || connectionDetails?.name || '';
  const driver = DRIVERS.get(driverName);

  let Element: React.ReactElement;

  if (driverName === 'Anonymous' || driver === undefined) {
    Element = <NoMatchingDriverView deviceName={connectionDetails!.name} />;
  } else if (driver.type === 'adapter' && !config?.child) {
    Element = <UsbView active={config !== undefined} />;
  } else if (driver.type === 'adapter' && config?.child) {
    const childDriver = getDriver(config.child.driverName)!;
    Element = <DeviceLayoutWrapper driver={childDriver} />;
  } else if (driver.type === 'adapter') {
    Element = <SelectAdapterChild />;
  } else {
    Element = <DeviceLayoutWrapper driver={driver} />;
  }

  return (
    <div className={`device-container ${config ? 'configured' : 'disabled'}`}>
      {Element || null}
    </div>
  );
}
