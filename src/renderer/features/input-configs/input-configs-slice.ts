import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { getQualifiedInputId } from '@shared/util';
import type { RootState } from 'renderer/store/store';
import { createAppSlice } from '../../store/createAppSlice';

const inputConfigsEntityAdapter = createEntityAdapter({
  selectId: (conf: InputDTO) => getQualifiedInputId(conf.deviceId, conf.id),
});

export const inputConfigsSlice = createAppSlice({
  name: 'inputConfigs',

  initialState: inputConfigsEntityAdapter.getInitialState(),

  reducers: {
    upsertOne: inputConfigsEntityAdapter.upsertOne,
    upsertMany: inputConfigsEntityAdapter.upsertMany,
    removeMany: inputConfigsEntityAdapter.removeMany,
    removeOne: inputConfigsEntityAdapter.removeOne,
  },
});

export const {
  selectById: selectInputConfigById,
  selectAll: selectAllInputConfigs,
  selectEntities: selectInputConfigEntities,
  selectIds: selectInputConfigIds,
} = inputConfigsEntityAdapter.getSelectors<RootState>(
  (state) => state.inputConfigs
);

export const selectManyInputConfigs = createSelector(
  [selectInputConfigEntities, (_: RootState, ids: string[]) => ids],
  (entities, ids) => ids.map((id) => entities[id]).filter(Boolean)
);
