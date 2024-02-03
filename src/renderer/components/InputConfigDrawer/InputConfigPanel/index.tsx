import { useCallback } from 'react';

import { DeviceConfigStub } from '@shared/hardware-config/device-config';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';

import InputDetailsSubpanel from './InputDetailsSubpanel';
import PluginSubpanel from '../../PluginSubpanel';

const { MenuService } = window;

type InputConfigurationProps = {
  config: DeviceConfigStub;
  inputConfigs: InputConfigStub[];
};

export default function InputConfigSubpanel(props: InputConfigurationProps) {
  const { config, inputConfigs } = props;

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      MenuService.showInputPluginMenu(x, y, config!.id, inputConfigs[0].id);
    },
    [config, inputConfigs]
  );

  return (
    <>
      <InputDetailsSubpanel configs={inputConfigs} deviceId={config.id} />
      <PluginSubpanel
        deviceId={config.id}
        plugins={[]}
        removePlugin={() => {}}
        showPluginMenu={showPluginMenu}
      />
    </>
  );
}
