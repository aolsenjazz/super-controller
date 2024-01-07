import { useSelectedDevice } from '@context/selected-device-context';
import { useInputState } from '@hooks/use-input-state';
import { SliderState } from '@shared/hardware-config/input-config/slider-config';

import { HorizontalHandleLayout } from './HorizontalHandleLayout';
import { VerticalHandleLayout } from './VerticalHandleLayout';

const defaultState = {
  value: 127,
};

type PropTypes = {
  handleWidth: string;
  handleHeight: string;
  horizontal: boolean;
  inverted: boolean;
  id: string;
};

export function HandleLayout(props: PropTypes) {
  const { handleWidth, handleHeight, horizontal, inverted, id } = props;

  const { selectedDevice } = useSelectedDevice();

  const { state } = useInputState<SliderState>(
    selectedDevice || '',
    id,
    defaultState
  );

  const Layout = horizontal ? HorizontalHandleLayout : VerticalHandleLayout;

  return (
    <div
      className={`handle-input interactive-indicator${
        horizontal ? ' horizontal' : ''
      }`}
    >
      <Layout
        value={inverted ? 127 - state.value : state.value}
        handleWidth={handleWidth}
        handleHeight={handleHeight}
      />
    </div>
  );
}
