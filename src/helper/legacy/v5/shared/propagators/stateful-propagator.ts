import { InputResponse } from '../driver-types';
import { OverrideablePropagator } from './overrideable-propagator';

type State = 'on' | 'off';

export abstract class StatefulPropagator<
  T extends InputResponse,
  U extends InputResponse,
> extends OverrideablePropagator<T, U> {
  state: State = 'off';

  constructor(
    hr: T,
    or: U,
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber,
    s?: State,
  ) {
    super(hr, or, et, n, c, v);

    this.state = s || this.state;
  }

  protected nextEventType() {
    if (this.statusString === 'noteon/noteoff') {
      return this.state === 'on' ? 'noteoff' : 'noteon';
    }

    return this.statusString;
  }
}
