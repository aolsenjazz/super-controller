import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from 'renderer/store/createAppSlice';

const initialState: { id: string } = {
  id: '',
};

export const selectedInputSlice = createAppSlice({
  name: 'selectedInputs',
  initialState,
  reducers: (create) => ({
    setSelectedInput: create.reducer((state, action: PayloadAction<string>) => {
      state.id = action.payload;
    }),
  }),
  selectors: {
    selectSelectedInput: (state) => state.id,
  },
});

export const { setSelectedInput } = selectedInputSlice.actions;
export const { selectSelectedInput } = selectedInputSlice.selectors;
