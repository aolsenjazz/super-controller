import {
  DeviceConfig,
  SupportedDeviceConfig,
  AdapterDeviceConfig,
} from '@shared/hardware-config';
import { DeviceDriver } from '@shared/driver-types';
import { DRIVERS } from '@shared/drivers';
import { PortInfo } from '@shared/port-info';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import NoMatchingDriverView from './NoMatchingDriverView';
import NoDevicesView from './NoDevicesView';
import NoPreviewAvailable from './NoPreviewAvailableView';
import UsbView from './UsbView';
import SelectAdapterChild from './SelectAdapterChild';
import { DeviceDescriptor } from '@shared/hardware-config/descriptors/device-descriptor';
import { useEffect, useState } from 'react';
import { useDevice } from 'renderer/context/device-context';
import { useSelectedInputs } from 'renderer/context/selected-inputs-context';

const { deviceService } = window;

export default function DevicePanel() {
  const { selectedDevice } = useDevice();
  const [descriptor, setDescriptor] = useState<DeviceDescriptor>();

  // TODO: at some point this will be put in a custom hook
  useEffect(() => {
    const cb = (desc: DeviceDescriptor) => {
      setDescriptor(desc);
    };

    const off = deviceService.onDeviceChange(selectedDevice || '', cb);
    deviceService.requestDeviceDescriptor(selectedDevice || '');

    return () => off();
  }, [selectedDevice]);

  let Element: React.ReactElement;

  if (descriptor === undefined) {
    Element = <NoDevicesView />;
  } else if (descriptor.configured === false) {
    const driver = DRIVERS.get(descriptor.driverName);

    if (driver) {
      if (driver.type === 'adapter') {
        Element = <UsbView />;
      } else {
        Element = <DeviceLayoutWrapper driver={driver} />;
      }
    } else {
      Element = <NoMatchingDriverView deviceName={descriptor.name} />;
    }
  }
  // else if (config instanceof AdapterDeviceConfig && !config.child) {
  //   Element = <SelectAdapterChild />;
  // }
  else {
    // const targetConfig =
    //   config instanceof AdapterDeviceConfig
    //     ? config.child!
    //     : (config as SupportedDeviceConfig);

    // const driver = DRIVERS.get(targetConfig.driverName);
    const driver = DRIVERS.get(descriptor.driverName);

    Element = (
      // driver!.name === 'Anonymous' ? (
      //   <NoPreviewAvailable deviceName={selectedPort.name} />
      // ) : (
      <DeviceLayoutWrapper driver={driver as DeviceDriver} />
    );
    // );
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
