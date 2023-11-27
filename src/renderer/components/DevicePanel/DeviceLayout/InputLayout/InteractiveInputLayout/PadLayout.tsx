import { PadState } from '@shared/hardware-config/input-config/pad-config';
import { useSelectedDevice } from '@context/selected-device-context';
import { useInputState } from '@hooks/use-input-state';

/**
 * Define this state out here so that it doesn't change on each rerender
 */
const defaultState = {
  color: undefined,
  fx: undefined,
};

type PropTypes = {
  shape: string;
  id: string;
};

export default function Pad(props: PropTypes) {
  const { shape, id } = props;
  const { selectedDevice } = useSelectedDevice();

  const { state } = useInputState<PadState>(
    selectedDevice || '',
    id,
    defaultState
  );

  const mod = state?.color?.modifier || state?.fx?.title;

  return (
    <div
      className="pad interactive-indicator"
      style={{
        animationName: mod,
        backgroundColor: state?.color?.string,
        animationTimingFunction: mod === 'Pulse' ? 'ease-in-out' : undefined,
        borderRadius: shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}
