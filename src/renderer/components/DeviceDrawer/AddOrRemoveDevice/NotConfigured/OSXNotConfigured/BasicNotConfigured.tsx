import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { useDeviceStub } from '@hooks/use-device-stub';

const { ConfigService } = window;

export default function BasicNotConfigured() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceStub } = useDeviceStub(selectedDevice || '');

  const onClick = useCallback(() => {
    ConfigService.addDevice(deviceStub!.name, deviceStub!.siblingIndex);
  }, [deviceStub]);

  return (
    <div className="message not-configured">
      <button onClick={onClick} type="button">
        Add Device
      </button>
    </div>
  );
}
