import { useCallback } from 'react';

type PropTypes = {
  showPluginMenu: (x: number, y: number) => void;
};

export default function EmptyPluginSlot(props: PropTypes) {
  const { showPluginMenu } = props;

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      showPluginMenu(e.clientX, e.clientY);
    },
    [showPluginMenu]
  );

  return (
    <div className="plugin-slot empty" onClick={onClick} role="presentation">
      <h4>+</h4>
    </div>
  );
}
