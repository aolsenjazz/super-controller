import { Port } from '../main/ports/port';
import { PortPair } from '../main/ports/port-pair';

import { getDiff } from '../main/util-main';

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

test('getDiff treats "SC APC" === "APC" when stripPrefix === true', () => {
  const pairs1 = [makePortPair(0, 'APC')];
  const pairs2 = [makePortPair(0, 'SC APC')];
  const result = getDiff(pairs1, pairs2, true);

  expect(result[0].length).toBe(0);
});

test('getDiff treats "SC APC" !== "APC" when !stripPrefix', () => {
  const pairs1 = [makePortPair(0, 'APC')];
  const pairs2 = [makePortPair(0, 'SC APC')];
  const result = getDiff(pairs1, pairs2, false);

  expect(result[0].length).toBe(1);
});

test('getDiff returns no PortPairs if same list', () => {
  const pairs = [...Array(10)].map((_v, i) => makePortPair(i, 'FakePort'));
  const result = getDiff(pairs, pairs, false);

  expect(result[0].length).toBe(0);
});

test('getDiff returns 1 pair', () => {
  const pairs1 = [...Array(2)].map((_v, i) => makePortPair(i, 'Fake'));
  const pairs2 = [...Array(3)].map((_v, i) => makePortPair(i, 'Fake'));

  const result = getDiff(pairs2, pairs1, false);

  expect(result[0].length).toBe(1);
});
