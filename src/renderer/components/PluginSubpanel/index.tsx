import { useMemo } from 'react';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: string[];
  showPluginMenu: (x: number, y: number) => void;
  removePlugin: (pluginId: string) => void;
  showAddPlugin: boolean;
  selectedDevice: string;
};

export default function PluginSubpanel(props: PluginSubpanelProps) {
  const {
    plugins,
    showPluginMenu,
    removePlugin,
    showAddPlugin,
    selectedDevice,
  } = props;

  const pluginSlots = useMemo(() => {
    return plugins.map((x) => {
      return (
        <PluginSlot
          key={`plugin${x}`}
          pluginId={x}
          selectedDevice={selectedDevice}
          removePlugin={removePlugin}
        />
      );
    });
  }, [plugins, removePlugin, selectedDevice]);

  return (
    <div className="plugin-subpanel">
      <SectionHeader size="small" title="PLUGINS" />
      {pluginSlots}
      {showAddPlugin && <EmptyPluginSlot showPluginMenu={showPluginMenu} />}
    </div>
  );
}
