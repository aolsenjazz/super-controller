/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';

import { VirtualInput } from '../renderer/virtual-devices';

function BasicInputDriver() {
  return {
    default: {
      number: 69,
      channel: 7 as Channel,
      eventType: 'noteon/noteoff' as StatusString | 'noteon/noteoff',
      response: 'toggle' as 'toggle' | 'gate',
    },
    width: 1,
    height: 1,
    shape: 'rect' as 'rect' | 'circle',
    type: 'pad' as 'pad' | 'knob',
    availableColors: [],
    overrideable: true,
  };
}

test('input.id returns correct ID', () => {
  const driver = BasicInputDriver();

  const input = new VirtualInput(driver);

  const result = input.id;
  const correct = `${driver.default.eventType}.${driver.default.channel}.${driver.default.number}`;

  expect(result).toBe(correct);
});

test('pad is overrideable', () => {
  const driver = BasicInputDriver();

  const input = new VirtualInput(driver);
  const result = input.overrideable;

  expect(result).toBe(true);
});

test('pad is not overrideable', () => {
  const driver = BasicInputDriver();
  driver.overrideable = false;

  const input = new VirtualInput(driver);
  const result = input.overrideable;

  expect(result).toBe(false);
});

test('fromDriver correctly assembles VirtualInput', () => {
  const driver = BasicInputDriver();

  const result = new VirtualInput(driver);
  expect(result.shape).toBe(driver.shape);
  expect(result.type).toBe(driver.type);
  expect(result.id).toBe(
    `${driver.default.eventType}.${driver.default.channel}.${driver.default.number}`
  );
});

test('isPitchbend returns true', () => {
  const driver = BasicInputDriver();
  driver.default.eventType = 'pitchbend';

  const result = new VirtualInput(driver);
  expect(result.isPitchbend).toBe(true);
});
