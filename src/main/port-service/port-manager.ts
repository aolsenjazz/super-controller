import midi from '@julusian/midi';

import { getDriver } from '@shared/drivers';

import { Port } from './port';
import { PortPair } from './port-pair';
import { DrivenPortPair } from './driven-port-pair';

const INPUT = new midi.Input();
const OUTPUT = new midi.Output();

/**
 * Retrieves the sister port from the given list of possible sister candidates. A port is considered
 * a sister port if both the port names and occurrences match.
 */
function getSister(port: Port, sisterList: Port[]): Port | null {
  let sister = null;
  sisterList.forEach((candidate) => {
    if (
      port.name === candidate.name &&
      port.siblingIndex === candidate.siblingIndex
    ) {
      sister = candidate;
    }
  });
  return sister;
}

/**
 * Pairs each `Port` in `portList` with its sister port in `sisterList` and adds
 * the pair to portMap
 */
function createPairsAndAddToDevices(
  portList: Port[],
  sisterList: Port[],
  portMap: Map<string, DrivenPortPair>
) {
  portList.forEach((port: Port) => {
    const sister = getSister(port, sisterList);
    const first = port.type === 'input' ? port : sister;
    const second = port.type === 'input' ? sister : port;

    const pair = new PortPair(first, second);
    const driver = getDriver(pair.name);
    const driven = new DrivenPortPair(pair, driver);

    portMap.set(pair.id, driven);
  });
}

function parsePorts(
  parent: midi.Input | midi.Output,
  type: 'input' | 'output'
) {
  const ports = [];
  const addedNames = [];
  for (let i = 0; i < parent.getPortCount(); i++) {
    const name = parent.getPortName(i);
    const nameOccurences = addedNames.filter((val) => val === name).length;
    ports.push(new Port(i, nameOccurences, type, name));
    addedNames.push(name);
  }
  return ports;
}

export function all(omitSCPorts = true) {
  const iPorts = parsePorts(INPUT, 'input');
  const oPorts = parsePorts(OUTPUT, 'output');
  const portMap = new Map<string, DrivenPortPair>();
  createPairsAndAddToDevices(iPorts, oPorts, portMap);
  createPairsAndAddToDevices(oPorts, iPorts, portMap);

  if (omitSCPorts) {
    portMap.forEach((_value, key, map) => {
      if (key.startsWith('SC ') || key.startsWith('RtMidi ')) map.delete(key);
    });
  }

  return portMap;
}
