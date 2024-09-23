import { PitchbendPropagator } from '@shared/propagators/pitchbend-propagator';

function createPropagator(
  or: 'continuous' | 'constant',
  statusString: StatusString = 'pitchbend',
  number: MidiNumber = 0,
  channel: Channel = 0
) {
  return new PitchbendPropagator(or, statusString, number, channel);
}

interface NamedCreateCC {
  value: MidiNumber;
  number: MidiNumber;
  channel: Channel;
}
function create({
  value = 0,
  number = 0,
  channel = 0,
}: NamedCreateCC): NumberArrayWithStatus {
  return [224 | channel, number, value] as NumberArrayWithStatus; // 224 is the base for pitchbend status
}

test('propagates values correctly', () => {
  const number = 32;
  const channel = 2;
  const status = 'pitchbend';

  const propagator = createPropagator('continuous', status, number, channel);

  const msg1 = create({ value: 60, number: 0, channel: 7 });
  const msg2 = create({ value: 127, number: 127, channel: 7 });

  const result = propagator.handleMessage(msg1)! as NumberArrayWithStatus;

  expect(propagator.statusString).toEqual(status);
  expect(result[1]).toEqual(0); // number
  expect(result[0] & 0x0f).toEqual(channel); // channel
  expect(result[2]).toEqual(60); // value from msg1

  const newChannel = 3;
  propagator.channel = newChannel;

  const result2 = propagator.handleMessage(msg2)! as NumberArrayWithStatus;

  expect(result2[0] & 0x0f).toEqual(newChannel); // updated channel
  expect(result2[1]).toEqual(127); // number from msg2
  expect(result2[2]).toEqual(127); // value from msg2
});
