import { useCallback } from 'react';

import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';
import { importInputSubcomponent } from '@plugins/plugin-loader';
import { getQualifiedInputId } from '@shared/util';

import PluginSubpanel from 'renderer/components/PluginSubpanel';

import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  inputs: MonoInputDTO[];
  deviceId: string;
};

const { InputConfigService } = window;

export default function MonoInputConfigPanel(props: PropTypes) {
  const { inputs, deviceId } = props;

  const input = inputs[0];

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      InputConfigService.showInputPluginMenu(
        x,
        y,
        getQualifiedInputId(input.deviceId, input.id)
      );
    },
    [input]
  );

  const removePlugin = useCallback(
    (pluginId: string) => {
      InputConfigService.removePlugin(
        pluginId,
        getQualifiedInputId(input.deviceId, input.id)
      );
    },
    [input]
  );

  return (
    <div>
      <InputDefaultsSubpanel inputs={inputs} />
      <PluginSubpanel
        plugins={input.plugins}
        removePlugin={removePlugin}
        showPluginMenu={showPluginMenu}
        showAddPlugin={inputs.length === 1}
        deviceId={deviceId}
        importPlugin={(title) => importInputSubcomponent(title, 'gui')}
      />
    </div>
  );
}
