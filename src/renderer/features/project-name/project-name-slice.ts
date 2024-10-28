import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from 'renderer/store/createAppSlice';

const initialState = {
  name: 'Default Project',
};

export const projectNameSlice = createAppSlice({
  name: 'projectName',
  initialState,
  reducers: (create) => ({
    setName: create.reducer((state, action: PayloadAction<string>) => {
      state.name = action.payload;
    }),
  }),
  selectors: {
    selectProjectName: (state) => state.name,
  },
});

export const { selectProjectName } = projectNameSlice.selectors;
