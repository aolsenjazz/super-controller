import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { HandleLayout } from './HandleLayout';
import { SwitchLayout } from './SwitchLayout';
import XYLayout from './XYLayout';

type InputLayoutPropTypes = {
  qualifiedInputId: string;
  driver: InteractiveInputDriver;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { driver, qualifiedInputId } = props;

  if (driver.type === 'pad') {
    return <Pad driver={driver} id={qualifiedInputId} />;
  }

  if (driver.type === 'knob') {
    return (
      <Knob
        id={qualifiedInputId}
        shape={driver.shape}
        endless={driver.knobType === 'endless'}
      />
    );
  }

  if (driver.type === 'switch') {
    return <SwitchLayout id={qualifiedInputId} driver={driver} />;
  }

  if (driver.type === 'xy') {
    const { handleWidth } = driver.x;

    return (
      <XYLayout
        id={qualifiedInputId}
        driver={driver}
        handleHeight={`${(handleWidth / driver.height) * 100}%`}
        handleWidth={`${(handleWidth / driver.width) * 100}%`}
      />
    );
  }

  const { handleWidth, handleHeight, horizontal, inverted } = driver;

  return (
    <HandleLayout
      id={qualifiedInputId}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleHeight / driver.height) * 100}%`}
      horizontal={horizontal}
      inverted={inverted}
    />
  );
}
