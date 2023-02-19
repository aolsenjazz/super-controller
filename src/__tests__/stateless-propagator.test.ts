import { ThreeByteMidiArray } from '@shared/midi-array';
import { StatelessPropagator } from '@shared/propagators/stateless-propagator';
import { CorrelatedResponse } from '@shared/propagators/propagator';

class Wrapper extends StatelessPropagator {}

function createPropagator(
  ir: 'continuous' | 'toggle',
  or: CorrelatedResponse<typeof ir>,
  eventType: StatusString = 'controlchange',
  number: MidiNumber = 0,
  channel: Channel = 0,
  value?: MidiNumber
) {
  return new Wrapper(ir, or, eventType, number, channel, value);
}

interface NamedCreateCC {
  value: MidiNumber;
  number: MidiNumber;
  channel: Channel;
}
function createCC({ value = 0, number = 0, channel = 0 }: NamedCreateCC) {
  return ThreeByteMidiArray.create('controlchange', channel, number, value);
}

test('or=continuous applied overrides correctly', () => {
  const number = 32;
  const channel = 2;
  const status = 'controlchange';

  const msg1 = createCC({ value: 60, number: 90, channel: 7 });
  const msg2 = createCC({ value: 70, number: 90, channel: 7 });
  const propagator = createPropagator(
    'continuous',
    'continuous',
    status,
    number,
    channel,
    69
  );

  const result = propagator.handleMessage(msg1)! as ThreeByteMidiArray;

  expect(result.statusString).toEqual(status);
  expect(result.number).toEqual(number);
  expect(result.channel).toEqual(channel);
  expect(result.value).toEqual(msg1.value);

  const newNumber = 33;
  const newChannel = 3;
  const newStatus = 'noteon';

  propagator.number = newNumber;
  propagator.channel = newChannel;
  propagator.eventType = newStatus;

  const result2 = propagator.handleMessage(msg2)! as ThreeByteMidiArray;

  expect(result2.statusString).toEqual(newStatus);
  expect(result2.number).toEqual(newNumber);
  expect(result2.channel).toEqual(newChannel);
  expect(result2.value).toEqual(msg2.value);
});
