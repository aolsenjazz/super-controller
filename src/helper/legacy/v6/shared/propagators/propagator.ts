import { InputResponse } from '../driver-types/input-drivers/mono-interactive-driver';
import { isOnIsh } from '../midi-util';

/**
 * Manages propagation of messages to devices and clients. Can be set to propagate
 * message different by setting `outputResponse`
 */
export abstract class Propagator<
  T extends InputResponse,
  U extends InputResponse
> {
  /**
   * See InputResponse
   */
  readonly hardwareResponse: T;

  outputResponse: U;

  constructor(hardwareResponse: T, outputResponse: U) {
    this.hardwareResponse = hardwareResponse;
    this.outputResponse = outputResponse;
  }

  /**
   * Processes `msg`, applying overrides or returning custom messages
   *
   * @param msg Message from device to respond to
   * @returns The message to propagate
   */
  handleMessage(msg: NumberArrayWithStatus) {
    return this.hardwareResponse === 'gate'
      ? this.#handleInputAsGate(msg)
      : this.getResponse(msg);
  }

  /**
   * Returns the next message to propagate. This function is only invoked when a
   * message is *supposed* to be responded-to. In other words, it filters out extra
   * noteoff mesages from gate inputs.
   *
   * @param msg Them message to respond to
   * @return The  message to propagate
   */
  protected abstract getResponse(
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus | undefined;

  /**
   * Returns the message to propagate if hardwareResponse is gate. Used to omit responding
   * to noteon events when outputResponse demands it
   *
   * @param msg The message from device
   * @returns the message to propagate
   */
  #handleInputAsGate = (msg: NumberArrayWithStatus) => {
    // if outputResponse === 'toggle' | 'constant', only respond to 'noteon' messages
    if (this.outputResponse !== 'gate' && !isOnIsh(msg, true)) {
      return undefined;
    }
    return this.getResponse(msg);
  };
}
