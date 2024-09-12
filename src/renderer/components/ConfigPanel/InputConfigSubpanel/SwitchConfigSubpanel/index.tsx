import { useEffect, useState } from 'react';

import { useDeviceDriver } from '@hooks/use-driver';
import { SwitchDriver } from '@shared/driver-types';
import { id } from '@shared/util';

import SwitchStepConfig from './SwitchStepConfig';
import OsxTabs from '../../../OsxTabs';

type PropTypes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deviceConfig: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputConfigStub: any;
};

export default function SwitchConfigSubpanel(props: PropTypes) {
  const { deviceConfig, inputConfigStub } = props;

  const { driver } = useDeviceDriver(deviceConfig.id);
  const [inputDriver, setInputDriver] = useState<SwitchDriver>();

  useEffect(() => {
    if (driver === undefined) return;
    driver.inputGrids.forEach((ig) => {
      ig.inputs.forEach((i) => {
        if (i.interactive && id(i) === inputConfigStub.id) {
          setInputDriver(i as SwitchDriver);
        }
      });
    });
  }, [driver, inputConfigStub]);

  if (inputDriver === undefined) return null;

  const labels = inputDriver.stepLabels;
  const bodies = inputDriver.steps.map((msg) => {
    return (
      <SwitchStepConfig
        override={inputConfigStub.steps.get(JSON.stringify(msg))!}
        config={inputConfigStub}
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
