import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { useSelectedPlugin } from '@context/selected-plugin-context';

import PluginBody from './PluginBody';
import PluginViewControl from './PluginViewControl';
import PowerButton from './PowerButton';

const { PluginService } = window;

type PropTypes = {
  pluginId: string;
  removePlugin: (pluginId: string) => void;
};

/**
 * Each plugin slot represents an array of plugins, where selecting n inputs/devices
 * can cause a single plugin slot to represent n plugins, if all homogenous.
 */
export default function PluginSlot(props: PropTypes) {
  const { pluginId, removePlugin } = props;

  const { selectedPlugin, setSelectedPlugin } = useSelectedPlugin();
  const [on, setOn] = useState(true);
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const selected = selectedPlugin === pluginId;

  useLayoutEffect(() => {
    const plugin = PluginService.getPlugin(pluginId);
    if (plugin) {
      setOn(plugin.on);
      setTitle(plugin.title);
    }
  }, [pluginId]);

  // write a snippet of code to handle automatically opening a channel for plugin-${id}
  useEffect(() => {
    const remove = PluginService.addPluginListener(pluginId, (dto) => {
      setOn(dto.on);
      setTitle(dto.title);
    });
    return () => remove();
  }, [pluginId]);

  const onClick = useCallback(() => {
    setSelectedPlugin(pluginId);
  }, [pluginId, setSelectedPlugin]);

  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 8 && selected === true) {
        removePlugin(pluginId);
      }
    },
    [removePlugin, pluginId, selected]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleBackspace);
    return () => {
      document.removeEventListener('keydown', handleBackspace);
    };
  }, [handleBackspace, selected]);

  const onPowerButtonClick = () => {
    PluginService.togglePower(pluginId);
  };

  return (
    <div
      className={`plugin-slot filled ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="presentation"
    >
      <div className="plugin-header">
        <PowerButton on={on} onClick={onPowerButtonClick} />
        <PluginViewControl id={pluginId} open={open} setOpen={setOpen} />
        <h5>{title}</h5>
      </div>
      {open && <PluginBody pluginId={pluginId} title={title} />}
    </div>
  );
}
