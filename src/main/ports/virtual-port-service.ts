import { PortPair } from '@alexanderolsen/port-manager';
import { MidiValue } from 'midi-message-parser';

import { VirtualInput } from './virtual-input';
import { VirtualOutput } from './virtual-output';

/**
 * Returns a list of `PortPair` which are present in pairs1 and not in pairs2. If `stripPrefix`
 * is set to `true`, removes 'SC ' prefix so that 'SC APC Key' === 'APC Key'
 *
 * @param pairs1 The first list
 * @param pairs2 the second list
 * @param stripPrefix Should the 'SC ' prefix be stripped from SuperController-created virtual ports?
 *
 * @returns List of `PortPair`s which are present in pairs1 and not pairs2
 */
function getDiff(pairs1: PortPair[], pairs2: PortPair[], stripPrefix: boolean) {
  let ids1: string[];
  let ids2: string[];

  if (stripPrefix) {
    ids1 = pairs1.map((pair) => pair.id.replace('SC ', ''));
    ids2 = pairs2.map((pair) => pair.id.replace('SC ', ''));
  } else {
    ids1 = pairs1.map((pair) => pair.id);
    ids2 = pairs2.map((pair) => pair.id);
  }

  const diffIds = ids1.filter((id) => !ids2.includes(id));
  const diffIdxs = diffIds.map((id) => ids1.indexOf(id));

  const diffPairs = diffIdxs.map((idx) => pairs1[idx]);

  return diffPairs;
}

export class VirtualPortService {
  /**
   * Contains one virtual `PortPair` for each hardware `PortPair`. Ports are automatically
   * close and opened once `onHardwarePortsChange` is invoked with a differing list.
   */
  virtualPorts: PortPair[] = [];

  /**
   * Race conditions may easily occur with opening ports because it's an asynchronous process.
   * When a new virtual port is requested, keep track of its name so that other processes
   * don't initiate the opening of the same port.
   */
  openLock: string[] = [];

  /**
   * Expose some interal private methods for testing
   */
  // eslint-disable-next-line
  testables: Map<string, (...args: any[]) => any>;

  constructor() {
    this.testables = new Map();
    this.testables.set('getVirtualEquivalent', this.#getVirtualEquivalent);
  }

  /**
   * Close all virtual ports for which the hardware is no longer connected.
   *
   * @param ports The list of new ports
   * @returns An array of `PortPair`s containing only new ports
   */
  closeOldPorts(ports: PortPair[]) {
    const added = getDiff(ports, this.virtualPorts, true);
    const toBeRemoved = getDiff(this.virtualPorts, ports, true);

    toBeRemoved.forEach((pair) => {
      pair.close();
      this.#removePair(pair.id);
    });

    return added;
  }

  /**
   * Opens the virtual port using the given name and occurrence number
   *
   * @param deviceName The name of the virtual port
   * @param occurrenceNumber The nth-occurrence of the given port. useful if >1 ports are opened with the same name
   */
  open(deviceName: string, occurrenceNumber: number) {
    const name = `SC ${deviceName}`;

    // check if this port is already being opened by another process
    if (this.openLock.includes(name)) {
      // eslint-disable-next-line
      console.warn(`Tried to open duplicate vPort [${name}]. Ignoring...`);
      return;
    }

    // lock this port name
    this.openLock.push(name);

    const iPort = new VirtualInput(occurrenceNumber, name);
    const oPort = new VirtualOutput(occurrenceNumber, name);

    const portPair = new PortPair(iPort, oPort);
    this.virtualPorts.push(portPair);

    portPair.open();

    // remove the portPair from the `openLock`
    this.openLock.splice(this.openLock.indexOf(name), 1);
  }

  /**
   * Tries to close the port with the given id. If no port exists for the id, does nothing.
   *
   * @param deviceId The device id
   */
  close(deviceId: string) {
    const port = this.#getVirtualEquivalent(deviceId);
    if (port) {
      port.close();
      this.#removePair(port.id);
    }
  }

  /* Closes all virtual ports */
  shutdown() {
    this.virtualPorts.forEach((pp) => {
      pp.close();
    });
    this.virtualPorts = [];
  }

  /**
   * Send the given message thru the virtual port with the given ID. If no virtual port
   * exists for given ID, does nothing
   *
   * @param msg The message to send
   * @param devId The virtual port ID
   */
  send(msg: MidiValue[], devId: string) {
    const port = this.#getVirtualEquivalent(devId);

    if (port) port.send(msg);
  }

  /**
   * Retrieves the virtual `PortPair` equivalent of a hardware `PortPair`.
   * E.g. getVirtualEquivalent('APC Key 25') will return 'SC APC Key 25' `PortPair`.
   *
   * @param id The ID of the requested port pair
   * @returns the virtual equivalent of the PortPair, if exists. otherwise null
   */
  #getVirtualEquivalent = (id: string) => {
    if (id.startsWith('SC '))
      throw new Error(
        'Requested the virtual equivalent of a virtual port. Use getVirtualPortPair instead'
      );

    const parsed = `SC ${id}`;
    return this.#getVirtualPortPair(parsed);
  };

  /**
   * Get virtual PortPair by id
   *
   * @param id The ID of the requested PortPair
   * @returns The correlating virtual PortPair or null
   */
  #getVirtualPortPair = (id: string): PortPair | null => {
    let targetPair: PortPair | null = null;
    this.virtualPorts.forEach((pair) => {
      if (pair.id === id) targetPair = pair;
    });

    return targetPair;
  };

  /**
   * Remove a virtual `PortPair` from `virtualPorts` by `id`. Throws if no
   * match is found
   *
   * @param { string } id The requested ID
   */
  #removePair = (id: string) => {
    let idx = -1;

    this.virtualPorts.forEach((pair, index) => {
      if (pair.id === id) idx = index;
    });

    if (idx === -1) {
      throw new Error(`No matching virtual PortPair for id[${id}]`);
    }

    this.virtualPorts.splice(idx, 1);
  };
}

export const testables = {
  getDiff,
};
