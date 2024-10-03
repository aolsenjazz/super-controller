import { DeviceConfig } from '@shared/hardware-config';
import { DeviceRegistry } from '@main/device-registry';

import { PortScanResult } from '../port-manager';
import { PortPair } from '../port-pair';
import { VirtualInput } from './virtual-input';
import { VirtualOutput } from './virtual-output';

/**
 * Manages connections to SC-created virtual ports, *not* other virtual MIDI
 * ports. Connections to non-SC-created ports are managed in `PortService`
 */
export class VirtualPortServiceSingleton {
  ports = new Map<string, PortPair>();

  private availableHardwarePorts: string[] = [];

  private static instance: VirtualPortServiceSingleton;

  public static getInstance(): VirtualPortServiceSingleton {
    if (!VirtualPortServiceSingleton.instance) {
      VirtualPortServiceSingleton.instance = new VirtualPortServiceSingleton();
    }
    return VirtualPortServiceSingleton.instance;
  }

  /**
   * Send the given message thru the virtual port with the given ID. If no virtual port
   * exists for given ID, does nothing
   */
  public send(msg: NumberArrayWithStatus, idOrConfig: string | DeviceConfig) {
    let id = idOrConfig;

    if (idOrConfig instanceof DeviceConfig) id = idOrConfig.id;

    const port = this.ports.get(id as string);
    if (port) port.send(msg);
  }

  /**
   * Informs the `VirtualPortService` that the available hardware or non-SC
   * virtual MIDI ports have been changed, and therefore an SC virtual midi
   * port will either need to be opened or closed
   */
  public onHardwareChanged(ports: PortScanResult) {
    const { addedPorts, removedPorts, currentPorts } = ports;

    removedPorts.forEach((p) => this.close(p.id));

    addedPorts.forEach((p) => {
      const c = DeviceRegistry.get(p.id);

      if (c !== undefined) {
        this.open(c.portName, c.siblingIndex);
      }
    });

    this.availableHardwarePorts = currentPorts.map((p) => p.id);
  }

  public onConfigChange(event: {
    action: 'add' | 'remove';
    changed: DeviceConfig[];
  }) {
    if (event.action === 'add') {
      event.changed.forEach((c) => this.open(c.portName, c.siblingIndex));
    }

    if (event.action === 'remove') {
      event.changed.forEach((c) => this.close(c.id));
    }
  }

  /**
   * Sets listener to new-project events
   */
  public onProjectChange() {
    // close ports for which there is no config
    const configuredDevices = DeviceRegistry.getAll().map((d) => d.id);
    Array.from(this.ports.keys())
      .filter((id) => !configuredDevices.includes(id))
      .forEach((id) => {
        this.close(id);
      });

    // open ports for which there is a config and a hardware port avail
    const openPortIds = Array.from(this.ports.keys());
    DeviceRegistry.getAll()
      .filter((d) => !openPortIds.includes(d.id))
      .filter((d) => this.availableHardwarePorts.includes(d.id)) // make sure that the hardware is avail
      .forEach((d) => {
        this.open(d.portName, d.siblingIndex);
      });
  }

  /**
   * Opens the virtual port using the given name and occurrence number
   */
  private open(deviceName: string, siblingIndex: number) {
    const id = `${deviceName} ${siblingIndex}`;

    // note: arg[0] here isn't used
    const iPort = new VirtualInput(siblingIndex, deviceName);
    const oPort = new VirtualOutput(siblingIndex, deviceName);
    const portPair = new PortPair(iPort, oPort);

    this.ports.set(id, portPair);
  }

  /**
   * Tries to close the port with the given id. If no port exists for the id, does nothing.
   */
  private close(id: string) {
    this.ports.get(id)?.close();
    this.ports.delete(id);
  }
}

export const VirtualPortService = VirtualPortServiceSingleton.getInstance();
