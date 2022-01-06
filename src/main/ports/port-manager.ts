import midi from 'midi';

import { Port } from './port';
import { PortPair } from './port-pair';

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
      port.occurrenceNumber === candidate.occurrenceNumber
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
  portMap: Map<string, PortPair>
) {
  portList.forEach((port: Port) => {
    const sister = getSister(port, sisterList);
    const first = port.type === 'input' ? port : sister;
    const second = port.type === 'input' ? sister : port;
    const pair = new PortPair(first, second);
    portMap.set(pair.id, pair);
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
    // Gross safeguard. When closing virtual ports, the port disappears tho getPortCount still reports 1.
    // getPortName returns ''. Just ignore it when in this state
    // eslint-disable-next-line no-continue
    if (!name) continue;
    const nameOccurences = addedNames.filter((val) => val === name).length;
    ports.push(new Port(i, nameOccurences, type, name));
    addedNames.push(name);
  }
  return ports;
}

export function all() {
  const iPorts = parsePorts(INPUT, 'input');
  const oPorts = parsePorts(OUTPUT, 'output');
  const portMap = new Map<string, PortPair>();
  createPairsAndAddToDevices(iPorts, oPorts, portMap);
  createPairsAndAddToDevices(oPorts, iPorts, portMap);
  return Array.from(portMap.values());
}
