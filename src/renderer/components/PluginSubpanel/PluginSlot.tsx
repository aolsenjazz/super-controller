import type { PluginIcicle } from '@plugins/base-plugin';
import { useCallback, useEffect, useState } from 'react';
import { PluginAggregate } from './plugin-aggregate';
import PluginViewControl from './PluginViewControl';
import PowerButton from './PowerButton';

type PropTypes = {
  plugins: PluginIcicle[];
  removePlugin: (icicle: PluginIcicle) => void;
  deviceId: string;
  selected: boolean;
  setSelectedId: (id: string) => void;
};

export default function PluginSlot(props: PropTypes) {
  const { plugins, removePlugin, selected, setSelectedId, deviceId } = props;

  const [open, setOpen] = useState(false);
  const aggregate = new PluginAggregate(plugins);

  const onClick = useCallback(() => {
    setSelectedId(plugins[0].id);
  }, [plugins, setSelectedId]);

  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 8 && selected === true) {
        plugins.forEach((p) => removePlugin(p));
      }
    },
    [removePlugin, plugins, selected]
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
      {open && <div className="plugin-body" />}
    </div>
  );
}
