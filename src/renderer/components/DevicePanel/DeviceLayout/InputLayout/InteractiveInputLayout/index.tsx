import {
  InteractiveInputDriver,
  InputDriverWithHandle,
  SwitchDriver,
  XYDriver,
  KnobDriver,
  PadDriver,
} from '@shared/driver-types';
import { id as idForInput } from '@shared/util';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { HandleLayout } from './HandleLayout';
import { SwitchLayout } from './SwitchLayout';
import XYLayout from './XYLayout';

type InputLayoutPropTypes = {
  deviceId: string;
  driver: InteractiveInputDriver;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { driver, deviceId } = props;
  const id = `${deviceId}-${idForInput(driver)}`;

  if (driver.type === 'pad') {
    return <Pad driver={driver as PadDriver} id={id} />;
  }

  if (driver.type === 'knob') {
    const asKnob = driver as KnobDriver;
    return (
      <Knob
        id={id}
        shape={driver.shape}
        endless={asKnob.knobType === 'endless'}
      />
    );
  }

  if (driver.type === 'switch') {
    const asSwitch = driver as SwitchDriver;
    const { steps } = asSwitch;

    return (
      <SwitchLayout
        steps={steps}
        id={id}
        initialStep={steps[asSwitch.initialStep]}
      />
    );
  }

  if (driver.type === 'xy') {
    const asXY = driver as XYDriver;
    const handleWidth = (asXY.x as InputDriverWithHandle).handleWidth as number;

    return (
      <XYLayout
        id={id}
        driver={driver as XYDriver}
        handleHeight={`${(handleWidth / driver.height) * 100}%`}
        handleWidth={`${(handleWidth / driver.width) * 100}%`}
      />
    );
  }

  const { handleWidth, handleHeight, horizontal, inverted } =
    driver as InputDriverWithHandle;

  return (
    <HandleLayout
      id={id}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleHeight / driver.height) * 100}%`}
      horizontal={horizontal}
      inverted={inverted}
    />
  );
}
