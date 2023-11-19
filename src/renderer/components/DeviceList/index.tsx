import { useEffect, useState } from 'react';

import DeviceListItem from './DeviceListItem';

const { deviceService } = window;

type PropTypes = {
  setSelectedDevice: (selectedId: string | undefined) => void;
  selectedDevice: string | undefined;
};
export default function DeviceList(props: PropTypes) {
  const { setSelectedDevice, selectedDevice } = props;

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
