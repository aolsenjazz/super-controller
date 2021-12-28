import Forwarder from './Forwarder';
import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import DeviceConfigPanel from './DeviceConfigPanel';
import MonoInputConfigPanel from './MonoInputConfigPanel';
import XYConfigPanel from './XYConfigPanel';

import {
  DeviceConfig,
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
} from '../../../hardware-config';
import { Project } from '../../../project';
import { InputGroup } from '../../input-group';

type InputConfigurationProps = {
  config: SupportedDeviceConfig;
  project: Project;
  selectedInputs: string[];
  setProject: (p: Project) => void;
};

/**
 * Parent for configuration controls
 *
 * @param { object } props Component props
 * @param { SupportedDeviceConfig } props.config Configuration of current device
 * @param { Project } props.project Current project
 * @param { string[] } props.selectedInputs The currently-selected inputs
 */
function InputConfiguration(props: InputConfigurationProps) {
  const { config, project, selectedInputs, setProject } = props;

  const group = new InputGroup(selectedInputs.map((i) => config.getInput(i)));

  // display config panel for multi-input control if necessary, other single-input control panel
  const InputConfigPanel = group.isMultiInput ? (
    <XYConfigPanel
      project={project}
      config={config}
      group={group}
      setProject={setProject}
    />
  ) : (
    <MonoInputConfigPanel
      project={project}
      config={config}
      group={group}
      title="MIDI Settings"
      setProject={setProject}
    />
  );

  return (
    <>
      <DeviceConfigPanel
        project={project}
        config={config}
        setProject={setProject}
      />
      {InputConfigPanel}
    </>
  );
}

type PropTypes = {
  device: DeviceConfig | null;
  project: Project;
  selectedInputs: string[];
  setProject: (p: Project) => void;
};

/**
 * Parent for device and input configuration controls, or a status message
 *
 * @param props Component props
 * @param props.project Current project
 * @param props.selectedInputs Currently-selected inputs
 * @param props.setProject Updated the project in frontend
 */
export default function ConfigPanel(props: PropTypes) {
  const { selectedInputs, device, project, setProject } = props;
  /* eslint-disable-next-line */
  const isConfigured = project.getDevice(device?.id) ? true : false;
  const asSupported = device as SupportedDeviceConfig;

  let Element: JSX.Element;

  // show a diff view depending on if device is supported, configured, etc
  if (device === null) Element = <BasicMessage msg="No connected devices." />;
  else if (!isConfigured)
    Element = (
      <NotConfigured
        config={asSupported}
        setProject={setProject}
        project={project}
      />
    );
  else if (!device.supported) {
    // device is not supported, handle as anonymous device
    Element = (
      <>
        <DeviceConfigPanel
          project={project}
          config={asSupported}
          setProject={setProject}
        />
        <Forwarder
          config={device as AnonymousDeviceConfig}
          project={project}
          setProject={setProject}
        />
      </>
    );
  } else if (selectedInputs.length === 0) {
    Element = (
      <>
        <DeviceConfigPanel
          project={project}
          config={asSupported}
          setProject={setProject}
        />
        <BasicMessage msg="No inputs selected." />
      </>
    );
  } else {
    Element = (
      <InputConfiguration
        selectedInputs={selectedInputs}
        project={project}
        config={asSupported}
        setProject={setProject}
      />
    );
  }

  return (
    <div id="config-panel" className="top-level">
      {Element}
    </div>
  );
}
