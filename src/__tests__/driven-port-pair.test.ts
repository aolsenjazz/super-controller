/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DrivenPortPair } from '../main/port-service/driven-port-pair';
import { DRIVERS } from '../main/drivers';
import { Port } from '../main/port-service/port';
import { PortPair } from '../main/port-service/port-pair';

class MockPort implements Port {
  index: number;

  siblingIndex: number;

  type: 'input' | 'output';

  name: string;

  /* eslint-disable-next-line */
  port: any;

  open() {}

  close() {}

  /* eslint-disable-next-line */
  send(_msg: number[]) {}

  onMessage() {}

  isPortOpen() {
    return true;
  }

  constructor(index: number, name: string, type: 'input' | 'output') {
    this.index = index;
    this.siblingIndex = index;
    this.name = name;
    this.type = type;
  }
}

function makePortPair(index: number, name: string) {
  const iPort = new MockPort(index, name, 'input');
  const oPort = new MockPort(index, name, 'output');
  return new PortPair(iPort, oPort);
}

test('resetLights does nothing for devices without lights', () => {
  const portPair = makePortPair(0, 'iRig BlueBoard');
  const driver = DRIVERS.get(portPair.name);
  const dPortPair = new DrivenPortPair(portPair, driver!);
  const spy = jest.spyOn(dPortPair.testables.get('pair'), 'send');

  dPortPair.resetLights();

  expect(spy).toHaveBeenCalledTimes(0);
});

test('resetLights tries to reset all lights with defaults set', () => {
  const portPair = makePortPair(0, 'APC Key 25');
  const driver = DRIVERS.get(portPair.name);
  const dPortPair = new DrivenPortPair(portPair, driver!);
  const spy = jest.spyOn(dPortPair.testables.get('pair'), 'send');

  dPortPair.resetLights();

  expect(spy).toHaveBeenCalled();
});

test('runControlSequence does nothing for devices w/o ctrl sequences', () => {
  const portPair = makePortPair(0, 'APC Key 25');
  const driver = DRIVERS.get(portPair.name);
  const dPortPair = new DrivenPortPair(portPair, driver!);
  const spy = jest.spyOn(dPortPair.testables.get('pair'), 'send');

  dPortPair.runControlSequence();

  expect(spy).toHaveBeenCalledTimes(0);
});

test('runControlSequence sends messages to its device', () => {
  const portPair = makePortPair(0, 'Launchkey Mini LK Mini InControl');
  const driver = DRIVERS.get(portPair.name);
  const dPortPair = new DrivenPortPair(portPair, driver!);
  const spy = jest.spyOn(dPortPair.testables.get('pair'), 'send');

  dPortPair.runControlSequence();

  expect(spy).toHaveBeenCalled();
});
