import { Input, Output } from '@julisian/midi';

import { PortInfo } from '@shared/port-info';
import { getDiff } from '@shared/util';

import { PortInfoPair } from './port-info-pair';

export type PortScanResult = {
  addedPorts: PortInfoPair[];
  removedPorts: PortInfoPair[];
  currentPorts: PortInfoPair[];
};

type PortChangeListener = (ports: PortScanResult) => void;

const INPUT = new Input();
const OUTPUT = new Output();

/**
 * Retrieves the sister port from the given list of possible sister candidates. A port is considered
 * a sister port if both the port names and occurrences match. Most midi devices will have both an
 * input and output port, so for a given input, there usually exists one (output) sister.
 */
function getSister(
  port: PortInfo,
  sisterList: PortInfo[]
): PortInfo | undefined {
  let sister;
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
function readAvailableHardwarePorts(omitSCPorts = true) {
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

/**
 * Reads available Input and Output ports, couples 'sister' ports, and allows
 * subscribers to receive updated `PortInfoPair` lists when the available
 * hardware changes.
 *
 * 'Sister' ports would be the Input and Output port for a single MIDI device,
 * however, not all MIDI devices provide both an input and output port.
 */
class PortManagerSingleton {
  private static instance: PortManagerSingleton;

  private listeners: PortChangeListener[] = [];

  private ports: PortInfoPair[] = [];

  private constructor() {
    this.pollPorts();
  }

  public static getInstance(): PortManagerSingleton {
    if (!PortManagerSingleton.instance) {
      PortManagerSingleton.instance = new PortManagerSingleton();
    }
    return PortManagerSingleton.instance;
  }

  /**
   * Adds a listener which is invoked when the available hardware ports change. Also invoked
   * immediately with the currently-available ports
   */
  public addListener(listener: PortChangeListener) {
    this.listeners.push(listener);
    listener({ addedPorts: [], removedPorts: [], currentPorts: this.ports });
  }

  public removeListener(listener: PortChangeListener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  /**
   * Begins polling available ports at a regular interval
   */
  private pollPorts(pollInterval = 1000) {
    const freshPorts = readAvailableHardwarePorts(true);

    if (JSON.stringify(freshPorts) !== JSON.stringify(this.ports)) {
      this.updatePorts(freshPorts);
    }

    setTimeout(() => this.pollPorts(), pollInterval);
  }

  /**
   * Invoked whenever the available connectable ports change. Couples sister ports,
   * disambuates siblings, and notifies listener
   *
   * 'Sister' ports would be the Input and Output port for a single MIDI device,
   * however, not all MIDI devices provide both an input and output port.
   *
   * 'Siblings' are relevant when two devices of the same model exist. OSX (and likely
   * other) OS's don't disambiguate between the two devices; they will both appear as
   * DeviceName in the system registry.
   */
  private updatePorts(ports: PortInfoPair[]) {
    const stalePortNames = this.ports.map((p) => p.name);

    const staleSiblingNames = stalePortNames.filter(
      (n) => stalePortNames.filter((n1) => n1 === n).length > 1
    );
    const staleSiblings = this.ports.filter((p) =>
      staleSiblingNames.includes(p.name)
    );
    const newSiblings = ports.filter((p) => staleSiblingNames.includes(p.name));

    let [addedPorts, removedPorts] = getDiff(ports, this.ports, (p) => p.id);
    const removedIds = removedPorts.map((p) => p.id);

    // If in the new list sibling ports exist, all siblings must be reopened
    addedPorts = addedPorts.concat(newSiblings);

    // If in the new list sibling ports exist, all siblings must be closed
    removedPorts = removedPorts.concat(
      staleSiblings.filter((p) => !removedIds.includes(p.id))
    );

    this.ports = ports;

    this.listeners.forEach((listener) => {
      listener({
        addedPorts,
        removedPorts,
        currentPorts: ports,
      });
    });
  }
}

export const PortManager = PortManagerSingleton.getInstance();
