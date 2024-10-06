import { createEntityAdapter } from '@reduxjs/toolkit';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import type { RootState } from 'renderer/store/store';
import { createAppSlice } from '../../store/createAppSlice';

const inputConfigsEntityAdapter = createEntityAdapter({
  selectId: (conf: InputDTO) => conf.id,
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

export const { selectById, selectAll } =
  inputConfigsEntityAdapter.getSelectors<RootState>(
    (state) => state.inputConfigs
  );
