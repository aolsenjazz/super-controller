import { MessageTransport } from './message-transport';
import { PluginProvider } from './plugin-provider';

export type MessageProcessorMeta = {
  loopbackTransports: Map<string, MessageTransport>;

  remoteTransports: Map<string, MessageTransport>;

  pluginProvider: PluginProvider;
};

export type MessageProcessor = {
  process: (
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ) => NumberArrayWithStatus | undefined;
};
