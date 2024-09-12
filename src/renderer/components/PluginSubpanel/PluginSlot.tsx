import { useSelectedPlugin } from '@context/selected-plugin-context';
import type { PluginIcicle } from '@plugins/base-plugin';
import { useCallback, useEffect, useState } from 'react';
import { PluginAggregate } from './plugin-aggregate';
import PluginBody from './PluginBody';
import PluginViewControl from './PluginViewControl';
import PowerButton from './PowerButton';

type PropTypes = {
  plugins: PluginIcicle[];
  removePlugins: (plugins: PluginIcicle[]) => void;
  deviceId: string;
};

/**
 * Each plugin slot represents an array of plugins, where selecting n inputs/devices
 * can cause a single plugin slot to represent n plugins, if all homogenous.
 *
 * TODO: It feels like we should use PluginAggregates rather than an array of plugins
 * TODO: we're currently lazily passing the plugin at index-0 to display plugin data. need to use aggregate
 */
export default function PluginSlot(props: PropTypes) {
  const { plugins, removePlugins, deviceId } = props;

  const { selectedPlugin, setSelectedPlugin } = useSelectedPlugin();
  const [open, setOpen] = useState(false);
  const aggregate = new PluginAggregate(plugins);
  const selected = selectedPlugin === plugins[0].id;

  const onClick = useCallback(() => {
    setSelectedPlugin(plugins[0].id);
  }, [plugins, setSelectedPlugin]);

  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 8 && selected === true) {
        removePlugins(plugins);
      }
    },
    [removePlugins, plugins, selected]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleBackspace);
    return () => {
      document.removeEventListener('keydown', handleBackspace);
    };
  }, [handleBackspace, selected]);

  return (
    <div
      className={`plugin-slot filled ${selected ? 'selected' : ''}`}
      onClick={onClick}
      role="presentation"
    >
      <div className="plugin-header">
        <PowerButton plugins={plugins} deviceId={deviceId} />
        <PluginViewControl id={plugins[0].id} open={open} setOpen={setOpen} />
        <h5>{aggregate.title}</h5>
      </div>
      {open && <PluginBody plugins={plugins} />}
    </div>
  );
}
