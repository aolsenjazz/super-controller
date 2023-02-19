import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { StatelessPropagator } from './stateless-propagator';
import { CorrelatedResponse } from './propagator';

@Revivable.register
export class ContinuousPropagator extends StatelessPropagator {
  valueType: 'endless' | 'absolute' = 'absolute';

  knobType: 'endless' | 'absolute' = 'absolute';

  constructor(
    or: CorrelatedResponse<'continuous'>,
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber,
    knobType?: 'endless' | 'absolute',
    valueType?: 'endless' | 'absolute'
  ) {
    super('continuous', or, et, n, c, v);

    this.valueType = valueType || this.valueType;
    this.knobType = knobType || this.knobType;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.outputResponse,
        this.eventType,
        this.number,
        this.channel,
        this.value,
        this.knobType,
        this.valueType,
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
    let response;
    if (this.outputResponse === 'constant') {
      response = this.handleAsConstant(msg);
    } else {
      response = MidiArray.create(
        this.nextEventType(),
        this.channel,
        this.number,
        this.#nextValue(msg)
      );
    }

    return response;
  }

  #nextValue = (msg: MidiArray) => {
    let val = msg[2];
    if (this.knobType === 'endless' && this.valueType === 'absolute') {
      this.value =
        msg[2] < 64
          ? (Math.min(127, msg[2] + this.value) as MidiNumber)
          : (Math.max(0, this.value - (128 - msg[2])) as MidiNumber);
      val = this.value;
    }

    this.value = val;

    return val;
  };
}
