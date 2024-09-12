import { useMemo } from 'react';

import type { PluginIcicle } from '@shared/plugin-core/base-plugin';

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

/**
 * Shows a list of plugins and/or plugin slots. Supports both device and input
 * plugins, so most functions to manage these plugins are received via props.
 */
export default function PluginSubpanel(props: PluginSubpanelProps) {
  const { plugins, showPluginMenu, removePlugins, deviceId, showAddPlugin } =
    props;

  // TODO: really should just pass a PluginAggregate to plugin slots
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
