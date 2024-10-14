import { useCallback } from 'react';

import { importInputSubcomponent } from '@plugins/plugin-loader';
import { getQualifiedInputId } from '@shared/util';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';

import PluginSubpanel from 'renderer/components/PluginSubpanel';

import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  input: InputDTO;
};

const { InputConfigService } = window;

export default function MonoInputConfigPanel(props: PropTypes) {
  const { input } = props;

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
      <InputDefaultsSubpanel input={input} />
      <PluginSubpanel
        plugins={input.plugins}
        removePlugin={removePlugin}
        showPluginMenu={showPluginMenu}
        showAddPlugin
        importPlugin={(title) => importInputSubcomponent(title, 'gui')}
      />
    </div>
  );
}
