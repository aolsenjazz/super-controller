import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';
import type { RootState } from 'renderer/store/store';
import { createAppSlice } from '../../store/createAppSlice';

const inputConfigsEntityAdapter = createEntityAdapter({
  selectId: (conf: MonoInputDTO) => conf.id,
});

export const inputConfigsSlice = createAppSlice({
  name: 'inputConfigs',

  initialState: inputConfigsEntityAdapter.getInitialState(),

  reducers: {
    upsertOne: inputConfigsEntityAdapter.upsertOne,
    upsertMany: inputConfigsEntityAdapter.upsertMany,
    removeMany: inputConfigsEntityAdapter.removeMany,
  },
});

export const { selectById, selectAll, selectEntities, selectIds } =
  inputConfigsEntityAdapter.getSelectors<RootState>(
    (state) => state.inputConfigs
  );

export const selectMany = createSelector(
  [selectEntities, (_: RootState, ids: string[]) => ids],
  (entities, ids) => ids.map((id) => entities[id]).filter(Boolean)
);
