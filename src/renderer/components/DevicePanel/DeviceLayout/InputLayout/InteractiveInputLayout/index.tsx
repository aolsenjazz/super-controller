import { NonsequentialStepPropagator } from '@shared/propagators';
import {
  InteractiveInputDriver,
  InputDriverWithHandle,
  SwitchDriver,
  XYDriver,
} from '@shared/driver-types';
import { id as idForInput } from '@shared/util';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { HandleLayout } from './HandleLayout';
import { SwitchLayout } from './SwitchLayout';
import XYLayout from './XYLayout';

type InputLayoutPropTypes = {
  driver: InteractiveInputDriver;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { driver } = props;
  const id = idForInput(driver);

  if (driver.type === 'pad') {
    return <Pad shape={driver.shape} id={id} />;
  }

  if (driver.type === 'knob') {
    return (
      // <Knob
      //   value={conf.value || 0}
      //   shape={driver.shape}
      //   endless={conf.valueType === 'endless'}
      // />
      <Knob value={0} shape={driver.shape} endless={false} />
    );
  }

  // if (driver.type === 'switch') {
  //   const asSwitch = driver as SwitchDriver;
  //   const { steps } = asSwitch;

  //   const lastStep = config
  //     ? (conf.outputPropagator as NonsequentialStepPropagator).lastStep
  //     : steps[asSwitch.initialStep];

  //   return <SwitchLayout steps={steps} lastStep={lastStep} />;
  // }

  // if (driver.type === 'xy') {
  //   const asXY = driver as XYDriver;
  //   const handleWidth = (asXY.x as InputDriverWithHandle).handleWidth as number;

  //   return (
  //     <XYLayout
  //       x={conf.x}
  //       y={conf.y}
  //       handleHeight={`${(handleWidth / driver.height) * 100}%`}
  //       handleWidth={`${(handleWidth / driver.width) * 100}%`}
  //     />
  //   );
  // }

  const { handleWidth, handleHeight, horizontal, inverted } =
    driver as InputDriverWithHandle;
  // return (
  //   <HandleLayout
  //     value={asSlider.value || 0}
  //     handleWidth={`${(handleWidth / driver.width) * 100}%`}
  //     handleHeight={`${(handleHeight / driver.height) * 100}%`}
  //     horizontal={horizontal}
  //     inverted={inverted}
  //   />
  // );
  return (
    <HandleLayout
      value={0}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleHeight / driver.height) * 100}%`}
      horizontal={horizontal}
      inverted={inverted}
    />
  );
}
