import { useMemo } from 'react';

import { PluginIcicle } from '@plugins/base-plugin';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: PluginIcicle[];
};

export default function PluginSubpanel({ plugins }: PluginSubpanelProps) {
  const minPluginSlots = useMemo(() => {
    return plugins.length > 3 ? plugins.length + 1 : 3;
  }, [plugins]);

  const pluginSlots = useMemo(() => {
    return [...Array(minPluginSlots).keys()].map((x, i) => {
      return plugins.length > i ? (
        <PluginSlot key={`plugin${x}`} />
      ) : (
        <EmptyPluginSlot key={`plugin${x}`} />
      );
    });
  }, [minPluginSlots, plugins.length]);

  // const handleAddPlugin = useCallback(() => {
  //   // Logic to add a plugin
  // }, []);

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
