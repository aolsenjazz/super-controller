/* eslint-disable no-bitwise */

import { DefaultPreservedMidiArray } from '@shared/default-preserved-midi-array';

test('defaults are preserved in arr.default', () => {
  const arr: [StatusNumber, MidiNumber, MidiNumber] = [129, 2, 3]; // note off & channel=1 & number=1 & value=1
  const ma = new DefaultPreservedMidiArray(arr);

  ma.status = 144;
  ma.channel = 4;
  ma.number = 5;
  ma.value = 6;

  const def = ma.default;

  expect(def.status).toEqual(arr[0] & 0xf0);
  expect(def.channel).toEqual(arr[0] & 0x0f);
  expect(def.number).toEqual(arr[1]);
  expect(def.value).toEqual(arr[2]);

  expect(ma.status).toEqual(144);
  expect(ma.channel).toEqual(4);
  expect(ma.number).toEqual(5);
  expect(ma.value).toEqual(6);
});
