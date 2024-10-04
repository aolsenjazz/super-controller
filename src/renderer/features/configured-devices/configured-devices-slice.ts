import { createEntityAdapter } from '@reduxjs/toolkit';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import type { RootState } from 'renderer/store/store';

import { createAppSlice } from '../../store/createAppSlice';

const configuredDevicesAdapter = createEntityAdapter({
  selectId: (config: DeviceConfigDTO) => config.id,
  sortComparer: (a, b) => a.nickname.localeCompare(b.nickname),
});

export const configuredDevicesSlice = createAppSlice({
  name: 'configuredDevices',

  initialState: configuredDevicesAdapter.getInitialState(),

  reducers: {
    setAll: configuredDevicesAdapter.setAll,
  },
});

export const { selectIds, selectAll, selectById } =
  configuredDevicesAdapter.getSelectors<RootState>(
    (state) => state.configuredDevices
  );
