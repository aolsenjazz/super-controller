import { Middleware } from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';

const { ReduxService } = window;

/**
 * Listens for actions coming from the backend process, and dispatches them to store.
 *
 * For whatever reason, React doesn't handle 50+ messages coming from IPC in quick succession
 * (1-2ms), and console output will complain that Maximum Update Depth has been exceeded.
 * Batching the actions received from IPC for whatever reason fixes this.
 */
export const ipcMiddleware: Middleware = (store) => {
  let actions: UnknownAction[] = [];

  ReduxService.onReduxEvent((action: UnknownAction) => {
    actions.push(action);
  });

  setInterval(() => {
    actions.forEach((a) => store.dispatch(a));
    actions = [];
  }, 20);

  return (next) => (action) => next(action);
};
