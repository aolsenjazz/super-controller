import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ipcMiddleware } from './ipc-middleware';

import { connectedDevicesSlice } from '../features/connected-devices/connected-devices-slice';
import { configuredDevicesSlice } from '../features/configured-devices/configured-devices-slice';
import { selectedDeviceIdSlice } from '../features/selected-device-id/selected-device-id-slice';
import { inputConfigsSlice } from '../features/input-configs/input-configs-slice';
import { pluginsSlice } from '../features/plugins/plugins-slice';
import { selectedInputIdSlice } from '../features/selected-input-id/selected-input-id-slice';
import { selectedPluginIdSlice } from '../features/selected-plugin-id/selected-plugin-id-slice';
import { recentLoopbackMessagesSlice } from '../features/recent-loopback-messages/recent-loopback-messages-slice';
import { recentRemoteMessagesSlice } from '../features/recent-remote-messages/recent-remote-messages-slice';
import { projectNameSlice } from '../features/project-name/project-name-slice';

const rootReducer = combineSlices(
  connectedDevicesSlice,
  configuredDevicesSlice,
  selectedDeviceIdSlice,
  inputConfigsSlice,
  selectedInputIdSlice,
  pluginsSlice,
  selectedPluginIdSlice,
  recentLoopbackMessagesSlice,
  recentRemoteMessagesSlice,
  projectNameSlice
);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(ipcMiddleware);
    },
    preloadedState,
  });
  return store;
};

export const store = makeStore();

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
