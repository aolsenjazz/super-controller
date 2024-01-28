import { useCallback } from 'react';

const { MenuService } = window;

type PropTypes = {
  deviceId: string;
};

export default function EmptyPluginSlot(props: PropTypes) {
  const { deviceId } = props;

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      MenuService.showDevicePluginMenu(e.clientX, e.clientY, deviceId);
    },
    [deviceId]
  );

  return (
    <div className="plugin-slot empty" onClick={onClick} role="presentation">
      <h4>+</h4>
    </div>
  );
}
