import { useInputConfigs } from '@hooks/use-input-configs';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';

import { InputGroup } from './input-group';
import BasicMessage from '../BasicMessage';
import MonoInputConfigPanel from './MonoInputConfigPanel';
import SwitchConfigPanel from './SwitchConfigPanel';
import XYConfigPanel from './XYConfigPanel';

function areInputsHomogenous(inputConfigs: InputConfigStub[]) {
  if (inputConfigs.length === 1) return true;
  return (
    inputConfigs.filter((c) => !['xy', 'switch'].includes(c.type)).length === 0
  );
}

type InputConfigurationProps = {
  config: ConfigStub;
  selectedInputs: string[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, selectedInputs } = props;
  const { inputConfigs } = useInputConfigs(config.id, selectedInputs);

  const homogenous = areInputsHomogenous(inputConfigs);

  let InputConfigPanel;

  if (homogenous === false) {
    InputConfigPanel = (
      <BasicMessage msg="The selected inputs don't share any fields." />
    );
  } else if (inputConfigs[0].type === 'xy') {
    InputConfigPanel = <XYConfigPanel />;
  } else if (inputConfigs[0].type === 'switch') {
    InputConfigPanel = <SwitchConfigPanel />;
  } else {
    const group = new InputGroup(inputConfigs as MonoInputConfigStub[]);
    InputConfigPanel = (
      <MonoInputConfigPanel title="MIDI Settings" group={group} />
    );
  }

  return <>{InputConfigPanel}</>;
}
