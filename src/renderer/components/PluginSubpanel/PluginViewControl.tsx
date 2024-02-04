import ViewClosed from '@assets/plugin_closed.svg';
import ViewOpen from '@assets/plugin_open.svg';
import { useCallback, useEffect } from 'react';

type PropTypes = {
  id: string;
  open: boolean;
  setOpen: (o: boolean) => void;
};

export default function PluginViewControl(props: PropTypes) {
  const { id, open, setOpen } = props;

  const onClick = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  useEffect(() => {
    setOpen(false);
  }, [id, setOpen]);

  return (
    <div onClick={onClick} role="presentation" className="view-control">
      {open ? (
        <img src={ViewOpen} alt="open plugin view" />
      ) : (
        <img src={ViewClosed} alt="close plugin view" />
      )}
    </div>
  );
}
