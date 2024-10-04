import { Middleware } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';

const { ReduxService } = window;

/**
 * Listens for actions coming from the backend process, and dispatches them to store
 */
export const ipcMiddleware: Middleware = (store) => {
  ReduxService.onReduxEvent((action: UnknownAction) => {
    store.dispatch(action);
  });

  return (next) => (action) => next(action);
};
