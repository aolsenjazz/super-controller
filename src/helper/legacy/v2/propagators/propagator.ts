import { MidiArray } from '../midi-array';
import { InputResponse } from '../driver-types';

type ResponseMap = {
  continuous: 'continuous' | 'constant';
  toggle: 'toggle' | 'constant';
  gate: 'gate' | 'constant' | 'toggle';
  constant: 'toggle' | 'constant';
};

type HardwareResponse<K extends keyof ResponseMap = keyof ResponseMap> = {
  [P in K]: ResponseMap[P];
}[K];

export type CorrelatedResponse<T extends InputResponse> = HardwareResponse<T>;

/**
 * Manages propagation of messages to devices and clients. Can be set to propagate
 * message different by setting `outputResponse`
 */
export abstract class Propagator<
  T extends keyof ResponseMap,
  U extends HardwareResponse<T>,
> {
  /**
   * See InputResponse
   */
  readonly hardwareResponse: T;

  /**
   * See InputResponse. Initially set to `constant` to satisfy the compiler
   *
   * @ts-ignore
   */
  outputResponse: HardwareResponse<T>;

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
  handleMessage(msg: MidiArray) {
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
  protected abstract getResponse(msg: MidiArray): MidiArray | undefined;

  /**
   * Returns the message to propagate if hardwareResponse is gate
   *
   * @param msg The message from device
   * @returns the message to propagate
   */
  #handleInputAsGate = (msg: MidiArray) => {
    // if outputResponse === 'toggle' | 'constant', only respond to 'noteon' messages
    if (this.outputResponse !== 'gate' && !msg.isOnIsh(true)) {
      return undefined;
    }
    return this.getResponse(msg);
  };
}
