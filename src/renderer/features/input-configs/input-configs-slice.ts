import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { getQualifiedInputId } from '@shared/util';

import type { RootState } from '../../store/store';
import { createAppSlice } from '../../store/createAppSlice';

const { InputConfigService } = window;

const inputConfigsEntityAdapter = createEntityAdapter({
  selectId: (conf: InputDTO) => getQualifiedInputId(conf.deviceId, conf.id),
});

// Load initial state from the backend
const configuredInputs = InputConfigService.getInputConfigs();
const entities: Record<string, InputDTO> = {};
configuredInputs.forEach((i) => {
  entities[getQualifiedInputId(i.deviceId, i.id)] = i;
});
const initialState = inputConfigsEntityAdapter.getInitialState({
  ids: configuredInputs.map((i) => getQualifiedInputId(i.deviceId, i.id)),
  entities,
});

export const inputConfigsSlice = createAppSlice({
  name: 'inputConfigs',

  initialState,

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
  (e, ids) => ids.map((id) => e[id]).filter(Boolean)
);
