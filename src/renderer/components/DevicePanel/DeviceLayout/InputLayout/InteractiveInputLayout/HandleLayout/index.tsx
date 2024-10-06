import { useInputState } from '@hooks/use-input-state';
import { selectSelectedDevice } from '@selectors/selected-device-selector';
import { SliderState } from '@shared/hardware-config/input-config/slider-config';
import { useSelector } from 'react-redux';

import { HorizontalHandleLayout } from './HorizontalHandleLayout';
import { VerticalHandleLayout } from './VerticalHandleLayout';

const defaultState = {
  value: 127 as MidiNumber,
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

  const selectedDevice = useSelector(selectSelectedDevice);

  const { state } = useInputState<SliderState>(
    selectedDevice!.id,
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
