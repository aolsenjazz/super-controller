import { useMemo } from 'react';

import { PluginUIProps } from '@shared/plugin-core/plugin-ui-props';

import SectionHeader from '../SectionHeader';
import PluginSlot from './PluginSlot';
import EmptyPluginSlot from './EmptyPluginSlot';

type PluginSubpanelProps = {
  plugins: string[];
  showPluginMenu: (x: number, y: number) => void;
  removePlugin: (pluginId: string) => void;
  showAddPlugin: boolean;
  deviceId: string;
  importPlugin: (title: string) => Promise<React.FC<PluginUIProps>>;
};

export default function PluginSubpanel(props: PluginSubpanelProps) {
  const {
    plugins,
    showPluginMenu,
    removePlugin,
    showAddPlugin,
    deviceId,
    importPlugin,
  } = props;

  const pluginSlots = useMemo(() => {
    return plugins.map((x) => {
      return (
        <PluginSlot
          key={`plugin${x}`}
          pluginId={x}
          selectedDevice={deviceId}
          removePlugin={removePlugin}
          importPlugin={importPlugin}
        />
      );
    });
  }, [plugins, removePlugin, deviceId, importPlugin]);

  return (
    <div className="plugin-subpanel">
      <SectionHeader size="small" title="PLUGINS" />
      {pluginSlots}
      {showAddPlugin && <EmptyPluginSlot showPluginMenu={showPluginMenu} />}
    </div>
  );
}
