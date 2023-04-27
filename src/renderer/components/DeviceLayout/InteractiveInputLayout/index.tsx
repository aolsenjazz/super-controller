import { InputConfig } from '@shared/hardware-config';
import { NonsequentialStepPropagator } from '@shared/propagators';
import { PadConfig, KnobConfig } from '@shared/hardware-config/input-config';
import {
  InteractiveInputDriver,
  InputDriverWithHandle,
  SwitchDriver,
} from '@shared/driver-types';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';
import { SwitchLayout } from './SwitchLayout';

type InputLayoutPropTypes = {
  driver: InteractiveInputDriver;
  config: InputConfig;
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

    const lastStep = config
      ? (config.outputPropagator as NonsequentialStepPropagator).lastStep
      : steps[asSwitch.initialStep];

    return <SwitchLayout steps={steps} lastStep={lastStep} />;
  }

  const handleWidth = (driver as InputDriverWithHandle).handleWidth as number;
  return (
    <WheelLayout
      value={config.value || 0}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleWidth / driver.height) * 100}%`}
    />
  );
}
