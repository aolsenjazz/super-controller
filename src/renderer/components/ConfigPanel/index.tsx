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
import { PortInfo } from '@shared/port-info';

import Translator from './Translator';
import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import DeviceConfigPanel from './DeviceConfigPanel';
import MonoInputConfigPanel from './MonoInputConfigPanel';
import AdapterView from './AdapterView';
import XYConfigPanel from './XYConfigPanel';
import SwitchConfigPanel from './SwitchConfigPanel';

import { InputGroup } from '../../input-group';
import { useDevice } from 'renderer/context/device-context';
import { useSelectedInputs } from 'renderer/context/selected-inputs-context';
import { DeviceDescriptor } from '@shared/hardware-config/descriptors/device-descriptor';

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
  const { selectedDevice } = useDevice();
  const { selectedInputs } = useSelectedInputs();

  const [deviceDesc, setDeviceDesc] = useState<DeviceDescriptor>();

  // TODO: this can likely go in its own provider, depending on useDevice()
  useEffect(() => {
    if (selectedDevice === undefined) setDeviceDesc(undefined);

    const cb = (d: DeviceDescriptor) => {
      setDeviceDesc(d);
    };

    const off = deviceService.onDeviceChange(selectedDevice || '', cb);

    return () => off();
  }, [selectedDevice]);

  let Element: JSX.Element | null = null;

  if (selectedDevice === undefined) {
    Element = <BasicMessage msg="No connected devices." />;
  }

  if (deviceDesc === undefined) {
    Element = <NotConfigured />;
  } else if (config instanceof AdapterDeviceConfig && !config.child) {
    Element = (
      <AdapterView config={config} project={project} setProject={setProject} />
    );
  } else {
    configured = project.getDevice(config.id) !== undefined;

    if (config.driverName === 'Anonymous') {
      Element = (
        <Translator
          config={config as AnonymousDeviceConfig}
          project={project}
          setProject={setProject}
        />
      );
    } else if (selectedInputs.length === 0) {
      Element = <BasicMessage msg="No inputs selected." />;
    } else {
      Element = (
        <InputConfiguration
          project={project}
          config={config as SupportedDeviceConfig}
          setProject={setProject}
        />
      );
    }
  }

  return (
    <div id="config-panel" className="top-level">
      {configured ? (
        <DeviceConfigPanel
          project={project}
          config={config as DeviceConfig}
          setProject={setProject}
        />
      ) : null}
      {Element}
    </div>
  );
}
