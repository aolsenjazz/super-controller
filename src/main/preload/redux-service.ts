import { UnknownAction } from '@reduxjs/toolkit';
import { addOnChangeListener } from './common';

export const ReduxService = {
  onReduxEvent: (func: (action: UnknownAction) => void) => {
    return addOnChangeListener('redux', func);
  },
};
