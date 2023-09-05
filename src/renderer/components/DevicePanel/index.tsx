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

type PropTypes = {
  selectedPort: PortInfo | undefined;
  config: DeviceConfig | undefined;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

export default function DevicePanel(props: PropTypes) {
  const { selectedPort, selectedInputs, setSelectedInputs, config } = props;

  const configured = config !== undefined;
  let Element: React.ReactElement;

  if (selectedPort === undefined) {
    Element = <NoDevicesView />;
  } else if (config === undefined) {
    const driver = DRIVERS.get(selectedPort.name);

    if (driver) {
      if (driver.type === 'adapter') {
        Element = <UsbView />;
      } else {
        const tempConf = SupportedDeviceConfig.fromDriver(
          selectedPort.name,
          selectedPort.siblingIndex,
          driver
        );

        Element = (
          <DeviceLayoutWrapper
            driver={driver}
            config={tempConf}
            selectedInputs={selectedInputs}
            setSelectedInputs={setSelectedInputs}
          />
        );
      }
    } else {
      Element = <NoMatchingDriverView deviceName={selectedPort.name} />;
    }
  } else if (config instanceof AdapterDeviceConfig && !config.child) {
    Element = <SelectAdapterChild />;
  } else {
    const targetConfig =
      config instanceof AdapterDeviceConfig
        ? config.child!
        : (config as SupportedDeviceConfig);

    const driver = DRIVERS.get(targetConfig.driverName);

    Element =
      driver!.name === 'Anonymous' ? (
        <NoPreviewAvailable deviceName={selectedPort.name} />
      ) : (
        <DeviceLayoutWrapper
          driver={driver as DeviceDriver}
          config={targetConfig}
          selectedInputs={selectedInputs}
          setSelectedInputs={setSelectedInputs}
        />
      );
  }

  return (
    <div id="device-panel" className="top-level">
      <div className={`device-container ${configured ? 'configured' : ''}`}>
        {Element}
      </div>
    </div>
  );
}
