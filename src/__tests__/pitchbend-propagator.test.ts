import { MidiArray } from '@shared/midi-array';
import { PitchbendPropagator } from '@shared/propagators/pitchbend-propagator';

function createPropagator(
  or: 'continuous' | 'constant',
  eventType: StatusString = 'pitchbend',
  number: MidiNumber = 0,
  channel: Channel = 0
) {
  return new PitchbendPropagator(or, eventType, number, channel);
}

interface NamedCreateCC {
  value: MidiNumber;
  number: MidiNumber;
  channel: Channel;
}
function create({ value = 0, number = 0, channel = 0 }: NamedCreateCC) {
  return MidiArray.create('pitchbend', channel, number, value);
}

test('propagates values correctly', () => {
  const number = 32;
  const channel = 2;
  const status = 'pitchbend';

  const propagator = createPropagator('continuous', status, number, channel);

  const msg1 = create({ value: 60, number: 0, channel: 7 });
  const msg2 = create({ value: 127, number: 127, channel: 7 });

  const result = propagator.handleMessage(msg1)!;

  expect(result.statusString).toEqual(status);
  expect(result.number).toEqual(0);
  expect(result.channel).toEqual(channel);
  expect(result.value).toEqual(msg1.value);

  const newChannel = 3;

  propagator.channel = newChannel;

  const result2 = propagator.handleMessage(msg2)!;

  expect(result2.channel).toEqual(newChannel);
  expect(result2.number).toEqual(msg2.number);
  expect(result2.value).toEqual(msg2.value);
});
