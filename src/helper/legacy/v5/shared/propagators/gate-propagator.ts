import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import { StatefulPropagator } from './stateful-propagator';

/**
 * Propagates messages to clients. Responds differently depending on `outputResponse`,
 * and can be set to change response behaviour
 */
@Revivable.register
export class GatePropagator extends StatefulPropagator<
  'gate',
  'gate' | 'constant' | 'toggle'
> {
  constructor(
    or: 'gate' | 'constant' | 'toggle',
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber,
    s?: StatefulPropagator<'gate', 'gate'>['state']
  ) {
    super('gate', or, et, n, c, v, s);
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.outputResponse,
        this.statusString,
        this.number,
        this.channel,
        this.value,
        this.state,
      ],
    };
  }

  /**
   * Returns the next message to propagate given the received message
   *
   * @param msg The message to respond to
   * @returns The message to propagate
   */
  protected getResponse(msg: MidiArray) {
    let response: MidiArray;
    switch (this.outputResponse) {
      case 'gate':
        response = this.#handleAsGate(msg);
        break;
      case 'toggle':
        response = this.#handleAsToggle();
        break;
      case 'constant':
        response = this.handleAsConstant(msg);
        break;
      default:
        throw new Error(`unknown outputResponse ${this.outputResponse}`);
    }

    if (['toggle', 'gate'].includes(this.outputResponse)) {
      this.state = this.state === 'on' ? 'off' : 'on';
    }

    return response;
  }

  /**
   * Returns the next message to propagate if in 'gate' mode
   *
   * @returns The message to propagate
   */
  #handleAsGate = (msg: MidiArray) => {
    const statusString = this.nextEventType();

    return create(
      statusString,
      this.channel,
      this.number,
      msg[2] as MidiNumber
    );
  };

  /**
   * Returns the next message to propagate if in 'toggle' mode
   *
   * @returns The message to propagate
   */
  #handleAsToggle = () => {
    const statusString = this.nextEventType();
    const value = this.state === 'on' ? 0 : 127;

    return create(statusString, this.channel, this.number, value);
  };
}
