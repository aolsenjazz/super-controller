import { PayloadAction } from '@reduxjs/toolkit';
import { getQualifiedInputId } from '@shared/util';
import { TimestampedMidiEvent } from '@shared/timestamped-midi-event';

import type { RootState } from '../../store/store';
import { createAppSlice } from '../../store/createAppSlice';

type AddMessagePayload = {
  deviceId: string;
  inputId: string;
  message: TimestampedMidiEvent;
};

const initialState: Record<string, TimestampedMidiEvent[]> = {};

export const recentLoopbackMessagesSlice = createAppSlice({
  name: 'recentLoopbackMessages',

  initialState,

  reducers: (create) => ({
    addMessage: create.reducer(
      (state, action: PayloadAction<AddMessagePayload>) => {
        const { deviceId, inputId, message } = action.payload;

        // add message for the device
        if (!state[deviceId]) state[deviceId] = [];

        state[deviceId].push(message);
        if (state[deviceId].length > 100) state[deviceId].shift();

        // add message for the qualified input id
        const qid = getQualifiedInputId(deviceId, inputId);
        if (!state[qid]) state[qid] = [];

        state[qid].push(message);
        if (state[qid].length > 100) state[qid].shift();
      },
    ),

    clearAllMessages: create.reducer((state) => {
      Array.from(Object.keys(state)).forEach((k) => {
        delete state[k];
      });
    }),
  }),
});

export const selectRecentLoopbackMessages = (state: RootState, id: string) =>
  state.recentLoopbackMessages[id];
