import { useState, useEffect } from 'react';

import {
  DeviceConfig,
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
  AdapterDeviceConfig,
  BaseInputConfig,
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
import { useSelectedDevice } from '@context/selected-device-context';
import { useSelectedInputs } from '@context/selected-inputs-context';
import { DeviceStub } from '@shared/device-stub';
import { useConfigStub } from '@hooks/use-config-stub';

const { deviceService } = window;

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
    setGroup(new InputGroup(inputs as BaseInputConfig[]));
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
          inputConfig={group.inputs[0] as SwitchConfig}
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

export default function ConfigPanel() {
  const { selectedDevice } = useSelectedDevice();
  const { selectedInputs } = useSelectedInputs();
  const { configStub } = useConfigStub(selectedDevice || '');

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  }

  if (configStub === undefined) {
    Element = <NotConfigured />;
  } else if (configStub instanceof AdapterDeviceConfig && !configStub.child) {
    // Element = (
    //   <AdapterView config={config} project={project} setProject={setProject} />
    // );
  } else {
    // configured = project.getDevice(config.id) !== undefined;
    // if (config.driverName === 'Anonymous') {
    //   Element = (
    //     <Translator
    //       config={config as AnonymousDeviceConfig}
    //       project={project}
    //       setProject={setProject}
    //     />
    //   );
    // } else if (selectedInputs.length === 0) {
    //   Element = <BasicMessage msg="No inputs selected." />;
    // } else {
    //   Element = (
    //     <InputConfiguration
    //       project={project}
    //       config={config as SupportedDeviceConfig}
    //       setProject={setProject}
    //     />
    //   );
    // }
  }

  return (
    <div id="config-panel" className="top-level">
      {configStub && <DeviceConfigPanel config={configStub} />}
      {Element}
    </div>
  );
}
