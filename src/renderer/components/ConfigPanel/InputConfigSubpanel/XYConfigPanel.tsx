import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';

import MonoInputConfigPanel from './MonoInputConfigSubpanel';
import { createInputGroup } from './input-group';

type PropTypes = {
  x: MonoInputConfigStub;
  y: MonoInputConfigStub;
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
  const { x, y } = props;

  return (
    <>
      <MonoInputConfigPanel
        key="x"
        title="MIDI Settings - X Axis"
        group={createInputGroup([x])}
      />
      <MonoInputConfigPanel
        key="y"
        title="MIDI Settings - Y Axis"
        group={createInputGroup([y])}
      />
    </>
  );
}
