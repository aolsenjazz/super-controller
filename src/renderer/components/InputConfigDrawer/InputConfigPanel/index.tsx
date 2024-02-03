import { DeviceConfigStub } from '@shared/hardware-config/device-config';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';

import InputDetailsSubpanel from './InputDetailsSubpanel';
import PluginSubpanel from '../../PluginSubpanel';

type InputConfigurationProps = {
  config: DeviceConfigStub;
  inputConfigs: InputConfigStub[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, inputConfigs } = props;

  return (
    <>
      <InputDetailsSubpanel configs={inputConfigs} deviceId={config.id} />
      <PluginSubpanel
        deviceId={config.id}
        plugins={[]}
        removePlugin={() => {}}
        showPluginMenu={() => {}}
      />
    </>
  );
}
