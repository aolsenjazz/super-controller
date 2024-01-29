import { DeviceConfigStub } from '@shared/hardware-config/device-config';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';

import { createInputGroup } from './input-group';
import InputDetailsSubpanel from './InputDetailsSubpanel';
import PluginSubpanel from '../../PluginSubpanel';

function areInputsHomogenous(inputConfigs: InputConfigStub[]) {
  if (inputConfigs.length === 1) return true;
  return (
    inputConfigs.filter((c) => ['xy', 'switch'].includes(c.type)).length === 0
  );
}

type InputConfigurationProps = {
  config: DeviceConfigStub;
  inputConfigs: InputConfigStub[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, inputConfigs } = props;

  const group = createInputGroup(inputConfigs as MonoInputConfigStub[]);
  const homogenous = areInputsHomogenous(inputConfigs);

  return (
    <>
      <InputDetailsSubpanel group={group} />
      <PluginSubpanel
        deviceId={config.id}
        plugins={[]}
        removePlugin={() => {}}
        showPluginMenu={() => {}}
      />
    </>
  );
}
