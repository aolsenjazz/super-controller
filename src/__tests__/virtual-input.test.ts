import { test, expect } from '@jest/globals';

import { VirtualInput } from '../virtual-devices';
import { InputDriver } from '../driver-types';

test('input.id returns correct ID', () => {
  const eventType = 'noteon/noteoff';
  const channel = 0;
  const number = 0;
  const shape = 'rect';
  const type = 'pad';
  const overrideable = true;

  const input = new VirtualInput(
    1,
    1,
    eventType,
    channel,
    number,
    shape,
    type,
    overrideable
  );
  const result = input.id;
  const correct = `${eventType}.${channel}.${number}`;

  expect(result).toBe(correct);
});

test('pad is overrideable', () => {
  const eventType = 'noteon/noteoff';
  const channel = 0;
  const number = 0;
  const shape = 'rect';
  const type = 'pad';
  const overrideable = true;

  const input = new VirtualInput(
    1,
    1,
    eventType,
    channel,
    number,
    shape,
    type,
    overrideable
  );
  const result = input.overrideable;

  expect(result).toBe(true);
});

test('pad is not overrideable', () => {
  const eventType = 'octup';
  const channel = 0;
  const number = 0;
  const shape = 'rect';
  const type = 'pad';
  const overrideable = false;

  const input = new VirtualInput(
    1,
    1,
    eventType,
    channel,
    number,
    shape,
    type,
    overrideable
  );
  const result = input.overrideable;

  expect(result).toBe(false);
});

test('fromDriver correctly assembles VirtualInput', () => {
  const driverLike: InputDriver = {
    default: {
      number: 69,
      channel: 7,
      eventType: 'controlchange',
      response: 'toggle',
    },
    width: 1,
    height: 1,
    shape: 'rect',
    type: 'pad',
    availableColors: [],
    overrideable: true,
  };

  const result = VirtualInput.fromDriver(driverLike);
  expect(result.shape).toBe(driverLike.shape);
  expect(result.type).toBe(driverLike.type);
  expect(result.id).toBe(
    `${driverLike.default.eventType}.${driverLike.default.channel}.${driverLike.default.number}`
  );
});
