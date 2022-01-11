import { PortPair } from './port-pair';
import { VirtualInput } from './virtual-input';
import { VirtualOutput } from './virtual-output';

export class VirtualPortService {
  /**
   * Contains one virtual `PortPair` for each hardware `PortPair`. Ports are automatically
   * close and opened once `onHardwarePortsChange` is invoked with a differing list.
   */
  ports = new Map<string, PortPair>();

  /**
   * Opens the virtual port using the given name and occurrence number
   *
   * @param deviceName The name of the device which this port represents
   * @param siblingIndex The nth-occurrence of the given port. useful if >1 ports are opened with the same name
   */
  open(deviceName: string, siblingIndex: number) {
    const id = `${deviceName} ${siblingIndex}`;

    const iPort = new VirtualInput(siblingIndex, deviceName);
    const oPort = new VirtualOutput(siblingIndex, deviceName);
    const portPair = new PortPair(iPort, oPort);

    portPair.open();

    this.ports.set(id, portPair);
  }

  /**
   * Tries to close the port with the given id. If no port exists for the id, does nothing.
   *
   * @param id The device id
   */
  close(id: string) {
    this.ports.get(id)?.close();
    this.ports.delete(id);
  }

  isOpen(id: string) {
    return this.ports.get(id) !== undefined;
  }

  /* Closes all virtual ports */
  shutdown() {
    this.ports.forEach((pp) => {
      pp.close();
    });
    this.ports.clear();
  }

  /**
   * Send the given message thru the virtual port with the given ID. If no virtual port
   * exists for given ID, does nothing
   *
   * @param msg The message to send
   * @param id The virtual port ID
   */
  send(msg: number[], id: string) {
    this.ports.get(id)?.send(msg);
  }
}
