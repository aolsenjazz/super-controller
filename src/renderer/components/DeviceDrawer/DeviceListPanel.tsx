import { useEffect, useState } from 'react';

import { useSelectedDevice } from '@context/selected-device-context';
import { useConfiguredDevices } from '@hooks/use-configured-devices';
import { useConnectedDevices } from '@hooks/use-connected-devices';

import DeviceListItem from './DeviceListItem';

type DeviceListItemData = {
  id: string;
  name: string;
  connected: boolean;
  configured: boolean;
  driverName: string;
  siblingIndex: number;
};

const sortDevices = (a: DeviceListItemData, b: DeviceListItemData) => {
  if (a.connected && a.configured && (!b.connected || !b.configured)) return -1;
  if (b.connected && b.configured && (!a.connected || !a.configured)) return 1;

  if (a.connected && !b.connected) return -1;
  if (b.connected && !a.connected) return 1;

  if (a.configured && !b.configured) return -1;
  if (b.configured && !a.configured) return 1;

  return a.name.localeCompare(b.name);
};

export default function DeviceListPanel() {
  const { selectedDevice, setSelectedDevice } = useSelectedDevice();

  const { connectedDevices } = useConnectedDevices();
  const { configStubs } = useConfiguredDevices();

  const [data, setData] = useState<DeviceListItemData[]>([]);

  useEffect(() => {
    const connectedDevicesIds = connectedDevices.map((d) => d.id);
    const configuredDeviceIds = configStubs.map((s) => s.id);

    const configuredDevices = configStubs.map((s) => {
      return {
        ...s,
        name: s.nickname || s.portName,
        connected: connectedDevicesIds.includes(s.id),
        configured: true,
      };
    });

    const nonConfiguredDevices = connectedDevices
      .filter((d) => !configuredDeviceIds.includes(d.id))
      .map((d) => {
        return {
          ...d,
          connected: true,
          configured: false,
          driverName: d.name,
        };
      });

    const sorted = [...configuredDevices, ...nonConfiguredDevices].sort(
      sortDevices
    );

    setData(sorted);
  }, [connectedDevices, configStubs]);

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
            name={d.name}
            driverName={d.driverName}
            siblingIndex={d.siblingIndex}
          />
        );
      })}
    </div>
  );
}
