import { getDiff } from '@shared/util';

import { PortInfoPair } from './port-info-pair';
import { readAvailableHardwarePorts } from './port-utils';

export type PortScanResult = {
  addedPorts: PortInfoPair[];
  removedPorts: PortInfoPair[];
  currentPorts: PortInfoPair[];
};

type PortChangeListener = (ports: PortScanResult) => void;

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
