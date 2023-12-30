import { SupportedDeviceConfig, SwitchConfig } from '@shared/hardware-config';
import { DRIVERS } from '@shared/drivers';
import { SwitchDriver } from '@shared/driver-types';
import { NonsequentialStepPropagator } from '@shared/propagators';
import { id } from '@shared/util';

import SwitchStepConfig from './SwitchStepConfig';
import OsxTabs from '../../OsxTabs';

type PropTypes = {
  deviceConfig: SupportedDeviceConfig;
  inputConfig: SwitchConfig;
};

export default function SwitchConfigPanel(props: PropTypes) {
  const { deviceConfig, inputConfig } = props;

  const deviceDriver = DRIVERS.get(deviceConfig.driverName);

  if (!deviceDriver)
    throw new Error(`unable to find driver for ${deviceConfig.driverName}`);

  let inputDriver: SwitchDriver | undefined;
  deviceDriver.inputGrids.forEach((ig) => {
    ig.inputs.forEach((i) => {
      if (i.interactive && id(i) === inputConfig.id) {
        inputDriver = i as SwitchDriver;
      }
    });
  });

  if (inputDriver === undefined)
    throw new Error(`Unable to find input driver for ${inputConfig.id}`);

  const prop = inputConfig.outputPropagator as NonsequentialStepPropagator;
  const labels = inputDriver.stepLabels;
  const bodies = inputDriver.steps.map((msg) => {
    return (
      <SwitchStepConfig
        msg={prop.responseForStep(msg)!}
        config={inputConfig}
        defaultMsg={msg}
        deviceId={deviceConfig.id}
      />
    );
  });
  return (
    <div id="switch-panel">
      <OsxTabs tabBodies={bodies} tabLabels={labels} />
    </div>
  );
}
