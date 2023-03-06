import { InputConfig } from '@shared/hardware-config';
import { NonsequentialStepPropagator } from '@shared/propagators';
import {
  InteractiveInputDriver,
  InputDriverWithHandle,
  SwitchDriver,
} from '@shared/driver-types';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';
import { SwitchLayout } from './SwitchLayout';

// TODO: is config actually ever udnefined here? I don't think so
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

  if (driver.type === 'switch') {
    const asSwitch = driver as SwitchDriver;
    const { steps } = asSwitch;

    const lastStep = config
      ? (config.outputPropagator as NonsequentialStepPropagator).lastStep
      : steps[asSwitch.initialStep];

    return (
      <SwitchLayout steps={steps} lastStep={lastStep} style={driver.style} />
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
