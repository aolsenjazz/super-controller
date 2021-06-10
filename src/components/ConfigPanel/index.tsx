import React from 'react';

import BasicMessage from './BasicMessage';
import NotConfigured from './NotConfigured';
import DeviceConfigPanel from './DeviceConfigPanel';
import MonoInputConfigPanel from './MonoInputConfigPanel';
import XYConfigPanel from './XYConfigPanel';

import { DeviceConfig, SupportedDeviceConfig } from '../../hardware-config';
import { Project } from '../../project';
import { InputGroup } from '../../input-group';

type InputConfigurationProps = {
  device: SupportedDeviceConfig;
  project: Project;
  group: InputGroup;
};

function InputConfiguration(props: InputConfigurationProps) {
  const { device, project, group } = props;

  const InputConfigPanel = group.isMultiInput ? (
    <XYConfigPanel project={project} device={device} group={group} />
  ) : (
    <MonoInputConfigPanel
      project={project}
      device={device}
      group={group}
      title="MIDI Settings"
    />
  );

  return (
    <>
      <DeviceConfigPanel project={project} config={device} />
      {InputConfigPanel}
    </>
  );
}

type PropTypes = {
  device: DeviceConfig | null;
  project: Project;
  selectedInputs: string[];
};

export default function ConfigPanel(props: PropTypes) {
  const { selectedInputs, device, project } = props;
  /* eslint-disable-next-line */
  const isConfigured = project.getDevice(device?.id) ? true : false;
  const asSupported = device as SupportedDeviceConfig;

  const group = new InputGroup(
    selectedInputs.map((i) => asSupported?.getInput(i))
  );

  const element = (() => {
    if (device === null) return <BasicMessage msg="No connected devices." />;

    if (!device.supported) return <BasicMessage msg="" />;

    if (!isConfigured) return <NotConfigured config={asSupported} />;

    if (selectedInputs.length === 0)
      return (
        <>
          <DeviceConfigPanel project={project} config={asSupported} />
          <BasicMessage msg="No inputs selected." />
        </>
      );

    return (
      <>
        <InputConfiguration
          group={group}
          project={project}
          device={asSupported}
        />
      </>
    );
  })();

  return (
    <div id="config-panel" className="top-level">
      {element}
    </div>
  );
}
