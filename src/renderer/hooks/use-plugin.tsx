import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { useEffect, useState } from 'react';

const { PluginService } = window;

export const usePlugin = <T extends PluginDTO = PluginDTO>(
  pluginId: string
) => {
  const [plugin, setPlugin] = useState<T>(
    () => PluginService.getPlugin(pluginId)!
  );

  useEffect(() => {
    const listener = (p: T) => {
      setPlugin(p);
    };
    listener(PluginService.getPlugin<T>(pluginId)!);

    const off = PluginService.addPluginListener<T>(pluginId, listener);
    return () => off();
  }, [pluginId]);

  return {
    plugin,
  };
};
