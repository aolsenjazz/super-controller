import { PortPair } from '@alexanderolsen/port-manager';
import { MidiValue } from 'midi-message-parser';

import { VirtualInput } from './virtual-input';
import { VirtualOutput } from './virtual-output';

/**
 * Returns a list of `PortPair` which are present in pairs1 and not in pairs2. If `stripPrefix`
 * is set to `true`, removes 'SC ' prefix so that 'SC APC Key' === 'APC Key'
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
   * Invoked when the list of available hardware ports changes. Updates the corresponding
   * list of virtual ports using `#updateVirtualPorts`. Adds a message listener to each hardware
   * port and invokes `this.onPortMsg`
   */
  onHardwarePortsChange(ports: PortPair[]) {
    const toBeAdded = getDiff(ports, this.virtualPorts, true);
    const toBeRemoved = getDiff(this.virtualPorts, ports, true);

    toBeRemoved.forEach((pair) => {
      pair.close();
      this.#removePair(pair.id);
    });

    toBeAdded.forEach((pair) => {
      this.#open(pair.name, pair.occurrenceNumber);
    });

    return toBeAdded;
  }

  /**
   * Retrieves the virtual `PortPair` equivalent of a hardware `PortPair`.
   * E.g. getVirtualEquivalent('APC Key 25') will return 'SC APC Key 25' `PortPair`.
   */
  getVirtualEquivalent(id: string) {
    const parsed = `SC ${id}`;
    return this.#getVirtualPortPair(parsed);
  }

  open(deviceName: string, occurrenceNumber: number) {
    this.#open(deviceName, occurrenceNumber);
  }

  close(deviceId: string) {
    const ports = this.getVirtualEquivalent(deviceId);
    if (ports !== undefined) {
      ports.close();
      this.#removePair(ports.id);
    }
  }

  shutdown() {
    this.virtualPorts.forEach((pp) => {
      pp.close();
    });
  }

  send(msg: MidiValue[], devId: string) {
    const ports = this.getVirtualEquivalent(devId);

    ports.send(msg);
  }

  /**
   * Get virtual PortPair by id
   */
  #getVirtualPortPair = (id: string): PortPair => {
    let targetPair: PortPair | null = null;
    this.virtualPorts.forEach((pair) => {
      if (pair.id === id) targetPair = pair;
    });

    if (targetPair === null)
      throw new Error(`No matching virtual PortPair for id[${id}]`);

    return targetPair;
  };

  #open = (deviceName: string, occurrenceNumber: number) => {
    const name = `SC ${deviceName}`;
    const iPort = new VirtualInput(occurrenceNumber, name);
    const oPort = new VirtualOutput(occurrenceNumber, name);

    const portPair = new PortPair(iPort, oPort);
    portPair.open();

    this.virtualPorts.push(portPair);
  };

  /**
   * Remove a virtual `PortPair` from `virtualPorts` by `id`
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
