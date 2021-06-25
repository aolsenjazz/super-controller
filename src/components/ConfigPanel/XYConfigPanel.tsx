import React from 'react';

import MonoInputConfigPanel from './MonoInputConfigPanel';

import { SupportedDeviceConfig } from '../../hardware-config';
import { InputGroup } from '../../input-group';
import { Project } from '../../project';

type PropTypes = {
  group: InputGroup;
  project: Project;
  config: SupportedDeviceConfig;
};

/**
 * Configuration panel for hardware inputs which control two inputs via X + Y axes
 *
 * @param { object } props Component props
 * @param { InputGroup } props.group InputGroup for selected inputs
 * @param { Project } props.project Current project
 * @param { SupportedDeviceConfig } props.config Configuration for current device
 */
export default function XYConfigPanel(props: PropTypes) {
  const { group, config, project } = props;

  const xInput = group.inputs[0];
  const yInput = group.inputs[1];

  return (
    <>
      <MonoInputConfigPanel
        project={project}
        key={xInput.id}
        title="MIDI Settings - X Axis"
        config={config}
        group={new InputGroup([xInput])}
      />

      <MonoInputConfigPanel
        project={project}
        key={yInput.id}
        title="MIDI Settings - Y Axis"
        config={config}
        group={new InputGroup([yInput])}
      />
    </>
  );
}
