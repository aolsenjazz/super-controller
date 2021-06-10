import React from 'react';

import MonoInputConfigPanel from './MonoInputConfigPanel';

import { SupportedDeviceConfig } from '../../hardware-config';
import { InputGroup } from '../../input-group';
import { Project } from '../../project';

type PropTypes = {
  group: InputGroup;
  project: Project;
  device: SupportedDeviceConfig;
};

export default function XYConfigPanel(props: PropTypes) {
  const { group, device, project } = props;

  const xInput = group.inputs[0];
  const yInput = group.inputs[1];

  return (
    <>
      <MonoInputConfigPanel
        project={project}
        key={xInput.id}
        title="MIDI Settings - X Axis"
        device={device}
        group={new InputGroup([xInput])}
      />

      <MonoInputConfigPanel
        project={project}
        key={yInput.id}
        title="MIDI Settings - Y Axis"
        device={device}
        group={new InputGroup([yInput])}
      />
    </>
  );
}
