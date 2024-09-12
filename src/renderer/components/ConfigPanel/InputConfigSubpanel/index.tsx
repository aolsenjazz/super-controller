import { InputIcicle } from '@shared/hardware-config/input-config/base-input-config';
import { DeviceIcicle } from '@shared/hardware-config/device-config';
import { XYIcicle } from '@shared/hardware-config/input-config/xy-config';
import { SwitchIcicle } from '@shared/hardware-config/input-config/switch-config';
import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-icicle';

import { createInputGroup } from './input-group';
import BasicMessage from '../BasicMessage';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';
import SwitchConfigPanel from './SwitchConfigSubpanel';
import XYConfigPanel from './XYConfigPanel';

function areInputsHomogenous(inputConfigs: InputIcicle[]) {
  if (inputConfigs.length === 1) return true;
  return (
    inputConfigs.filter((c) => ['xy', 'switch'].includes(c.type)).length === 0
  );
}

type InputConfigurationProps = {
  config: DeviceIcicle;
  inputConfigs: InputIcicle[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, inputConfigs } = props;

  const homogenous = areInputsHomogenous(inputConfigs);

  let InputConfigPanel;

  if (homogenous === false) {
    const msg = "The selected inputs don't share any fields";
    InputConfigPanel = <BasicMessage msg={msg} />;
  } else if (inputConfigs[0].type === 'xy') {
    const conf = inputConfigs[0] as XYIcicle;
    InputConfigPanel = (
      <XYConfigPanel x={conf.x} y={conf.y} deviceId={config.id} />
    );
  } else if (inputConfigs[0].type === 'switch') {
    const conf = inputConfigs[0] as SwitchIcicle;
    InputConfigPanel = (
      <SwitchConfigPanel deviceConfig={config} inputConfigStub={conf} />
    );
  } else {
    const group = createInputGroup(inputConfigs as MonoInputIcicle[]);
    InputConfigPanel = (
      <MonoInputConfigPanel
        title="MIDI Settings"
        group={group}
        deviceId={config.id}
      />
    );
  }

  return <>{InputConfigPanel}</>;
}
