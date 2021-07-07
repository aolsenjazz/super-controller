import React from 'react';

import DeviceView from './DeviceLayoutWrapper';

import { DeviceConfig, SupportedDeviceConfig } from '../hardware-config';
import { VirtualDevice } from '../virtual-devices';
import { DRIVERS } from '../drivers';
import { Project } from '../project';

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
};

/**
 * @callback setSelectedInputs
 * @param { string[] } inputs The list of selected inputs
 */

/**
 * Displays the device diagram
 *
 * @param { object } props Component props
 * @param { DeviceConfig | null } props.config Config for current device
 * @param { Project } props.project The current Project
 * @param { string[] } props.selectedInputs List of ids of the selected inputs
 * @param { setSelectedInputs } props.setSelectedInputs sets the selected inputs
 */
export default function DevicePanel(props: PropTypes) {
  const { config, project, selectedInputs, setSelectedInputs } = props;

  let Element: React.ReactElement;

  if (config === null) {
    Element = <NoDevicesView />;
  } else if (config.supported === false) {
    Element = <UnsupportedView />;
  } else {
    const nonUndefinedConfig = config as SupportedDeviceConfig;
    const vDevice = new VirtualDevice(
      nonUndefinedConfig.id,
      DRIVERS.get(nonUndefinedConfig.name)!
    );

    Element = (
      <DeviceView
        device={vDevice!}
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
