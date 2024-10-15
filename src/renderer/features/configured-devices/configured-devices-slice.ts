import { createEntityAdapter } from '@reduxjs/toolkit';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';

import type { RootState } from '../../store/store';
import { createAppSlice } from '../../store/createAppSlice';

const { DeviceConfigService } = window;

const configuredDevicesAdapter = createEntityAdapter({
  selectId: (config: DeviceConfigDTO) => config.id,
  sortComparer: (a, b) => a.nickname.localeCompare(b.nickname),
});

// Load initial state from the backend
const configuredDevices = DeviceConfigService.getConfiguredDevices();
const entities: Record<string, DeviceConfigDTO> = {};
configuredDevices.forEach((d) => {
  entities[d.id] = d;
});
const initialState = configuredDevicesAdapter.getInitialState({
  ids: configuredDevices.map((d) => d.id),
  entities,
});

export const configuredDevicesSlice = createAppSlice({
  name: 'configuredDevices',

  initialState,

  reducers: {
    setAll: configuredDevicesAdapter.setAll,
    upsertOne: configuredDevicesAdapter.upsertOne,
  },
});

export const { selectIds, selectAll, selectById } =
  configuredDevicesAdapter.getSelectors<RootState>(
    (state) => state.configuredDevices
  );
