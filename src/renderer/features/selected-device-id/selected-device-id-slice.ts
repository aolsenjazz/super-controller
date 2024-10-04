import { PayloadAction } from '@reduxjs/toolkit';

import { createAppSlice } from '../../store/createAppSlice';

const initialState: { id: string | null } = {
  id: null,
};

/**
 * Updated whenever a user selects a device. *Note* that the selector exported
 * for this slice should not be used in selectedIdSelector should be used
 */
export const selectedDeviceIdSlice = createAppSlice({
  name: 'selectedDeviceId',

  initialState,

  reducers: (create) => ({
    setId: create.reducer((state, action: PayloadAction<string | null>) => {
      state.id = action.payload;
    }),
  }),
  selectors: {
    selectId: (state) => state.id,
  },
});

export const { setId } = selectedDeviceIdSlice.actions;
export const { selectId } = selectedDeviceIdSlice.selectors;
