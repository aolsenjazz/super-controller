import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-icicle';
import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { useCallback } from 'react';
import PluginSubpanel from 'renderer/components/PluginSubpanel';
import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  inputs: MonoInputIcicle[];
  deviceId: string;
};

const { MenuService, ConfigService } = window;

export default function MonoInputConfigPanel(props: PropTypes) {
  const { inputs, deviceId } = props;

  const showPluginMenu = useCallback(
    (x: number, y: number) => {
      MenuService.showInputPluginMenu(
        x,
        y,
        deviceId,
        inputs.map((i) => i.id)
      );
    },
    [inputs, deviceId]
  );

  const removePlugin = useCallback(
    (plugs: PluginDTO[]) => {
      const newIcicles = inputs.map((i, idx) => {
        return {
          ...i,
          plugins: i.plugins.filter((p) => p !== plugs[idx]),
        };
      });

      ConfigService.updateInputs(deviceId, newIcicles);
    },
    [inputs, deviceId]
  );

  return (
    <div>
      <InputDefaultsSubpanel inputs={inputs} />
      <PluginSubpanel
        deviceId={deviceId}
        plugins={plugins}
        removePlugin={removePlugin}
        showPluginMenu={showPluginMenu}
        showAddPlugin={inputs.length === 1}
      />
    </div>
  );
}
