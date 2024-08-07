/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-classes-per-file */

import { InputPort } from '../../main/port-service/input-port';
import { OutputPort } from '../../main/port-service/output-port';

import { PortPair } from '../../main/port-service/port-pair';

jest.mock('@julusian/midi', () => {
  class MockMidiPort {}

  return {
    Output: MockMidiPort,
    Input: MockMidiPort,
  };
});

class MockInput extends InputPort {
  open() {}

  close() {}

  isOpen() {
    return true;
  }

  onMessage(): void {}
}
class MockOutput extends OutputPort {
  open() {}

  close() {}

  isOpen() {
    return true;
  }

  send(): void {}
}

function makePortPair(index: number, name: string) {
  const iPort = new MockInput(index, index, name);
  const oPort = new MockOutput(index, index, name);
  return new PortPair(iPort, oPort);
}

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
