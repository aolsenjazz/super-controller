import { InputResponse } from '../driver-types';
import { isOnMessage } from '../util';

const illogicalPairs = [
  ['continuous', 'gate'],
  ['continuous', 'toggle'],
  ['gate', 'continuous'],
  ['toggle', 'continuous'],
  ['toggle', 'gate'],
  ['constant', 'continuous'],
];

/**
 * Manages propagation of messages to devices and clients. Can be set to propagate
 * message different by setting `outputResponse`
 */
export abstract class Propagator {
  /**
   * See InputResponse
   */
  readonly hardwareResponse: InputResponse;

  /**
   * See InputResponse
   */
  outputResponse: InputResponse;

  /* The last-propagated message */
  public lastPropagated?: number[];

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    lastPropagated?: number[]
  ) {
    illogicalPairs.forEach((pair) => {
      if (
        JSON.stringify(pair) ===
        JSON.stringify([hardwareResponse, outputResponse])
      )
        throw new Error(
          `InputResponse[${hardwareResponse}] and OutputResponse[${outputResponse}] is illogical`
        );
    });

    this.hardwareResponse = hardwareResponse;
    this.outputResponse = outputResponse;
    this.lastPropagated = lastPropagated;
  }

  /**
   * Returns different messages to propgate depending on `this.outputResponse`
   * and `this.lastPropagated`.
   *
   * @param msg Message from device to respond to
   * @returns The message to propagate
   */
  handleMessage(msg: number[]) {
    let toPropagate: number[] | undefined;

    switch (this.hardwareResponse) {
      case 'gate':
        toPropagate = this.#handleInputAsGate(msg);
        break;
      case 'toggle':
        toPropagate = this.#handleInputAsToggle(msg);
        break;
      case 'continuous':
        toPropagate = this.#handleInputAsContinuous(msg);
        break;
      case 'constant':
        toPropagate = this.#handleInputAsConstant(msg);
        break;
      default:
        throw new Error(`unknown hardwareResponse ${this.hardwareResponse}`);
    }

    if (toPropagate !== undefined) this.lastPropagated = toPropagate;
    return toPropagate;
  }

  /**
   * Returns the message to propagate if hardwareResponse is gate
   *
   * @param msg The message from device
   * @returns the message to propagate
   */
  #handleInputAsGate = (msg: number[]) => {
    // if outputResponse === 'toggle' | 'constant', only respond to 'noteon' messages
    if (this.outputResponse !== 'gate' && !isOnMessage(msg, true)) {
      return undefined;
    }
    return this.getResponse(msg);
  };

  /**
   * Returns the message to propagate if hardwareResponse is toggle
   *
   * @param msg The message from device
   * @returns the message to propagate
   */
  #handleInputAsToggle = (msg: number[]) => {
    return this.getResponse(msg);
  };

  /**
   * Returns the message to propagate if hardwareResponse is continuous
   *
   * @param msg The message from device
   * @returns the message to propagate
   */
  #handleInputAsContinuous = (msg: number[]) => {
    return this.getResponse(msg);
  };

  /**
   * Returns the message to propagate if hardwareResponse is constant
   *
   * @param msg The message from device
   * @returns the message to propagate
   */
  #handleInputAsConstant = (msg: number[]) => {
    return this.getResponse(msg);
  };

  protected abstract getResponse(msg: number[]): number[] | undefined;

  abstract get eligibleStates(): string[];

  abstract get defaultState(): string;

  abstract get state(): string;
}
