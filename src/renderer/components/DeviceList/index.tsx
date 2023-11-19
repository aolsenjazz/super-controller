import { useEffect, useState } from 'react';
import { useDevice } from 'renderer/context/device-context';

import DeviceListItem from './DeviceListItem';

const { deviceService } = window;

export default function DeviceList() {
  const { selectedDevice, setSelectedDevice } = useDevice();

  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {
    const cb = (ids: string[]) => {
      setDevices(ids);
    };

    const off = deviceService.onDeviceListChange(cb);
    deviceService.requestDeviceList();

    return () => off();
  }, [setDevices]);

  return (
    <div id="device-list" className="top-level">
      {devices.map((id) => {
        return (
          <DeviceListItem
            key={id}
            deviceId={id}
            selected={selectedDevice === id}
            onClick={() => setSelectedDevice(id)}
          />
        );
      })}
    </div>
  );
}
