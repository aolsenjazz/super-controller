import { createEntityAdapter } from '@reduxjs/toolkit';

import { DeviceConnectionDetails } from '@shared/device-connection-details';

import type { RootState } from '../../store/store';
import { createAppSlice } from '../../store/createAppSlice';

const connectedDevicesAdapter = createEntityAdapter({
  selectId: (device: DeviceConnectionDetails) => device.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

// If you are not using async thunks you can use the standalone `createSlice`.
export const connectedDevicesSlice = createAppSlice({
  name: 'connectedDevices',

  initialState: connectedDevicesAdapter.getInitialState(),

  reducers: {
    setAll: connectedDevicesAdapter.setAll,
  },
});

export const {
  selectIds,
  selectAll: selectAllDevices,
  selectById: selecteDevice,
} = connectedDevicesAdapter.getSelectors<RootState>(
  (state) => state.connectedDevices
);
