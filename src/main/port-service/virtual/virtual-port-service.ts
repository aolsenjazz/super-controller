import { MidiArray } from '@shared/midi-array';
import { DeviceConfig } from '@shared/hardware-config';

import { PortScanResult } from './port-manager';
import { ProjectProvider, ProjectProviderEvent } from '../project-provider';
import { PortPair } from './port-pair';
import { VirtualInput } from './virtual-input';
import { VirtualOutput } from './virtual-output';
import { NewProjectEvent } from '../project-provider/project-event-emitter';

export class VirtualPortServiceSingleton {
  ports = new Map<string, PortPair>();

  private availableHardwarePorts: string[] = [];

  private static instance: VirtualPortServiceSingleton;

  private constructor() {
    this.setProjectChangeListener();
    this.setConfigChangeListener();
  }

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
  public send(msg: MidiArray, idOrConfig: string | DeviceConfig) {
    let id = idOrConfig;

    if (idOrConfig instanceof DeviceConfig) id = idOrConfig.id;

    const port = this.ports.get(id as string);
    if (port) port.send(msg.array);
  }

  public onHardwareChanged(ports: PortScanResult) {
    const { addedPorts, removedPorts, currentPorts } = ports;

    removedPorts.forEach((p) => this.close(p.id));

    addedPorts.forEach((p) => {
      const c = ProjectProvider.project.getDevice(p.id);

      if (c !== undefined) {
        this.open(c.portName, c.siblingIndex);
      }
    });

    this.availableHardwarePorts = currentPorts.map((p) => p.id);
  }

  private setConfigChangeListener() {
    ProjectProvider.on(ProjectProviderEvent.AddDevice, (config) => {
      if (this.availableHardwarePorts.includes(config.id)) {
        this.open(config.portName, config.siblingIndex);
      }
    });

    ProjectProvider.on(ProjectProviderEvent.RemoveDevice, (c) =>
      this.close(c.id)
    );
  }

  private setProjectChangeListener() {
    const listener = (event: NewProjectEvent) => {
      const { project } = event;

      // close ports for which there is no config
      const configuredDevices = project.devices.map((d) => d.id);
      Array.from(this.ports.keys())
        .filter((id) => !configuredDevices.includes(id))
        .forEach((id) => {
          this.close(id);
        });

      // open ports for which there is a config and a hardware port avail
      const openPortIds = Array.from(this.ports.keys());
      project.devices
        .filter((d) => !openPortIds.includes(d.id))
        .filter((d) => this.availableHardwarePorts.includes(d.id)) // make sure that the hardware is avail
        .forEach((d) => {
          this.open(d.portName, d.siblingIndex);
        });
    };

    ProjectProvider.on(ProjectProviderEvent.NewProject, listener);
  }

  /**
   * Opens the virtual port using the given name and occurrence number
   */
  private open(deviceName: string, siblingIndex: number) {
    const id = `${deviceName} ${siblingIndex}`;

    // note: arg[0] here isn't used
    const iPort = new VirtualInput(0, siblingIndex, deviceName);
    const oPort = new VirtualOutput(0, siblingIndex, deviceName);
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
