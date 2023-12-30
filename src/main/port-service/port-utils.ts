import { Input, Output } from '@julusian/midi';
import { PortInfo } from '@shared/port-info';

import { PortInfoPair } from './port-info-pair';

const INPUT = new Input();
const OUTPUT = new Output();

/**
 * Retrieves the sister port from the given list of possible sister candidates. A port is considered
 * a sister port if both the port names and occurrences match. Most midi devices will have both an
 * input and output port, so for a given input, there usually exists one (output) sister.
 */
function getSister(port: PortInfo, sisterList: PortInfo[]): PortInfo | null {
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
 * Couples each `Port` in `portList` with its sister port in `sisterList` and adds
 * the pair to `portPairList`
 */
function coupleAndAddToList(
  portList: PortInfo[],
  sisterList: PortInfo[],
  portPairList: PortInfoPair[]
) {
  portList.forEach((port: PortInfo) => {
    const sister = getSister(port, sisterList);
    const first = port.type === 'input' ? port : sister;
    const second = port.type === 'input' ? sister : port;

    const pair = new PortInfoPair(first, second);
    const idList = portPairList.map((p) => p.id);

    if (!idList.includes(pair.id)) {
      portPairList.push(pair);
    }
  });
}

/**
 * When two MIDI devices of the same model are connected, there is no system-level
 * disambiguation between the two; they both appear to MIDI clients as 'Midi Control XYZ'.
 * This function disambiguates them by identifying each port's 'sibling index', which is
 * a number representing the n-th occurrence of a given device for a given name
 */
function disambiguatePorts(parent: Input | Output, type: 'input' | 'output') {
  const ports = [];
  const addedNames = [];
  for (let i = 0; i < parent.getPortCount(); i++) {
    const name = parent.getPortName(i);
    const nameOccurences = addedNames.filter((val) => val === name).length;

    ports.push(new PortInfo(i, type, name, nameOccurences));
    addedNames.push(name);
  }
  return ports;
}

/**
 * Returns a list of the currently-available hardware ports
 */
export function readAvailableHardwarePorts(omitSCPorts = true) {
  const iPorts = disambiguatePorts(INPUT, 'input');
  const oPorts = disambiguatePorts(OUTPUT, 'output');

  let portPairList: PortInfoPair[] = [];
  coupleAndAddToList(iPorts, oPorts, portPairList);
  coupleAndAddToList(oPorts, iPorts, portPairList);

  if (omitSCPorts) {
    portPairList = portPairList
      .filter((p) => !p.id.startsWith('SC '))
      .filter((p) => !p.id.startsWith('RtMidi '));
  }

  // frustratingly, when a port is closing, it will sometimes show up in the
  // available ports list with an empty name. trying to take actions on this port
  // will throw an exception, so we manually filter out these cases here
  portPairList = portPairList.filter((p) => p.name !== '');

  return portPairList;
}
