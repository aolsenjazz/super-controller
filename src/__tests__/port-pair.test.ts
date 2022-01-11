/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

test('open() calls open on child ports', () => {
  const pair = makePortPair(0, 'test');
  const iPortSpy = jest.spyOn(pair.iPort!, 'open');
  const oPortSpy = jest.spyOn(pair.oPort!, 'open');
  pair.open();
  expect(iPortSpy).toHaveBeenCalled();
  expect(oPortSpy).toHaveBeenCalled();
});

test('close() calls close on child ports', () => {
  const pair = makePortPair(0, 'test');
  const iPortSpy = jest.spyOn(pair.iPort!, 'close');
  const oPortSpy = jest.spyOn(pair.oPort!, 'close');
  pair.close();
  expect(iPortSpy).toHaveBeenCalled();
  expect(oPortSpy).toHaveBeenCalled();
});

test('send() invokes oPort.send', () => {
  const pair = makePortPair(0, 'test');
  const spy = jest.spyOn(pair.oPort!, 'send');
  pair.send([0, 0, 0]);
  expect(spy).toHaveBeenCalled();
});

test('isPortOpen() returns true', () => {
  const pair = makePortPair(0, 'test');
  expect(pair.isPortOpen()).toBe(true);
});

test('name getter returns port name', () => {
  const name = 'yo';
  const pair = makePortPair(0, name);
  expect(pair.name).toBe(name);
});

test('siblingIndex returns correct index', () => {
  const siblingIndex = 76;
  const name = 'yo';
  const pair = makePortPair(siblingIndex, name);
  expect(pair.siblingIndex).toBe(siblingIndex);
});

test('id returns correct id', () => {
  const siblingIndex = 76;
  const name = 'yo';
  const pair = makePortPair(siblingIndex, name);
  expect(pair.id).toBe(`${name} ${siblingIndex}`);
});
