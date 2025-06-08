import { startAppListening } from '../store/listener-middleware';
import { projectNameSlice } from '../features/project-name/project-name-slice';
import { recentLoopbackMessagesSlice } from '../features/recent-loopback-messages/recent-loopback-messages-slice';

/**
 * Listens to changes to the current superset dashboard layout. This callback is invoked whenever
 * a gridComponent is added or removed from the layout.
 *
 * It's currently updating in a not-smart way; whenever an update happens, every IkiDynamicMarkdown
 * gridComponent notifies the ContextService to alert us that the layout has changed. Therefore,
 * we end up receiving far too many changed events
 */
startAppListening({
  actionCreator: projectNameSlice.actions.setName,
  effect: async (action, listenerApi) => {
    // ignore if the action is dispatched with the same payload
    if (action.payload === listenerApi.getState().projectName.name) {
      return;
    }

    listenerApi.dispatch(
      recentLoopbackMessagesSlice.actions.clearAllMessages(),
    );
  },
});
