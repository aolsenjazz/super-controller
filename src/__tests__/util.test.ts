import { MidiArray } from '@shared/midi-array';
import { inputIdFor, getDiff } from '@shared/util';

test('getDiff returns no PortPairs if same list', () => {
  const ids = ['1', '2', '3'];
  const result = getDiff(ids, ids);

  expect(result[0].length).toBe(0);
});

test('getDiff returns 1 pair at first index', () => {
  const ids1 = ['1', '2'];
  const ids2 = ['1'];

  const result = getDiff(ids1, ids2);

  expect(result[0].length).toBe(1);
});

test('getDiff returns 1 pair at second index', () => {
  const ids1 = ['1'];
  const ids2 = ['1', '2'];

  const result = getDiff(ids1, ids2);

  expect(result[1].length).toBe(1);
});

test('inputIdFor correctly modifies eventType for noteon', () => {
  const number = 60;
  const channel = 5;
  const eventType = 'noteon';

  const correct = 'noteon/noteoff.5.60';

  expect(inputIdFor(eventType, channel, number)).toBe(correct);
});

test('inputIdFor correctly modifies eventType for noteoff', () => {
  const number = 60;
  const channel = 5;
  const eventType = 'noteoff';

  const correct = 'noteon/noteoff.5.60';

  expect(inputIdFor(eventType, channel, number)).toBe(correct);
});

test('inputIdFor throws when number omitted, non-pitchbend', () => {
  const channel = 5;
  const eventType = 'controlchange';

  expect(() => {
    inputIdFor(eventType, channel);
  }).toThrow();
});

test('inputIdFor throw when channel omitted, pitchbend', () => {
  const eventType = 'pitchbend';

  expect(() => {
    inputIdFor(eventType);
  }).toThrow();
});

test('inputIdFor throw when channel omitted, non-pitchbend', () => {
  const eventType = 'noteon';

  expect(() => {
    inputIdFor(eventType);
  }).toThrow();
});

test('inputIdFor returns correct pitchbend id', () => {
  const channel = 5;
  const eventType = 'pitchbend';

  const correct = 'pitchbend.5';

  expect(inputIdFor(eventType, channel)).toBe(correct);
});

test('inputIdFor returns correct for mm pitchbend event', () => {
  const number = 127;
  const value = 127;
  const channel = 5;
  const eventType = 'pitchbend';

  const mm = MidiArray.create(eventType, channel, number, value);
  const correct = 'pitchbend.5';

  expect(inputIdFor(mm)).toBe(correct);
});

test('inputIdFor returns correct for mm non-pitchbend event', () => {
  const number = 127;
  const value = 127;
  const channel = 5;
  const eventType = 'noteon';

  const mm = MidiArray.create(eventType, channel, number, value);
  const correct = 'noteon/noteoff.5.127';

  expect(inputIdFor(mm)).toBe(correct);
});

test('inputIdFor returns correct for pitchbend array', () => {
  const mm = MidiArray.create(224, 10, 0, 60);
  const correct = 'pitchbend.10';

  expect(inputIdFor(mm as MidiArray)).toBe(correct);
});

test('inputIdFor returns correct for non-pitchbend array', () => {
  const mm = MidiArray.create(176, 10, 1, 60);
  const correct = 'controlchange.10.1';

  expect(inputIdFor(mm)).toBe(correct);
});
