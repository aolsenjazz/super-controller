import type { PluginIcicle } from '@plugins/base-plugin';
import { useCallback, useState } from 'react';
import PluginViewControl from './PluginViewControl';
import PowerButton from './PowerButton';

type PropTypes = {
  icicle: PluginIcicle;
  deviceId: string;
  selected: boolean;
  setSelectedId: (id: string) => void;
};

export default function PluginSlot(props: PropTypes) {
  const { icicle, deviceId, selected, setSelectedId } = props;

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setSelectedId(icicle.id);
  }, [icicle.id, setSelectedId]);

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
