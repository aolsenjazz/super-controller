import { MidiArray, create } from '../midi-array';
import { StatelessPropagator } from './stateless-propagator';

export class ContinuousPropagator extends StatelessPropagator<
  'continuous',
  'continuous' | 'constant'
> {
  valueType: 'endless' | 'absolute' = 'absolute';

  knobType: 'endless' | 'absolute' = 'absolute';

  constructor(
    or: 'continuous' | 'constant',
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber,
    knobType?: 'endless' | 'absolute',
    valueType?: 'endless' | 'absolute'
  ) {
    super('continuous', or, et, n, c, v);

    this.knobType = knobType || this.knobType;
    this.valueType = valueType || knobType || this.valueType;
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
      response = create(
        this.nextEventType(),
        this.channel,
        this.number,
        this.nextValue(msg)
      );
    }

    return response;
  }

  protected nextValue = (msg: MidiArray) => {
    let val = msg[2] as MidiNumber;
    if (this.knobType === 'endless' && this.valueType === 'absolute') {
      const shift = (val - 64 * Math.round(val / 64)) as MidiNumber;
      val = Math.min(127, Math.max(this.value + shift, 0)) as MidiNumber;
    }

    this.value = val;

    return val;
  };
}
