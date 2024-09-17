import { useEffect, useState } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { useConfiguredDevices } from '@hooks/use-configured-devices';
import { useConnectedDevices } from '@hooks/use-connected-devices';

import DeviceListItem from './DeviceListItem';

type DeviceListItemData = {
  id: string;
  configured: boolean;
  connected: boolean;
};

const sortDevices = (a: DeviceListItemData, b: DeviceListItemData) => {
  if (a.connected && a.configured && (!b.connected || !b.configured)) return -1;
  if (b.connected && b.configured && (!a.connected || !a.configured)) return 1;

  if (a.connected && !b.connected) return -1;
  if (b.connected && !a.connected) return 1;

  if (a.configured && !b.configured) return -1;
  if (b.configured && !a.configured) return 1;

  return 0;
};

export default function DeviceListPanel() {
  const { selectedDevice, setSelectedDevice } = useSelectedDevice();

  const { connectedDeviceIds } = useConnectedDevices();
  const { configuredDeviceIds } = useConfiguredDevices();

  const [data, setData] = useState<DeviceListItemData[]>([]);

  useEffect(() => {
    const deviceList = [
      ...new Set([...connectedDeviceIds, ...configuredDeviceIds]),
    ]
      .map((id) => {
        return {
          id,
          configured: configuredDeviceIds.includes(id),
          connected: connectedDeviceIds.includes(id),
        };
      })
      .sort(sortDevices);

    setData(deviceList);
  }, [connectedDeviceIds, configuredDeviceIds]);

  useEffect(() => {
    const isCurrentDevicePresent = data.filter(
      (d) => d.id === selectedDevice
    ).length;

    if (selectedDevice === undefined && data.length > 0) {
      setSelectedDevice(data[0].id);
    } else {
      const newDevice = data.length > 0 ? data[0].id : undefined;

      if (!isCurrentDevicePresent) {
        setSelectedDevice(newDevice);
      }
    }
  }, [data, selectedDevice, setSelectedDevice]);

  return (
    <div className="device-list-panel">
      {data.map((d) => {
        return (
          <DeviceListItem
            key={d.id}
            deviceId={d.id}
            selected={selectedDevice === d.id}
            onClick={() => setSelectedDevice(d.id)}
            connected={d.connected}
            configured={d.configured}
          />
        );
      })}
    </div>
  );
}
