import MonoInputConfigPanel from './MonoInputConfigPanel';

import { InputGroup } from '../../input-group';

import { Project } from '@shared/project';
import { SupportedDeviceConfig } from '@shared/hardware-config';

type PropTypes = {
  group: InputGroup;
  project: Project;
  config: SupportedDeviceConfig;
  setProject: (p: Project) => void;
};

/**
 * Configuration panel for hardware inputs which control two inputs via X + Y axes
 *
 * @param props Component props
 * @param props.group InputGroup for selected inputs
 * @param props.project Current project
 * @param props.config Configuration for current device
 * @param props.setProject updates the project in the frontend
 */
export default function XYConfigPanel(props: PropTypes) {
  const { group, config, project, setProject } = props;

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
        setProject={setProject}
      />

      <MonoInputConfigPanel
        project={project}
        key={yInput.id}
        title="MIDI Settings - Y Axis"
        config={config}
        group={new InputGroup([yInput])}
        setProject={setProject}
      />
    </>
  );
}
