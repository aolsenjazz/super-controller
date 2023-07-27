import { BaseInputConfig } from '@shared/hardware-config';
import { NonsequentialStepPropagator } from '@shared/propagators';
import {
  PadConfig,
  KnobConfig,
  SwitchConfig,
  SliderConfig,
  XYConfig,
} from '@shared/hardware-config/input-config';
import {
  InteractiveInputDriver,
  InputDriverWithHandle,
  SwitchDriver,
  XYDriver,
} from '@shared/driver-types';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';
import { SwitchLayout } from './SwitchLayout';
import XYLayout from './XYLayout';

type InputLayoutPropTypes = {
  driver: InteractiveInputDriver;
  config: BaseInputConfig;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { driver, config } = props;

  if (driver.type === 'pad') {
    const conf = config as PadConfig;
    return (
      <Pad shape={driver.shape} fx={conf.currentFx} color={conf.currentColor} />
    );
  }

  if (driver.type === 'knob') {
    const conf = config as KnobConfig;
    return (
      <Knob
        value={conf.value || 0}
        shape={driver.shape}
        endless={conf.valueType === 'endless'}
      />
    );
  }

  if (driver.type === 'switch') {
    const asSwitch = driver as SwitchDriver;
    const { steps } = asSwitch;
    const conf = config as SwitchConfig;

    const lastStep = config
      ? (conf.outputPropagator as NonsequentialStepPropagator).lastStep
      : steps[asSwitch.initialStep];

    return <SwitchLayout steps={steps} lastStep={lastStep} />;
  }

  if (driver.type === 'xy') {
    const asXY = driver as XYDriver;
    const conf = config as XYConfig;
    const handleWidth = (asXY.x as InputDriverWithHandle).handleWidth as number;

    return (
      <XYLayout
        x={conf.x}
        y={conf.y}
        handleHeight={`${(handleWidth / driver.height) * 100}%`}
        handleWidth={`${(handleWidth / driver.width) * 100}%`}
      />
    );
  }

  const handleWidth = (driver as InputDriverWithHandle).handleWidth as number;
  const asSlider = config as SliderConfig;
  return (
    <WheelLayout
      value={asSlider.value || 0}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleWidth / driver.height) * 100}%`}
    />
  );
}
