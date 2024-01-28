import type { PluginIcicle } from '@plugins/base-plugin';
import { useCallback, useEffect, useState } from 'react';
import PluginViewControl from './PluginViewControl';
import PowerButton from './PowerButton';

type PropTypes = {
  icicle: PluginIcicle;
  removePlugin: (icicle: PluginIcicle) => void;
  deviceId: string;
  selected: boolean;
  setSelectedId: (id: string) => void;
};

export default function PluginSlot(props: PropTypes) {
  const { icicle, removePlugin, selected, setSelectedId, deviceId } = props;

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setSelectedId(icicle.id);
  }, [icicle.id, setSelectedId]);

  // Function to handle backspace event
  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 8 && selected === true) {
        removePlugin(icicle);
      }
    },
    [removePlugin, icicle, selected]
  );

  // Use useEffect to attach and clean up the event listener
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
        <PowerButton icicle={icicle} deviceId={deviceId} />
        <PluginViewControl icicle={icicle} open={open} setOpen={setOpen} />
        <h5>{icicle.title}</h5>
      </div>
      {open && <div className="plugin-body" />}
    </div>
  );
}
