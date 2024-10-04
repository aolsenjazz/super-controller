import { createSelector } from 'reselect';

import { selectAll as selectAllConfigs } from '@features/configured-devices/configured-devices-slice';
import { selectAllDevices } from '@features/connected-devices/connected-devices-slice';

import { UnifiedDevice } from '../unified-device';
import type { RootState } from '../store/store';

const selectConfiguredDevices = (state: RootState) => selectAllConfigs(state);
const selectConnectedDevices = (state: RootState) => selectAllDevices(state);

export const selectUnifiedDevices = createSelector(
  [selectConfiguredDevices, selectConnectedDevices],
  (configuredDevices, connectedDevices): UnifiedDevice[] => {
    const deviceMap: Record<string, UnifiedDevice> = {};

    // add connected devices to the map
    connectedDevices.forEach((d) => {
      deviceMap[d.id] = {
        id: d.id,
        connectionDetails: d,
      };
    });

    // upsert configured devices to the map
    configuredDevices.forEach((c) => {
      if (deviceMap[c.id]) {
        deviceMap[c.id].config = c;
      } else {
        deviceMap[c.id] = {
          id: c.id,
          config: c,
        };
      }
    });

    // sort
    const deviceList = Object.values(deviceMap);
    deviceList.sort((a, b) => {
      const getCategoryRank = (device: UnifiedDevice) => {
        if (device.config && device.connectionDetails) return 1;
        if (device.connectionDetails && !device.config) return 2;
        return 3;
      };

      const rankA = getCategoryRank(a);
      const rankB = getCategoryRank(b);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return a.id.localeCompare(b.id);
    });

    return deviceList;
  }
);
