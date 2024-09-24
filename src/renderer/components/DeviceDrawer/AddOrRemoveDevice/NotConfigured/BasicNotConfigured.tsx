import { useCallback } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { useDeviceConnectionDetails } from '@hooks/use-device-connection-details';

const { ProjectConfigService } = window;

export default function BasicNotConfigured() {
  const { selectedDevice } = useSelectedDevice();
  const { deviceConnectionDetails } = useDeviceConnectionDetails(
    selectedDevice || ''
  );

  const onClick = useCallback(() => {
    ProjectConfigService.addDevice(
      deviceConnectionDetails!.name,
      deviceConnectionDetails!.siblingIndex
    );
  }, [deviceConnectionDetails]);

  return (
    <div className="message not-configured">
      <button onClick={onClick} type="button">
        Add Device
      </button>
    </div>
  );
}
