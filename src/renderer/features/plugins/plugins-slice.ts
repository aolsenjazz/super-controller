import { createEntityAdapter } from '@reduxjs/toolkit';

import { PluginDTO } from '@shared/plugin-core/base-plugin';

import { createAppSlice } from '../../store/createAppSlice';
import type { RootState } from '../../store/store';

const { PluginService } = window;

const pluginsEntityAdapter = createEntityAdapter({
  selectId: (p: PluginDTO) => p.id,
});

// Load initial state from the backend
const plugins = PluginService.getAllPlugins();
const entities: Record<string, PluginDTO> = {};
plugins.forEach((p) => {
  entities[p.id] = p;
});
const initialState = pluginsEntityAdapter.getInitialState({
  ids: plugins.map((p) => p.id),
  entities,
});

export const pluginsSlice = createAppSlice({
  name: 'plugins',
  initialState,
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
