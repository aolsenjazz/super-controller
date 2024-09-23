export interface MessageTransport {
  send: (msg: NumberArrayWithStatus) => void;
}
