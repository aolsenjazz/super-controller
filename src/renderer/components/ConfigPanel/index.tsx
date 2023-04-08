import { useState, useEffect } from 'react';

import {
  DeviceConfig,
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
  AdapterDeviceConfig,
  InputConfig,
} from '@shared/hardware-config';
import { SwitchConfig } from '@shared/hardware-config/input-config';
import { Project } from '@shared/project';

import Translator from './Translator';
import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import DeviceConfigPanel from './DeviceConfigPanel';
import MonoInputConfigPanel from './MonoInputConfigPanel';
import AdapterView from './AdapterView';
import XYConfigPanel from './XYConfigPanel';
import SwitchConfigPanel from './SwitchConfigPanel';

import { InputGroup } from '../../input-group';

type InputConfigurationProps = {
  config: SupportedDeviceConfig;
  selectedInputs: string[];
  project: Project;
  setProject: (p: Project) => void;
};

function InputConfiguration(props: InputConfigurationProps) {
  const { config, project, selectedInputs, setProject } = props;

  const [group, setGroup] = useState(new InputGroup([]));

  // when selectedInputs/config change, update
  useEffect(() => {
    const inputs = selectedInputs.map((i) => config.getInput(i));
    setGroup(new InputGroup(inputs as InputConfig[]));
  }, [selectedInputs, config]);

  // display config panel for multi-input control if necessary, otherwise single-input control panel
  let InputConfigPanel;
  if (group.isMultiInput) {
    InputConfigPanel = (
      <XYConfigPanel
        project={project}
        config={config}
        group={group}
        setProject={setProject}
      />
    );
  } else {
    const isSwitchSelected =
      group.inputs.filter((i) => i instanceof SwitchConfig).length > 0;
    const isMultipleSelected = group.inputs.length > 1;

    if (isSwitchSelected) {
      InputConfigPanel = isMultipleSelected ? (
        <BasicMessage msg="The selected inputs don't share any fields." />
      ) : (
        <SwitchConfigPanel
          deviceConfig={config}
          inputConfig={group.inputs[0]}
          project={project}
          setProject={setProject}
        />
      );
    } else {
      InputConfigPanel = (
        <MonoInputConfigPanel
          project={project}
          config={config}
          group={group}
          title="MIDI Settings"
          setProject={setProject}
        />
      );
    }
  }

  return <>{InputConfigPanel}</>;
}

type PropTypes = {
  config: DeviceConfig | undefined;
  project: Project;
  selectedInputs: string[];
  setProject: (p: Project) => void;
};

export default function ConfigPanel(props: PropTypes) {
  const { selectedInputs, config, project, setProject } = props;

  let Element: JSX.Element | null = null;

  if (config === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  } else if (config instanceof AdapterDeviceConfig && !config.isSet) {
    Element = (
      <AdapterView config={config} setProject={setProject} project={project} />
    );
  } else if (config instanceof AnonymousDeviceConfig) {
    Element = (
      <Translator config={config} project={project} setProject={setProject} />
    );
  } else {
    const isConfigured = project.getDevice(config.id) !== undefined;

    // show a diff view depending on if device is supported, configured, etc
    if (!isConfigured)
      Element = (
        <NotConfigured
          config={config as SupportedDeviceConfig}
          setProject={setProject}
          project={project}
        />
      );
    else if (!config.supported) {
      // device is not supported, handle as anonymous device
    } else if (selectedInputs.length === 0) {
      Element = <BasicMessage msg="No inputs selected." />;
    } else {
      Element = (
        <InputConfiguration
          selectedInputs={selectedInputs}
          project={project}
          config={config as SupportedDeviceConfig}
          setProject={setProject}
        />
      );
    }
  }

  return (
    <div id="config-panel" className="top-level">
      {config !== undefined ? (
        <DeviceConfigPanel
          project={project}
          config={config}
          setProject={setProject}
        />
      ) : null}
      {Element}
    </div>
  );
}
