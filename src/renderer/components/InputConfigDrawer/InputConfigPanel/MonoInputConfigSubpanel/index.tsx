import { useCallback, useMemo } from 'react';

import { importInputSubcomponent } from '@plugins/plugin-loader';
import { getQualifiedInputId } from '@shared/util';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';

import PluginSlot from 'renderer/components/PluginSubpanel/PluginSlot';

import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  input: MonoInputDTO;
};

const { InputConfigService } = window;

export default function MonoInputConfigPanel(props: PropTypes) {
  const { input } = props;

  // Removed ability to add InputPlugins so as to not confuse users
  // const showPluginMenu = useCallback(
  //   (x: number, y: number) => {
  //     InputConfigService.showInputPluginMenu(
  //       x,
  //       y,
  //       getQualifiedInputId(input.deviceId, input.id)
  //     );
  //   },
  //   [input]
  // );

  const removePlugin = useCallback(
    (pluginId: string) => {
      InputConfigService.removePlugin(
        pluginId,
        getQualifiedInputId(input.deviceId, input.id)
      );
    },
    [input]
  );

  const pluginSlots = useMemo(() => {
    return input.plugins.map((x) => {
      return (
        <PluginSlot
          key={`plugin${x}`}
          pluginId={x}
          removePlugin={removePlugin}
          importPlugin={(title) => importInputSubcomponent(title, 'gui')}
        />
      );
    });
  }, [input, removePlugin]);

  return (
    <div>
      <InputDefaultsSubpanel defaults={input.defaults} />
      {pluginSlots}
    </div>
  );
}
