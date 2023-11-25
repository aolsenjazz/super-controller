import { useSelectedDevice } from '@context/selected-device-context';
import { useConfigDescriptor } from '@hooks/use-config-descriptor';
import { useDeviceDescriptor } from '@hooks/use-device-descriptor';

import { DRIVERS } from '@shared/drivers';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import NoMatchingDriverView from './NoMatchingDriverView';
import NoDevicesView from './NoDevicesView';
import UsbView from './UsbView';
import SelectAdapterChild from './SelectAdapterChild';

export default function DevicePanel() {
  const { selectedDevice } = useSelectedDevice();
  const { descriptor } = useDeviceDescriptor(selectedDevice || '');
  const { configDescriptor } = useConfigDescriptor(selectedDevice || '');

  const driver = DRIVERS.get(descriptor?.name);

  let Element: React.ReactElement;

  if (descriptor === undefined) {
    Element = <NoDevicesView />;
  } else if (driver === undefined) {
    Element = <NoMatchingDriverView deviceName={descriptor.name} />;
  } else if (configDescriptor?.isSupported === true) {
    Element = <DeviceLayoutWrapper driver={driver} />;
  } else if (descriptor.configured) {
    if (configDescriptor?.isAdapterChildSet === true) {
      Element = <DeviceLayoutWrapper driver={driver} />;
    } else {
      return <SelectAdapterChild />;
    }
  } else {
    Element = <UsbView />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div
        className={`device-container ${
          descriptor?.configured ? 'configured' : ''
        }`}
      >
        {Element || null}
      </div>
    </div>
  );
}
