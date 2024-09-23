import { useCallback } from 'react';

import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';
import { useInputConfig } from '@hooks/use-input-config';

import PluginSubpanel from 'renderer/components/PluginSubpanel';
import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  inputs: MonoInputDTO[];
  deviceId: string;
};

const { MenuService, InputConfigService } = window;

export default function MonoInputConfigPanel(props: PropTypes) {
  const { inputs, deviceId } = props;

  const input = inputs[0];

  const { inputConfig } = useInputConfig<MonoInputDTO>(deviceId, input.id);

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      MenuService.showInputPluginMenu(x, y, deviceId, [input.id]);
    },
    [input, deviceId]
  );

  const removePlugin = useCallback(
    (pluginId: string) => {
      InputConfigService.removePlugin(pluginId, deviceId, input.id);
    },
    [input, deviceId]
  );

  return (
    <div>
      <InputDefaultsSubpanel inputs={inputs} />
      <PluginSubpanel
        plugins={inputConfig.plugins}
        removePlugin={removePlugin}
        showPluginMenu={showPluginMenu}
        showAddPlugin={inputs.length === 1}
        selectedDevice={deviceId}
      />
    </div>
  );
}
