export interface MessageTransport {
  send: (msg: NumberArrayWithStatus) => void;

  /**
   * Some older 5 pin devices are nice + slow and can only process messages so
   * fast. In the event that messages are sent too fast, they may not receive
   * excess messages. Applying a nondestructive throttle ensures that every message
   * is received.
   */
  applyThrottle: (throttle: number) => void;
}
