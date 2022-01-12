import {
  DeviceConfig,
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';

import Forwarder from './Forwarder';
import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import DeviceConfigPanel from './DeviceConfigPanel';
import MonoInputConfigPanel from './MonoInputConfigPanel';
import XYConfigPanel from './XYConfigPanel';

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
 * @param props Component props
 * @param props.config Configuration of current device
 * @param props.project Current project
 * @param props.selectedInputs The currently-selected inputs
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
  config: DeviceConfig | undefined;
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
  const { selectedInputs, config, project, setProject } = props;
  /* eslint-disable-next-line */
  const isConfigured = project.getDevice(config?.id) ? true : false;
  const asSupported = config as SupportedDeviceConfig;

  let Element: JSX.Element;

  // show a diff view depending on if device is supported, configured, etc
  if (config === undefined)
    Element = <BasicMessage msg="No connected devices." />;
  else if (!isConfigured)
    Element = (
      <NotConfigured
        config={asSupported}
        setProject={setProject}
        project={project}
      />
    );
  else if (!config?.supported) {
    // device is not supported, handle as anonymous device
    Element = (
      <>
        <DeviceConfigPanel
          project={project}
          config={asSupported}
          setProject={setProject}
        />
        <Forwarder
          config={config as AnonymousDeviceConfig}
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
