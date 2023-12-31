import { useSelectedDevice } from '@context/selected-device-context';
import { useInputState } from '@hooks/use-input-state';
import { SwitchState } from '@shared/hardware-config/input-config/switch-config';

type PropTypes = {
  steps: NumberArrayWithStatus[];
  initialStep: NumberArrayWithStatus;
  id: string;
};

export function SwitchLayout(props: PropTypes) {
  const { initialStep, steps, id } = props;

  const { selectedDevice } = useSelectedDevice();

  const { state } = useInputState<SwitchState>(selectedDevice || '', id, {
    step: initialStep,
  });

  const nSteps = steps.length;
  let stepIdx = 0;
  steps.forEach((s, i) => {
    if (JSON.stringify(s) === JSON.stringify(state.step)) {
      stepIdx = i;
    }
  });

  const position = stepIdx / nSteps;
  const iStyle = {
    top: `calc(${position * 100}% - 1px)`,
    left: -1,
    width: `100%`,
    height: `${(1 / nSteps) * 100}%`,
  };

  return (
    <div className="switch interactive-indicator">
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}
