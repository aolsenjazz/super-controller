import { ConfigStub } from '@shared/hardware-config/device-config';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';
import { XYConfigStub } from '@shared/hardware-config/input-config/xy-config';
import { SwitchConfigStub } from '@shared/hardware-config/input-config/switch-config';

import { createInputGroup } from './input-group';
import BasicMessage from '../BasicMessage';
import MonoInputConfigPanel from './MonoInputConfigSubpanel';
import SwitchConfigPanel from './SwitchConfigSubpanel';
import XYConfigPanel from './XYConfigPanel';

function areInputsHomogenous(inputConfigs: InputConfigStub[]) {
  if (inputConfigs.length === 1) return true;
  return (
    inputConfigs.filter((c) => ['xy', 'switch'].includes(c.type)).length === 0
  );
}

type InputConfigurationProps = {
  config: ConfigStub;
  inputConfigs: InputConfigStub[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, inputConfigs } = props;

  const homogenous = areInputsHomogenous(inputConfigs);

  let InputConfigPanel;

  if (homogenous === false) {
    const msg = "The selected inputs don't share any fields";
    InputConfigPanel = <BasicMessage msg={msg} />;
  } else if (inputConfigs[0].type === 'xy') {
    const conf = inputConfigs[0] as XYConfigStub;
    InputConfigPanel = (
      <XYConfigPanel x={conf.x} y={conf.y} deviceId={config.id} />
    );
  } else if (inputConfigs[0].type === 'switch') {
    const conf = inputConfigs[0] as SwitchConfigStub;
    InputConfigPanel = (
      <SwitchConfigPanel deviceConfig={config} inputConfigStub={conf} />
    );
  } else {
    const group = createInputGroup(inputConfigs as MonoInputConfigStub[]);
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
