/**
 *                        ___________________
 *                       |                   |
 *                       |     index.ts      |
 *                       |___________________|
 *              _________|_____________     |
 *             |                       |    |
 *             |virtual-port-service.ts|    |
 *             |_______________________|    |
 *   ______________|____   ____|____________|_
 *  |                   | |                   |
 *  |   virtual conns   | |   port-manager.ts |
 *  |___________________| |___________________|
 *                         _________|_________
 *                        |                   |
 *                        |  hardware conns   |
 *                        |___________________|
 */
import { ipcMain, IpcMainEvent } from 'electron';

import { idForMsg } from '@shared/midi-util';
import { DeviceRegistry } from '@main/device-registry';
import { PluginRegistry } from '@main/plugin-registry';
import { DeviceConfig } from '@shared/hardware-config';

import { PortScanResult, PortManager } from './port-manager';
import { PortPair } from './port-pair';
import { InputPort } from './input-port';
import { OutputPort } from './output-port';
import { PortInfoPair } from './port-info-pair';
import { WindowProvider } from '../window-provider';
import { HOST } from '../ipc-channels';
import { VirtualPortService } from './virtual/virtual-port-service';

const { MainWindow } = WindowProvider;

/**
 * Convenience method for creating an `InputPort`
 */
function createIPort(p: PortInfoPair) {
  return p.iPort === undefined
    ? p.iPort
    : new InputPort(p.iPort.index, p.siblingIndex, p.name);
}

/**
 * Convenience method for creating an `OutputPort`
 */
function createOPort(p: PortInfoPair) {
  return p.oPort === undefined
    ? p.oPort
    : new OutputPort(p.oPort.index, p.siblingIndex, p.name);
}

export class HardwarePortServiceSingleton {
  /**
   * List of currently-opened `PortPair`s. Opened ports may be either hardware
   * or virtual, but will never be SC-created ports; SC-created ports are managed
   * in `VirtualPortService`
   */
  private ports = new Map<string, PortPair>();

  /**
   * List of hardware ports available for connection
   */
  private availableHardwarePorts: PortInfoPair[] = [];

  private static instance: HardwarePortServiceSingleton;

  private constructor() {
    this.setHardwareChangeListener();
    this.setFrontendListeners();
  }

  public static getInstance(): HardwarePortServiceSingleton {
    if (!HardwarePortServiceSingleton.instance) {
      HardwarePortServiceSingleton.instance =
        new HardwarePortServiceSingleton();
    }
    return HardwarePortServiceSingleton.instance;
  }

  // TODO: this is a quick-and-dirty fix, and should be replaced
  public initAllConfiguredPorts() {
    DeviceRegistry.getAll().forEach((d) => {
      const port = this.ports.get(d.id);
      if (port) d.init(port, PluginRegistry);
    });
  }

  /**
   * Listen to IPC comms from frontend
   */
  private setFrontendListeners() {
    ipcMain.on(HOST.REQUEST_CONNECTED_DEVICES, () =>
      this.sendConnectedDevicesToFrontend()
    );

    // TODO: shouldn't realize use this name. either change the name or design
    ipcMain.on(HOST.REQUEST_DEVICE_STUB, (_e: Event, deviceId: string) => {
      this.availableHardwarePorts
        .filter((p) => p.id === deviceId)
        .forEach((p) => MainWindow.sendDeviceStub(deviceId, p.stub));
    });

    ipcMain.on(
      HOST.GET_CONNECTION_DETAILS,
      (e: IpcMainEvent, deviceId: string) => {
        const port = this.availableHardwarePorts.find((p) => p.id === deviceId);
        e.returnValue = port?.stub;
      }
    );

    ipcMain.on(HOST.GET_CONNECTED_DEVICES, (e: IpcMainEvent) => {
      e.returnValue = this.availableHardwarePorts.map((p) => p.stub);
    });
  }

  public onConfigChange(event: {
    action: 'add' | 'remove';
    changed: DeviceConfig[];
  }) {
    // if the hardware is available, open a connection to it
    if (event.action === 'add') {
      const addedIds = event.changed.map((d) => d.id);
      this.availableHardwarePorts
        .filter((p) => addedIds.includes(p.id))
        .forEach((p) => this.open(p));
    }

    if (event.action === 'remove') {
      event.changed.forEach((c) => this.close(c.id));
    }
  }

  /**
   * When the project changes, reset all ports
   */
  public onProjectChange() {
    // close all current hardware connections
    Array.from(this.ports.keys()).forEach((id) => this.close(id));

    // open all new hardware connections if they're available
    this.availableHardwarePorts
      .filter((p) => DeviceRegistry.get(p.id))
      .forEach((p) => this.open(p));
  }

  /**
   * When the available hardware changes, open/close ports as required
   */
  private setHardwareChangeListener() {
    const hardwareChangeListener = (ports: PortScanResult) => {
      const { addedPorts, removedPorts, currentPorts } = ports;

      // for all removedPorts, if hardware connection is open, close and remove
      removedPorts.forEach((p) => {
        const portPair = this.ports.get(p.id);
        if (portPair) {
          portPair.close();
          this.ports.delete(p.id);
        }
      });

      // for all addedPorts, if device is configured + if hardware is available, connect
      addedPorts
        .filter((p) => this.ports.get(p.id) === undefined)
        .filter((p) => DeviceRegistry.get(p.id) !== undefined)
        .forEach((p) => {
          this.open(p);
        });

      this.availableHardwarePorts = currentPorts;
      this.sendConnectedDevicesToFrontend();
      VirtualPortService.onHardwareChanged(ports);
    };

    PortManager.addListener(hardwareChangeListener);
  }

  private sendConnectedDevicesToFrontend() {
    const devices = this.availableHardwarePorts.map((d) => d.stub);
    MainWindow.sendReduxEvent({
      type: 'connectedDevices/setAll',
      payload: devices,
    });
  }

  /**
   * Constructs a `PortPair` and opens both the input and output ports,
   * if available. Also runs intialization protocols; see `initDevice` for more
   */
  private open(p: PortInfoPair) {
    // open port
    const iPort = createIPort(p);
    const oPort = createOPort(p);
    const pair = new PortPair(iPort, oPort);

    this.ports.set(pair.id, pair);

    // init device
    this.initDevice(pair);
  }

  /**
   * Performs the following:
   *
   * - applies throttle if exists
   * - runs control sequence if required
   * - sets all color capable inputs to default color
   * - sets onMessage event listener
   * - sets all color capable inputs to configured colors
   */
  private initDevice(pair: PortPair) {
    const config = DeviceRegistry.get(pair.id);

    if (config) {
      // init
      config.init(pair, PluginRegistry);

      // set onMessage
      pair.onMessage((_delta, msg) => {
        if (msg.length < 2) return;

        const inputId = idForMsg(msg, true);

        const remoteTransport = this.ports.get(config.id)!;
        const frontendInclusiveLoopbackTransport = {
          send: (m: NumberArrayWithStatus) => {
            pair.send(m);
            MainWindow.onLoopbackMessage(pair.id, inputId, m);
          },
          applyThrottle: pair.applyThrottle,
        };

        const message = config.process(msg, {
          loopbackTransport: frontendInclusiveLoopbackTransport,
          remoteTransport,
          loopbackTransports: VirtualPortService.ports,
          remoteTransports: this.ports,
          pluginProvider: PluginRegistry,
        });

        if (message) remoteTransport.send(message);

        MainWindow.sendNarrowInputEvent(pair.id, msg);
        MainWindow.sendInputEvent(pair.id, msg);
        // TODO somehow, send the "state" to the frontend. we're currently doing this with
        // sendNarrowInputEvent and sendInputEvent, but that's not quite the right
        // implementation for updating backlight colors in the frontend. should likely be
        // sending more specific state objects, maybe part of the DTO? maybe their own object
      });
    }
  }

  /**
   * Tries to close the port with the given id. If no port exists for the id, does nothing.
   */
  private close(id: string) {
    this.ports.get(id)?.close();
    this.ports.delete(id);
  }
}

export const HardwarePortService = HardwarePortServiceSingleton.getInstance();
