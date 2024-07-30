import { InputResponse } from '@shared/driver-types';
import { MonoInputConfig as IC } from '@shared/hardware-config/input-config';
import { GatePropagator } from '@shared/propagators';
import { create } from '@shared/midi-array';

const D = {
  response: 'gate' as const,
  statusString: 'noteon/noteoff' as const,
  channel: 2 as Channel,
  number: 5 as MidiNumber,
};

const PROP = new GatePropagator('gate', D.statusString, D.number, D.channel);

class InputConfig extends IC {
  get eligibleResponses() {
    return [] as InputResponse[];
  }

  get eligibleStatusStrings() {
    return [] as StatusString[];
  }

  get response() {
    return 'gate';
  }

  set response(r: InputResponse) {
    this.outputPropagator.outputResponse = r;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.defaults, this.outputPropagator, this.nickname],
    };
  }

  get config() {
    return {
      type: 'pad' as const,
      id: this.id,
    };
  }

  get state() {
    return {};
  }
}

describe('handleMessage', () => {
  test('invokes outputProp.handleMessage', () => {
    const ic = new InputConfig(D, PROP);
    const spy = jest.spyOn(ic.outputPropagator, 'handleMessage');
    ic.handleMessage(create([144, 0, 0]));
    expect(spy).toHaveBeenCalled();
  });
});

describe('id', () => {
  test('returns correct id', () => {
    const ic = new InputConfig(D, PROP);
    const id = `noteon/noteoff.2.5`;
    expect(ic.id).toBe(id);
  });
});
