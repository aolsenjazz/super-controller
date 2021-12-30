/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect, jest } from '@jest/globals';
import { Port, PortPair } from '@alexanderolsen/port-manager';

import {
  testables,
  VirtualPortService,
} from '../main/ports/virtual-port-service';

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

test('onHardwarePortsChange removes 1 port', () => {
  const numPorts = 3;
  const pairs = [...Array(numPorts)].map((_v, i) => makePortPair(i, 'Fake'));
  const service = new VirtualPortService();

  // add all ports
  pairs.forEach((pp) => service.open(pp.name, pp.occurrenceNumber));

  // get rid of a port
  pairs.splice(0, 1);

  // tell the service that avail ports have changed
  service.closeOldPorts(pairs);

  expect(service.virtualPorts.length).toBe(numPorts - 1);

  service.shutdown();
});

test('removing a VPortPair calls close()', () => {
  const pair1 = makePortPair(0, 'Device1');
  const pairs2 = [makePortPair(1, 'Device1')]; // yes, same port name
  const service = new VirtualPortService();

  service.open(pair1.name, pair1.occurrenceNumber);
  const spy = jest.spyOn(service.virtualPorts[0], 'close');
  service.closeOldPorts(pairs2);

  expect(spy).toHaveBeenCalledTimes(1);

  service.shutdown();
});

test('ports is neither open nor closed when unaffected', () => {
  const pairs = [makePortPair(0, 'Device1')];
  const service = new VirtualPortService();

  service.open(pairs[0].name, pairs[0].occurrenceNumber);
  const closeSpy = jest.spyOn(service.virtualPorts[0], 'close');
  service.closeOldPorts(pairs);

  expect(closeSpy).toHaveBeenCalledTimes(0);

  service.shutdown();
});

test('getVirtualEquivalent throws when "SC " included', () => {
  const pair = makePortPair(0, 'Device1');
  const service = new VirtualPortService();
  service.open(pair.name, pair.occurrenceNumber);

  const getVirtualEquivalent = service.testables.get('getVirtualEquivalent');

  expect(() => {
    getVirtualEquivalent!('SC Device1');
  }).toThrow();
  service.shutdown();
});

test('getVirtualEquivalent returns correct portPair', () => {
  const pair = makePortPair(0, 'Device1');
  const service = new VirtualPortService();
  service.open(pair.name, pair.occurrenceNumber);

  const getVirtualEquivalent = service.testables.get('getVirtualEquivalent');

  const result = getVirtualEquivalent!('Device1 0');

  expect(result?.id).toBe('SC Device1 0');
  service.shutdown();
});
