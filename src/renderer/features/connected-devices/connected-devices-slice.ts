import { createEntityAdapter } from '@reduxjs/toolkit';

import { DeviceConnectionDetails } from '@shared/device-connection-details';

import type { RootState } from '../../store/store';
import { createAppSlice } from '../../store/createAppSlice';

const { HostService } = window;

const connectedDevicesAdapter = createEntityAdapter({
  selectId: (device: DeviceConnectionDetails) => device.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

// Load initial state from the backend
const connectedDevices = HostService.getConnectedDevices();
const entities: Record<string, DeviceConnectionDetails> = {};
connectedDevices.forEach((d) => {
  entities[d.id] = d;
});
const initialState = connectedDevicesAdapter.getInitialState({
  ids: connectedDevices.map((d) => d.id),
  entities,
});

export const connectedDevicesSlice = createAppSlice({
  name: 'connectedDevices',

  initialState,

  reducers: {
    setAll: connectedDevicesAdapter.setAll,
  },
});

export const {
  selectIds,
  selectAll: selectAllDevices,
  selectById: selecteDevice,
} = connectedDevicesAdapter.getSelectors<RootState>(
  (state) => state.connectedDevices,
);
