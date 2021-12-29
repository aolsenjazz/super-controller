import DeviceView from './DeviceLayoutWrapper';

import { VirtualDevice } from '../virtual-devices';

import { DeviceConfig, SupportedDeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import { DeviceDriver } from '@shared/driver-types';

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
  config: DeviceConfig | null;
  project: Project;
  selectedInputs: string[];
  setSelectedInputs: (inputs: string[]) => void;
  drivers: Map<string, DeviceDriver>;
};

/**
 * @callback setSelectedInputs
 * @param { string[] } inputs The list of selected inputs
 */

/**
 * Displays the device diagram
 *
 * @param props Component props
 * @param props.config Config for current device
 * @param props.project The current Project
 * @param props.selectedInputs List of ids of the selected inputs
 * @param props.setSelectedInputs sets the selected inputs
 * @param props.drivers The supported drivers
 */
export default function DevicePanel(props: PropTypes) {
  const { config, project, selectedInputs, setSelectedInputs, drivers } = props;

  let Element: React.ReactElement;

  if (config === null) {
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
        project={project}
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
