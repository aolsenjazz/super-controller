import { StatelessPropagator } from '@shared/propagators/stateless-propagator';

class Wrapper extends StatelessPropagator<
  'continuous' | 'toggle',
  'continuous'
> {}

function createPropagator(
  ir: 'continuous' | 'toggle',
  or: 'continuous',
  statusString: StatusString = 'controlchange',
  number: MidiNumber = 0,
  channel: Channel = 0,
  value?: MidiNumber
) {
  return new Wrapper(ir, or, statusString, number, channel, value);
}

interface NamedCreateCC {
  value: MidiNumber;
  number: MidiNumber;
  channel: Channel;
}
function createCC({
  value = 0,
  number = 0,
  channel = 0,
}: NamedCreateCC): NumberArrayWithStatus {
  return [176 | channel, number, value] as NumberArrayWithStatus; // 176 is the base for 'controlchange' messages
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

  const result = propagator.handleMessage(msg1)! as NumberArrayWithStatus;

  expect(propagator.statusString).toEqual(status);
  expect(result[1]).toEqual(number); // number is at index 1
  expect(result[0] & 0x0f).toEqual(channel); // channel is part of status byte (lower nibble of result[0])
  expect(result[2]).toEqual(msg1[2]); // value is at index 2

  const newNumber = 33;
  const newChannel = 3;
  const newStatus = 'noteon';

  propagator.number = newNumber;
  propagator.channel = newChannel;
  propagator.statusString = newStatus;

  const result2 = propagator.handleMessage(msg2)! as NumberArrayWithStatus;

  expect(propagator.statusString).toEqual(newStatus);
  expect(result2[1]).toEqual(newNumber); // new number at index 1
  expect(result2[0] & 0x0f).toEqual(newChannel); // new channel in the status byte
  expect(result2[2]).toEqual(msg2[2]); // value is at index 2
});
