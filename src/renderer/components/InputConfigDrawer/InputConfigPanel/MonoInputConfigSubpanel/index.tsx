import { PluginIcicle } from '@plugins/base-plugin';
import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-config';
import { useCallback, useEffect, useState } from 'react';
import PluginSubpanel from 'renderer/components/PluginSubpanel';
import { PluginAggregate } from 'renderer/components/PluginSubpanel/plugin-aggregate';
import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  inputs: MonoInputIcicle[];
  deviceId: string;
};

const { MenuService, ConfigService } = window;

export default function MonoInputConfigPanel(props: PropTypes) {
  const { inputs, deviceId } = props;

  const [plugins, setPlugins] = useState<PluginIcicle[][]>([]);

  useEffect(() => {
    const minPlugins = Math.min(...inputs.map((i) => i.plugins.length));
    const pluginSlotInts = Array.from(Array(minPlugins).keys());
    const aggregateCapablePluginSlots = pluginSlotInts.filter((n) => {
      const aggregate = new PluginAggregate(inputs.map((i) => i.plugins[n]));
      return (
        inputs.length === 1 ||
        (aggregate.aggregateCapable && aggregate.title !== '<multiple values>')
      );
    });

    const aggregateCapablePlugins = aggregateCapablePluginSlots.map((n) => {
      return inputs.map((i) => i.plugins[n]);
    });

    setPlugins(aggregateCapablePlugins);
  }, [inputs]);

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

  const removePlugins = useCallback(
    (plugs: PluginIcicle[]) => {
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
        removePlugins={removePlugins}
        showPluginMenu={showPluginMenu}
        showAddPlugin={inputs.length === 1}
      />
    </div>
  );
}
