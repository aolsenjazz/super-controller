import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-icicle';

import MonoInputConfigPanel from './MonoInputConfigSubpanel';
import { createInputGroup } from './input-group';

type PropTypes = {
  x: MonoInputIcicle;
  y: MonoInputIcicle;
  deviceId: string;
};

export default function XYConfigPanel(props: PropTypes) {
  const { x, y, deviceId } = props;

  return (
    <>
      <MonoInputConfigPanel
        key="x"
        title="MIDI Settings - X Axis"
        group={createInputGroup([x])}
        deviceId={deviceId}
      />
      <MonoInputConfigPanel
        key="y"
        title="MIDI Settings - Y Axis"
        group={createInputGroup([y])}
        deviceId={deviceId}
      />
    </>
  );
}
