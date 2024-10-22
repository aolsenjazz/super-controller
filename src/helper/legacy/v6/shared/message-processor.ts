import { InputProvider } from './input-provider';
import { MessageTransport } from './message-transport';
import { PluginProvider } from './plugin-provider';

export type MessageProcessorMeta = {
  /**
   * Transport for sending messages back to the message source device.
   */
  loopbackTransport: MessageTransport;

  /**
   * Transport for sending messages through the SC-created port associated with the
   * message source device. _Caution_ - this should be used judiciously as generally,
   * the preferred method of sending messages to device is by return the message
   * to be sent in `process` function. This transport should be used when, e.g.
   *
   * - Stopping message propagation but sending a message anyways
   * - Sending additional messages through the remote transport
   */
  remoteTransport: MessageTransport;

  loopbackTransports: Map<string, MessageTransport>;

  remoteTransports: Map<string, MessageTransport>;

  pluginProvider: PluginProvider;

  inputProvider: InputProvider;
};

export type MessageProcessor = {
  process: (
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ) => NumberArrayWithStatus | undefined;
};
