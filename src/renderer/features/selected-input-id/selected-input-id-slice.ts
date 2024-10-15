import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from 'renderer/store/createAppSlice';

const initialState: { id: string | null } = {
  id: null,
};

export const selectedInputIdSlice = createAppSlice({
  name: 'selectedInputId',
  initialState,
  reducers: (create) => ({
    setId: create.reducer((state, action: PayloadAction<string>) => {
      state.id = action.payload;
    }),
  }),
  selectors: {
    selectSelectedInputId: (state) => state.id,
  },
});

export const { setId: setSelectedInputId } = selectedInputIdSlice.actions;
export const { selectSelectedInputId } = selectedInputIdSlice.selectors;
