import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { HandleLayout } from './HandleLayout';
import { SwitchLayout } from './SwitchLayout';
import XYLayout from './XYLayout';
import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';

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
    const asKnob = driver;
    return (
      <Knob
        id={qualifiedInputId}
        shape={driver.shape}
        endless={asKnob.knobType === 'endless'}
      />
    );
  }

  if (driver.type === 'switch') {
    const asSwitch = driver;
    const { steps } = asSwitch;

    return (
      <SwitchLayout
        steps={steps}
        id={qualifiedInputId}
        initialStep={steps[asSwitch.initialStep]}
      />
    );
  }

  if (driver.type === 'xy') {
    const asXY = driver;
    const handleWidth = asXY.x.handleWidth as number;

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
