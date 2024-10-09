import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { id: null | string } = {
  id: null,
};

export const selectedPluginIdSlice = createSlice({
  name: 'selectedPluginId',
  initialState,
  reducers: (create) => ({
    setSelectedPluginId: create.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.id = action.payload;
      }
    ),
  }),
  selectors: {
    selectSelectedPluginId: (state) => state.id,
  },
});

export const { selectSelectedPluginId } = selectedPluginIdSlice.selectors;
export const { setSelectedPluginId } = selectedPluginIdSlice.actions;
