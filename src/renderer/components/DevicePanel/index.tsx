import {
  DeviceConfig,
  SupportedDeviceConfig,
  AdapterDeviceConfig,
} from '@shared/hardware-config';
import { DeviceDriver } from '@shared/driver-types';
import { DRIVERS } from '@shared/drivers';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import UnsupportedView from './UnsupportedView';
import NoDevicesView from './NoDevicesView';
import UsbView from './UsbView';

type PropTypes = {
  config: DeviceConfig | undefined;
  configured: boolean;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

export default function DevicePanel(props: PropTypes) {
  const { config, configured, selectedInputs, setSelectedInputs } = props;

  let Element: React.ReactElement;

  if (config === undefined) {
    Element = <NoDevicesView />;
  } else if (config.supported === false) {
    Element = <UnsupportedView deviceName={config.name} />;
  } else if (config instanceof AdapterDeviceConfig && config.isSet) {
    Element = <UsbView />;
  } else {
    const targetConfig =
      config instanceof AdapterDeviceConfig
        ? config.child!
        : (config as SupportedDeviceConfig);

    const driver = DRIVERS.get(targetConfig.name);

    Element = (
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
