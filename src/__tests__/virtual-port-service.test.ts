import { test, expect, jest } from '@jest/globals';
import { Port, PortPair } from '@alexanderolsen/port-manager';

import { testables, VirtualPortService } from '../ports/virtual-port-service';

const { getDiff } = testables;

class MockPort implements Port {
  index: number;

  occurrenceNumber: number;

  type: string;

  name: string;

  /* eslint-disable-next-line */
  port: any;

  open() {}

  close() {}

  /* eslint-disable-next-line */
  send(_msg: number[]) {}

  onMessage() {}

  constructor(index: number, name: string, type: 'input' | 'output') {
    this.index = index;
    this.occurrenceNumber = index;
    this.name = name;
    this.type = type;
  }
}

function makePortPair(index: number, name: string) {
  const iPort = new MockPort(index, name, 'input');
  const oPort = new MockPort(index, name, 'output');
  return new PortPair(iPort, oPort);
}

test('getDiff treats "SC APC" === "APC" when stripPrefix === true', () => {
  const pairs1 = [makePortPair(0, 'APC')];
  const pairs2 = [makePortPair(0, 'SC APC')];
  const result = getDiff(pairs1, pairs2, true);

  expect(result.length).toBe(0);
});

test('getDiff treats "SC APC" !== "APC" when !stripPrefix', () => {
  const pairs1 = [makePortPair(0, 'APC')];
  const pairs2 = [makePortPair(0, 'SC APC')];
  const result = getDiff(pairs1, pairs2, false);

  expect(result.length).toBe(1);
});

test('getDiff returns no PortPairs if same list', () => {
  const pairs = [...Array(10)].map((_v, i) => makePortPair(i, 'FakePort'));
  const result = getDiff(pairs, pairs, false);

  expect(result.length).toBe(0);
});

test('getDiff returns 1 pair', () => {
  const pairs1 = [...Array(2)].map((_v, i) => makePortPair(i, 'Fake'));
  const pairs2 = [...Array(3)].map((_v, i) => makePortPair(i, 'Fake'));

  const result = getDiff(pairs2, pairs1, false);

  expect(result.length).toBe(1);
});

test('onHardwarePortsChange adds all to new port list', () => {
  const numPorts = 3;
  const pairs = [...Array(numPorts)].map((_v, i) => makePortPair(i, 'Fake'));
  const service = new VirtualPortService();

  service.onHardwarePortsChange(pairs);

  expect(service.virtualPorts.length).toBe(numPorts);

  service.shutdown();
});

test('onHardwarePortsChange removes 1 port', () => {
  const numPorts = 3;
  const pairs = [...Array(numPorts)].map((_v, i) => makePortPair(i, 'Fake'));
  const service = new VirtualPortService();

  // add all ports
  service.onHardwarePortsChange(pairs);

  // get rid of a port
  pairs.splice(0, 1);

  // tell the service that avail ports have changed
  service.onHardwarePortsChange(pairs);

  expect(service.virtualPorts.length).toBe(numPorts - 1);

  service.shutdown();
});

test('onHardwarePortsChange adds 1 port', () => {
  const numPorts = 3;
  const pairs = [...Array(numPorts)].map((_v, i) => makePortPair(i, 'Fake'));
  const service = new VirtualPortService();

  // add all ports
  service.onHardwarePortsChange(pairs);

  // get rid of a port
  pairs.push(makePortPair(5, 'Fake'));

  // tell the service that avail ports have changed
  service.onHardwarePortsChange(pairs);

  expect(service.virtualPorts.length).toBe(numPorts + 1);

  service.shutdown();
});

test('onHardwarePortsChange removes and adds 1 port', () => {
  const pairs1 = [makePortPair(0, 'Device1')];
  const pairs2 = [makePortPair(1, 'Device1')]; // yes, same port name
  const service = new VirtualPortService();

  service.onHardwarePortsChange(pairs1);
  service.onHardwarePortsChange(pairs2);

  expect(service.virtualPorts.length).toBe(1);
  expect(service.virtualPorts[0].occurrenceNumber).toBe(1);

  service.shutdown();
});

test('removing a VPortPair calls close()', () => {
  const pairs1 = [makePortPair(0, 'Device1')];
  const pairs2 = [makePortPair(1, 'Device1')]; // yes, same port name
  const service = new VirtualPortService();

  service.onHardwarePortsChange(pairs1);
  const spy = jest.spyOn(service.virtualPorts[0], 'close');
  service.onHardwarePortsChange(pairs2);

  expect(spy).toHaveBeenCalledTimes(1);

  service.shutdown();
});

test('ports is neither open nor closed when unaffected', () => {
  const pairs = [makePortPair(0, 'Device1')];
  const service = new VirtualPortService();

  service.onHardwarePortsChange(pairs);
  const closeSpy = jest.spyOn(service.virtualPorts[0], 'close');
  const openSpy = jest.spyOn(service.virtualPorts[0], 'open');
  service.onHardwarePortsChange(pairs);

  expect(closeSpy).toHaveBeenCalledTimes(0);
  expect(openSpy).toHaveBeenCalledTimes(0);

  service.shutdown();
});

test('getVirtualEquivalent throws when "SC " included', () => {
  const pairs = [makePortPair(0, 'Device1')];
  const service = new VirtualPortService();
  service.onHardwarePortsChange(pairs);

  expect(() => {
    service.getVirtualEquivalent('SC Device1');
  }).toThrow();
  service.shutdown();
});

test('getVirtualEquivalent returns correct portPair', () => {
  const pairs = [makePortPair(0, 'Device1')];
  const service = new VirtualPortService();
  service.onHardwarePortsChange(pairs);

  const result = service.getVirtualEquivalent('Device1 0');
  expect(result.id).toBe('SC Device1 0');
  service.shutdown();
});
