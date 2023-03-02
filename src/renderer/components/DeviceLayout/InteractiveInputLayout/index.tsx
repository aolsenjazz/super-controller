import { InputConfig } from '@shared/hardware-config';
import {
  InteractiveInputDriver,
  InputDriverWithHandle,
} from '@shared/driver-types';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';

type InputLayoutPropTypes = {
  driver: InteractiveInputDriver;
  config: InputConfig | undefined;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { driver, config } = props;

  if (driver.type === 'pad') {
    return (
      <Pad
        shape={driver.shape}
        fx={config?.currentFx}
        color={config?.currentColor}
      />
    );
  }

  if (driver.type === 'knob') {
    const val = config?.value || 0;
    return (
      <Knob
        value={val}
        shape={driver.shape}
        endless={config?.valueType === 'endless'}
      />
    );
  }

  const val = config?.value || 0;
  const handleWidth = (driver as InputDriverWithHandle).handleWidth as number;
  return (
    <WheelLayout
      value={val}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleWidth / driver.height) * 100}%`}
      style={driver.style}
    />
  );
}
