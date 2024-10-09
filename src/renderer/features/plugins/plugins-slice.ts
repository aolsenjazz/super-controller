import { createAppSlice } from 'renderer/store/createAppSlice';
import type { RootState } from 'renderer/store/store';

import { createEntityAdapter } from '@reduxjs/toolkit';
import { PluginDTO } from '@shared/plugin-core/base-plugin';

const pluginsEntityAdapter = createEntityAdapter({
  selectId: (p: PluginDTO) => p.id,
});

export const pluginsSlice = createAppSlice({
  name: 'plugins',
  initialState: pluginsEntityAdapter.getInitialState(),
  reducers: {
    upsertMany: pluginsEntityAdapter.upsertMany,
    upsertOne: pluginsEntityAdapter.upsertOne,
    removeOne: pluginsEntityAdapter.removeOne,
  },
});

export const {
  selectById: selectPluginById,
  selectEntities: selectPluginEntities,
} = pluginsEntityAdapter.getSelectors((state: RootState) => state.plugins);
