import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from 'renderer/store/createAppSlice';

const initialState: { selectedInputs: string[] } = {
  selectedInputs: [],
};

export const selectedInputsSlice = createAppSlice({
  name: 'selectedInputs',
  initialState,
  reducers: (create) => ({
    setSelectedInputs: create.reducer(
      (state, action: PayloadAction<string[]>) => {
        state.selectedInputs = action.payload;
      }
    ),
  }),
  selectors: {
    selectSelectedInputs: (state) => state.selectedInputs,
  },
});

export const { setSelectedInputs } = selectedInputsSlice.actions;
export const { selectSelectedInputs } = selectedInputsSlice.selectors;
