import { useMemo, useState } from 'react';

import { PluginIcicle } from '@plugins/base-plugin';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: PluginIcicle[];
  deviceId: string;
};

export default function PluginSubpanel(props: PluginSubpanelProps) {
  const { plugins, deviceId } = props;

  const [selectedId, setSelectedId] = useState('');

  const minPluginSlots = useMemo(() => {
    return plugins.length > 3 ? plugins.length + 1 : 3;
  }, [plugins]);

  const pluginSlots = useMemo(() => {
    return [...Array(minPluginSlots).keys()].map((x, i) => {
      return plugins.length > i ? (
        <PluginSlot
          key={`plugin${x}`}
          icicle={plugins[i]}
          deviceId={deviceId}
          setSelectedId={setSelectedId}
          selected={selectedId === plugins[i].id}
        />
      ) : (
        <EmptyPluginSlot key={`plugin${x}`} deviceId={deviceId} />
      );
    });
  }, [minPluginSlots, plugins, deviceId, selectedId, setSelectedId]);

  // const handleRemovePlugin = useCallback((pluginId: string) => {
  //   // onRemovePlugin(pluginId);
  //   console.log(pluginId);
  // }, []);

  return (
    <div className="plugin-subpanel">
      <SectionHeader size="small" title="PLUGINS" />
      {pluginSlots}
    </div>
  );
}
