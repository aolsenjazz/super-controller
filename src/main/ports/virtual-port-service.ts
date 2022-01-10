import { MidiValue } from 'midi-message-parser';

import { PortPair } from './port-pair';
import { VirtualInput } from './virtual-input';
import { VirtualOutput } from './virtual-output';

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
   * Opens the virtual port using the given name and occurrence number
   *
   * @param deviceName The name of the virtual port
   * @param siblingIndex The nth-occurrence of the given port. useful if >1 ports are opened with the same name
   */
  open(deviceName: string, siblingIndex: number) {
    const name = `SC ${deviceName}`;

    // check if this port is already being opened by another process
    if (this.openLock.includes(name)) {
      // eslint-disable-next-line
      console.warn(`Tried to open duplicate vPort [${name}]. Ignoring...`);
      return;
    }

    // lock this port name
    this.openLock.push(name);

    const iPort = new VirtualInput(siblingIndex, name);
    const oPort = new VirtualOutput(siblingIndex, name);

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
    const port = this.#getVirtualPortPair(deviceId);
    if (port) {
      port.close();
      this.#removePair(port.id);
    }
  }

  isOpen(id: string) {
    return this.virtualPorts.filter((vp) => vp.id === `SC ${id}`).length === 1;
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
    const port = this.#getVirtualPortPair(devId);

    if (port) port.send(msg);
  }

  /**
   * Get virtual PortPair by id
   *
   * @param id The ID of the requested PortPair
   * @returns The correlating virtual PortPair or null
   */
  #getVirtualPortPair = (id: string): PortPair | null => {
    const parsedId = id.startsWith('SC ') ? id : `SC ${id}`;
    let targetPair: PortPair | null = null;
    this.virtualPorts.forEach((pair) => {
      if (pair.id === parsedId) targetPair = pair;
    });

    return targetPair;
  };

  /**
   * Remove a virtual `PortPair` from `virtualPorts` by `id`. Throws if no
   * match is found
   *
   * @param id The requested ID
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
