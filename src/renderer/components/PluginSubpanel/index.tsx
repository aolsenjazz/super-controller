import { useMemo } from 'react';

import type { PluginIcicle } from '@plugins/base-plugin';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: PluginIcicle[][];
  showPluginMenu: (x: number, y: number) => void;
  removePlugins: (icicles: PluginIcicle[]) => void;
  deviceId: string;
  showAddPlugin: boolean;
};

export default function PluginSubpanel(props: PluginSubpanelProps) {
  const { plugins, showPluginMenu, removePlugins, deviceId, showAddPlugin } =
    props;

  const pluginSlots = useMemo(() => {
    return plugins.map((x) => {
      return (
        <PluginSlot
          key={`plugin${x[0].id}`}
          plugins={x}
          removePlugins={removePlugins}
          deviceId={deviceId}
        />
      );
    });
  }, [plugins, removePlugins, deviceId]);

  return (
    <div className="plugin-subpanel">
      <SectionHeader size="small" title="PLUGINS" />
      {pluginSlots}
      {showAddPlugin && <EmptyPluginSlot showPluginMenu={showPluginMenu} />}
    </div>
  );
}
