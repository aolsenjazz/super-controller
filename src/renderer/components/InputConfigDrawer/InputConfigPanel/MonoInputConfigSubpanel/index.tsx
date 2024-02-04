import { PluginIcicle } from '@plugins/base-plugin';
import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-config';
import { useEffect, useState } from 'react';
import PluginSubpanel from 'renderer/components/PluginSubpanel';
import InputDefaultsSubpanel from '../InputDefaultsSubpanel';

type PropTypes = {
  inputs: MonoInputIcicle[];
  deviceId: string;
};

export default function MonoInputConfigPanel(props: PropTypes) {
  const { inputs, deviceId } = props;

  const [plugins, setPlugins] = useState<PluginIcicle[][]>([]);

  useEffect(() => {
    const minPlugins = Math.min(...inputs.map((i) => i.plugins.length));
    const pluginSlotInts = Array.from(Array(minPlugins).keys());
    const aggregateCapablePluginSlots = pluginSlotInts.filter((n) => {
      return (
        inputs
          .map((i) => i.plugins[n])
          .filter((p) => p.aggregateCapable !== true).length > 0
      );
    });
    const aggregateCapablePlugins = aggregateCapablePluginSlots.map((n) => {
      return inputs.map((i) => i.plugins[n]);
    });

    setPlugins(aggregateCapablePlugins);
  }, [inputs]);

  return (
    <div>
      <InputDefaultsSubpanel inputs={inputs} />
      <PluginSubpanel
        deviceId={deviceId}
        plugins={plugins}
        removePlugin={() => {}}
        showPluginMenu={() => {}}
      />
    </div>
  );
}
