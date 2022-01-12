import { DeviceConfig, SupportedDeviceConfig } from '@shared/hardware-config';

import DeviceView from './DeviceLayoutWrapper';

import { VirtualDevice } from '../virtual-devices';

const { driverService } = window;
const drivers = driverService.getDrivers();

/**
 * Tell the user that there aren't any devices connected (nor configured)
 */
function NoDevicesView() {
  return <p id="no-devices">No connected devices.</p>;
}

/**
 * Tell the user that this device isn't supported
 */
function UnsupportedView() {
  return (
    <div id="unsupported-device">
      <p>No preview available.</p>
      <div className="help-tip">
        <p>
          This device doesn&apos;t have a driver yet. You can still override
          events manually and set its nickname in the configuration panel.
        </p>
      </div>
    </div>
  );
}

type PropTypes = {
  config: DeviceConfig | undefined;
  configured: boolean;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
};

/**
 * @callback setSelectedInputs
 * @param inputs The list of selected inputs
 */

/**
 * Displays the device diagram
 *
 * @param props Component props
 * @param props.config Config for current device
 * @param props.configured Has the current device been added to the project?
 * @param props.selectedInputs List of ids of the selected inputs
 * @param props.setSelectedInputs sets the selected inputs
 * @param props.drivers The supported drivers
 */
export default function DevicePanel(props: PropTypes) {
  const { config, configured, selectedInputs, setSelectedInputs } = props;

  let Element: React.ReactElement;

  if (config === undefined) {
    Element = <NoDevicesView />;
  } else if (config.supported === false) {
    Element = <UnsupportedView />;
  } else {
    const nonUndefinedConfig = config as SupportedDeviceConfig;

    const driver = drivers.get(nonUndefinedConfig.name);

    if (driver === undefined)
      throw new Error(`unable to locate driver for ${nonUndefinedConfig.name}`);

    const vDevice = new VirtualDevice(nonUndefinedConfig.id, driver);

    Element = (
      <DeviceView
        device={vDevice}
        config={nonUndefinedConfig}
        configured={configured}
        selectedInputs={selectedInputs}
        setSelectedInputs={setSelectedInputs}
      />
    );
  }

  return (
    <div id="device-panel" className="top-level">
      <div className="device-container">{Element}</div>
    </div>
  );
}
