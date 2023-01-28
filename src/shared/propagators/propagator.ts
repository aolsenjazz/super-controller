import { InputResponse } from '../driver-types';
import { isOnMessage } from '../util';

const illogicalPairs: [InputResponse, InputResponse][] = [
  ['continuous', 'gate'],
  ['continuous', 'toggle'],
  ['gate', 'continuous'],
  ['toggle', 'continuous'],
  ['toggle', 'gate'],
  ['constant', 'continuous'],
];

function checkResponsePair(r1: InputResponse, r2: InputResponse) {
  illogicalPairs.forEach((pair) => {
    if (JSON.stringify(pair) === JSON.stringify([r1, r2]))
      throw new Error(
        `InputResponse[${r1}] and OutputResponse[${r2}] is illogical`
      );
  });
}

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
  #outputResponse: InputResponse;

  /* The last-propagated message */
  public lastPropagated: number[] | null;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    lastPropagated?: number[]
  ) {
    checkResponsePair(hardwareResponse, outputResponse);

    this.hardwareResponse = hardwareResponse;
    this.#outputResponse = outputResponse;
    this.lastPropagated = lastPropagated || null;
  }

  /**
   * Returns different messages to propgate depending on `this.outputResponse`
   * and `this.lastPropagated`.
   *
   * @param msg Message from device to respond to
   * @returns The message to propagate
   */
  handleMessage(msg: number[]) {
    let toPropagate: number[] | null;

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

    if (toPropagate !== null) this.lastPropagated = toPropagate;
    return toPropagate;
  }

  get outputResponse() {
    return this.#outputResponse;
  }

  set outputResponse(r: InputResponse) {
    checkResponsePair(this.hardwareResponse, r);

    this.#outputResponse = r;
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
      return null;
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

  protected abstract getResponse(msg: number[]): number[] | null;

  abstract toJSON(includeState: boolean): string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TESTABLES = new Map<string, any>();
TESTABLES.set('illogicalPairs', illogicalPairs);
