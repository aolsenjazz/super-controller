import { useMemo, useState } from 'react';

import type { PluginIcicle } from '@plugins/base-plugin';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: PluginIcicle[][];
  showPluginMenu: (x: number, y: number) => void;
  removePlugin: (icicle: PluginIcicle) => void;
  deviceId: string;
};

export default function PluginSubpanel(props: PluginSubpanelProps) {
  const { plugins, showPluginMenu, removePlugin, deviceId } = props;

  const [selectedId, setSelectedId] = useState('');

  const pluginSlots = useMemo(() => {
    return plugins.map((x) => {
      return (
        <PluginSlot
          key={`plugin${x[0].id}`}
          plugins={x}
          removePlugin={removePlugin}
          deviceId={deviceId}
          setSelectedId={setSelectedId}
          selected={selectedId === x[0].id}
        />
      );
    });
  }, [plugins, removePlugin, selectedId, setSelectedId, deviceId]);

  return (
    <div className="plugin-subpanel">
      <SectionHeader size="small" title="PLUGINS" />
      {pluginSlots}
      <EmptyPluginSlot showPluginMenu={showPluginMenu} />
    </div>
  );
}
