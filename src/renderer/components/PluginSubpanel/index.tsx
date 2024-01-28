import { useMemo, useState } from 'react';

import type { PluginIcicle } from '@plugins/base-plugin';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: PluginIcicle[];
  showPluginMenu: (x: number, y: number) => void;
  removePlugin: (icicle: PluginIcicle) => void;
  deviceId: string;
};

export default function PluginSubpanel(props: PluginSubpanelProps) {
  const { plugins, showPluginMenu, removePlugin, deviceId } = props;

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
          removePlugin={removePlugin}
          deviceId={deviceId}
          setSelectedId={setSelectedId}
          selected={selectedId === plugins[i].id}
        />
      ) : (
        <EmptyPluginSlot key={`plugin${x}`} showPluginMenu={showPluginMenu} />
      );
    });
  }, [
    minPluginSlots,
    plugins,
    showPluginMenu,
    removePlugin,
    selectedId,
    setSelectedId,
    deviceId,
  ]);

  return (
    <div className="plugin-subpanel">
      <SectionHeader size="small" title="PLUGINS" />
      {pluginSlots}
    </div>
  );
}
