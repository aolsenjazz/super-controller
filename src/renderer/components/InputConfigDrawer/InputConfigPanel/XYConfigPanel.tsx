import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';

type PropTypes = {
  x: MonoInputDTO;
  y: MonoInputDTO;
  deviceId: string;
};

export default function XYConfigPanel(_props: PropTypes) {
  // const { x, y, deviceId } = props;
  return null;

  // return (
  //   <>
  //     <MonoInputConfigPanel
  //       key="x"
  //       title="MIDI Settings - X Axis"
  //       group={createInputGroup([x])}
  //       deviceId={deviceId}
  //     />
  //     <MonoInputConfigPanel
  //       key="y"
  //       title="MIDI Settings - Y Axis"
  //       group={createInputGroup([y])}
  //       deviceId={deviceId}
  //     />
  //   </>
  // );
}
