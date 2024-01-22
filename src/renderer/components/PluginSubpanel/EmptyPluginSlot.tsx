import { useCallback } from 'react';

const { MenuService } = window;

export default function EmptyPluginSlot() {
  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    MenuService.showDevicePluginMenu(e.clientX, e.clientY);
  }, []);

  return (
    <div className="plugin-slot empty" onClick={onClick} role="presentation">
      <h4>+</h4>
    </div>
  );
}
