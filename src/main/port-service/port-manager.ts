import { getDiff } from '@shared/util';

import { PortInfoPair } from './port-info-pair';
import { readAvailableHardwarePorts } from './port-utils';

export type PortScanResult = {
  addedPorts: PortInfoPair[];
  removedPorts: PortInfoPair[];
  currentPorts: PortInfoPair[];
};

type PortChangeListener = (ports: PortScanResult) => void;

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
   * Begins polling available ports at a regular interval
   */
  private pollPorts(pollInterval = 1000) {
    const freshPorts = readAvailableHardwarePorts(true);

    if (JSON.stringify(freshPorts) !== JSON.stringify(this.ports)) {
      this.updatePorts(freshPorts);
    }

    setTimeout(() => this.pollPorts(), pollInterval);
  }

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
}

export const PortManager = PortManagerSingleton.getInstance();
