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
import { ipcMain } from 'electron';

import { getDriver } from '@shared/drivers';
import {
  AdapterDeviceConfig,
  AnonymousDeviceConfig,
  DeviceConfig,
  LightCapableInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { create, MidiArray, ThreeByteMidiArray } from '@shared/midi-array';

import { PortScanResult, PortManager } from './port-manager';
import { ProjectProvider, ProjectProviderEvent } from '../project-provider';
import { PortPair } from './port-pair';
import { NewProjectEvent } from '../project-provider/project-event-emitter';
import { InputPort } from './input-port';
import { OutputPort } from './output-port';
import { PortInfoPair } from './port-info-pair';
import { wp } from '../window-provider';
import { HOST } from '../ipc-channels';
import { VirtualPortService } from './virtual-port-service';

const { MainWindow } = wp;

/**
 * Convenience method for creating an `InputPort`
 */
function createIPort(p: PortInfoPair) {
  return p.iPort === null
    ? p.iPort
    : new InputPort(p.iPort.index, p.siblingIndex, p.name);
}

/**
 * Convenience method for creating an `OutputPort`
 */
function createOPort(p: PortInfoPair) {
  return p.oPort === null
    ? p.oPort
    : new OutputPort(p.oPort.index, p.siblingIndex, p.name);
}

export class HardwarePortServiceSingleton {
  ports = new Map<string, PortPair>();

  private availableHardwarePorts: PortInfoPair[] = [];

  private static instance: HardwarePortServiceSingleton;

  private constructor() {
    this.setHardwareChangeListener();
    this.setProjectChangeListener();
    this.setConfigChangeListener();
    this.setFrontendListeners();
  }

  public static getInstance(): HardwarePortServiceSingleton {
    if (!HardwarePortServiceSingleton.instance) {
      HardwarePortServiceSingleton.instance =
        new HardwarePortServiceSingleton();
    }
    return HardwarePortServiceSingleton.instance;
  }

  /**
   * Listen to IPC comms from frontend
   */
  private setFrontendListeners() {
    ipcMain.on(HOST.REQUEST_CONNECTED_DEVICES, () =>
      this.sendConnectedDevicesToFrontend()
    );

    ipcMain.on(HOST.REQUEST_DEVICE_STUB, (_e: Event, deviceId: string) => {
      this.availableHardwarePorts
        .filter((p) => p.id === deviceId)
        .forEach((p) => MainWindow.sendDeviceStub(deviceId, p.stub));
    });
  }

  /**
   * When configs are added or removed, open/close port as required
   */
  private setConfigChangeListener() {
    ProjectProvider.on(ProjectProviderEvent.AddDevice, (config) => {
      // if the hardware is available, open a connection to it
      this.availableHardwarePorts
        .filter((p) => p.id === config.id)
        .forEach((p) => this.open(p));
    });

    ProjectProvider.on(ProjectProviderEvent.RemoveDevice, (c) =>
      this.close(c.id)
    );

    ProjectProvider.on(
      ProjectProviderEvent.UpdateInput,
      (deviceConfig, inputConfigs) => {
        const pair = this.ports.get(deviceConfig.id);

        if (pair !== undefined) {
          inputConfigs.forEach((i) => {
            if (i instanceof LightCapableInputConfig && i.currentColorArray) {
              pair.send(i.currentColorArray);
            }
          });
        }
      }
    );
  }

  /**
   * When the project changes, reset all ports
   */
  private setProjectChangeListener() {
    const listener = (event: NewProjectEvent) => {
      const { project } = event;

      // close all current hardware connections
      Array.from(this.ports.keys()).forEach((id) => this.close(id));

      // open all new hardware connections if they're available
      this.availableHardwarePorts
        .filter((p) => project.getDevice(p.id))
        .forEach((p) => this.open(p));
    };

    ProjectProvider.on(ProjectProviderEvent.NewProject, listener);
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
        .filter((p) => ProjectProvider.project.getDevice(p.id) !== undefined)
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
    MainWindow.sendConnectedDevices(devices);
  }

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
    const config = ProjectProvider.project.getDevice(pair.id);

    if (config) {
      const driverName =
        config instanceof AdapterDeviceConfig
          ? config.child?.driverName
          : config.driverName;
      const driver = driverName ? getDriver(driverName) : undefined;

      if (driver) {
        pair.applyThrottle(driver.throttle); // apply throttle if exists
        driver.controlSequence.forEach((msg) => pair.send(msg)); // run control sequence
        driver.inputGrids // init default colors if they exist
          .flatMap((ig) => ig.inputs)
          .forEach((i) => {
            if (i.interactive && i.type !== 'xy') {
              i.availableColors
                .filter((c) => c.default === true)
                .forEach((c) => pair.send(c.array));
            }
          });
      }

      // set onMessage
      pair.onMessage((_delta, tuple) => {
        const msg = create(tuple);
        // we'll occasionally receive message of length 1. ignore these.
        // reason is unclear, message of lenght 1 don't match midi spec
        if (msg.length >= 2) this.onMessage(config, pair, msg);
      });

      // load current color config
      if (config instanceof SupportedDeviceConfig) {
        config.inputs.forEach((i) => {
          if (i instanceof LightCapableInputConfig && i.currentColorArray) {
            pair.send(i.currentColorArray);
          }
        });
      }
    }
  }

  private onMessage(config: DeviceConfig, pair: PortPair, msg: MidiArray) {
    const toPropagate = config.applyOverrides(msg);
    const toDevice = config.getResponse(msg);

    if (toPropagate) {
      // send sustain events thru all virtual ports in config
      if (toPropagate.isSustain)
        this.handleSustain(toPropagate, config.shareSustain);

      VirtualPortService.send(toPropagate, config.id);
    }

    if (toDevice) pair.send(toDevice);

    if (
      config instanceof SupportedDeviceConfig ||
      config instanceof AdapterDeviceConfig
    ) {
      // send new state to frontend
      const input = config.getOriginatorInput(msg);

      if (input) {
        MainWindow.sendInputState(config.id, input.id, input.state);
      }
    } else if (config instanceof AnonymousDeviceConfig) {
      MainWindow.sendRecentMsg(pair.id, msg.array);
    }
  }

  private handleSustain(msg: MidiArray, shareWith: string[]) {
    shareWith.forEach((devId) => {
      const device = ProjectProvider.project.getDevice(devId);
      let newMsg = msg;

      if (device?.keyboardDriver !== undefined) {
        const c = device.keyboardDriver.channel;
        const asThree = msg as ThreeByteMidiArray;
        newMsg = create('controlchange', c, asThree.number, asThree.value);
      }

      VirtualPortService.send(newMsg, devId);
    });
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
