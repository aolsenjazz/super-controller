/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';

import { InputDriver, InputGridDriver } from '@shared/driver-types';

import { VirtualInput } from '../renderer/virtual-devices';

function MakeInputGridDriver(): InputGridDriver['inputDefaults'] {
  return {
    channel: 7 as Channel,
    eventType: 'noteon/noteoff' as StatusString | 'noteon/noteoff',
    response: 'toggle' as 'toggle' | 'gate',
    width: 1,
    height: 1,
    shape: 'rect' as 'rect' | 'circle',
    type: 'pad' as 'pad' | 'knob',
    availableColors: [],
    overrideable: true,
  };
}

function BasicInputDriver(): InputDriver {
  return {
    number: 69,
  };
}

test('input.id returns correct ID', () => {
  const igDriver = MakeInputGridDriver();
  const driver = BasicInputDriver();

  const input = new VirtualInput(driver, igDriver);

  const result = input.id;
  const correct = `${igDriver.eventType}.${igDriver.channel}.${driver.number}`;

  expect(result).toBe(correct);
});

test('pad is overrideable', () => {
  const igDriver = MakeInputGridDriver();
  const driver = BasicInputDriver();

  const input = new VirtualInput(driver, igDriver);
  const result = input.overrideable;

  expect(result).toBe(true);
});

test('pad is not overrideable', () => {
  const igDriver = MakeInputGridDriver();
  const driver = BasicInputDriver();
  const newDriver = {
    ...driver,
  };
  newDriver.overrideable = false;

  const input = new VirtualInput(newDriver, igDriver);
  const result = input.overrideable;

  expect(result).toBe(false);
});

test('fromDriver correctly assembles VirtualInput', () => {
  const igDriver = MakeInputGridDriver();
  const driver = BasicInputDriver();

  const result = new VirtualInput(driver, igDriver);
  expect(result.shape).toBe(igDriver.shape);
  expect(result.type).toBe(igDriver.type);
  expect(result.id).toBe(
    `${igDriver.eventType}.${igDriver.channel}.${driver.number}`
  );
});

test('isPitchbend returns true', () => {
  const igDriver = MakeInputGridDriver();
  const driver = BasicInputDriver();
  const newDriver = { ...driver };
  newDriver.eventType = 'pitchbend';

  const result = new VirtualInput(newDriver, igDriver);
  expect(result.isPitchbend).toBe(true);
});
