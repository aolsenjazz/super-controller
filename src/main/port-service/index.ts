/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { ipcMain } from 'electron';

import { Project } from '@shared/project';
import { create, MidiArray, ThreeByteMidiArray } from '@shared/midi-array';
import { getDiff } from '@shared/util';
import {
  BaseInputConfig,
  SupportedDeviceConfig,
  AdapterDeviceConfig,
  LightCapableInputConfig,
} from '@shared/hardware-config';
import { getDriver } from '@shared/drivers';
import { PortInfo } from '@shared/port-info';

import { ProjectProvider } from '../project-provider';
import { wp } from '../window-provider';
import { PortPair } from './port-pair';
import { all } from './port-manager';
import { DrivenPortPair } from './driven-port-pair';
import { VirtualPortService } from './virtual-port-service';
import { PORTS } from '../ipc-channels';

const { MainWindow } = wp;

/**
 * Manages sending/receiving of messages to and from device, as well as syncing
 * with the front end.
 */
class PortServiceSingleton {
  /* List of available port pairs */
  portPairs: Map<string, DrivenPortPair> = new Map();

  /* See `VirtualPortService` */
  #virtService: VirtualPortService;

  private static instance: PortServiceSingleton;

  // 2. Private constructor to prevent direct construction calls with the `new` operator
  private constructor() {
    this.#virtService = new VirtualPortService();

    this.#checkPorts(); // Scan for ports right away

    ipcMain.on(PORTS, () => {
      this.sendToFrontend();
    });
  }

  // 3. Static method to get the instance of the class
  public static getInstance(): PortServiceSingleton {
    if (!PortServiceSingleton.instance) {
      PortServiceSingleton.instance = new PortServiceSingleton();
    }
    return PortServiceSingleton.instance;
  }

  /* Pass current list of `PortPair`s to the front end */
  sendToFrontend() {
    // pass port info to frontend
    const info = Array.from(this.portPairs.values()).map((p) => {
      return new PortInfo(p.name, p.siblingIndex, true);
    });

    MainWindow.sendPortInfos(info);
  }

  /**
   * If hardware device is connected && configured:
   *
   * 1. Takes control of the device
   * 2. Resets lights to reasonable defaults
   * 3. Applies default backlight configuration
   *
   * @param deviceId The idea of the device
   */
  initDevice(deviceId: string) {
    const pp = this.portPairs.get(deviceId);
    const config = ProjectProvider.project.getDevice(deviceId);

    // if hardware is connected and configured in project, run initialization
    if (pp && config) {
      if (pp instanceof DrivenPortPair) {
        pp.runControlSequence(); // take control of midi device
        pp.resetLights(); // init default lights
      }

      pp.onMessage((_delta: number, tuple: MidiTuple) => {
        const msg = create(tuple);
        // we'll occasionally receive message of length 1. ignore these.
        // reason is unclear, message of lenght 1 don't match midi spec
        if (msg.length >= 2) this.#onMessage(pp, msg);
      });

      // // if device is configured, apply default light config
      if (config.supported === true) {
        this.syncDeviceLights(config.id);
      }
    }
  }

  /**
   * Synchronize device hardware lights with software state
   *
   * @param deviceId The id of the device
   */
  syncDeviceLights = (deviceId: string) => {
    const pp = this.portPairs.get(deviceId);
    const config = ProjectProvider.project.getDevice(deviceId);

    if (pp && config instanceof SupportedDeviceConfig) {
      type T = LightCapableInputConfig;
      config.inputs
        .filter((i) => i instanceof LightCapableInputConfig)
        .filter((i) => (i as T).currentColorArray !== undefined)
        .map((i) => (i as T).currentColorArray!) // get message for color
        .forEach((c) => pp.send(c.array)); // send color message
    }
  };

  syncInputLight = (deviceId: string, config: BaseInputConfig) => {
    const pp = this.portPairs.get(deviceId);

    if (
      pp &&
      config instanceof LightCapableInputConfig &&
      config.currentColorArray
    ) {
      pp.send(config.currentColorArray);
    }
  };

  /**
   * Synchronize the list of available MIDI clients with the list of configured
   * devices in `this.project`. Removes + closes unneeded connections, opens new
   * connections, runs device initialization, lets the frontend know.
   */
  updatePorts() {
    // If multiple devices of the same name are plugged in, close all with said name.
    // This must be done until connection can be tracked via USB connection id; the following
    // situation illustrates why:
    //
    // APC[0] is plugged in, at USB index[1]. User plugs in APC[1] at index [0].
    // Internally, APC[1] becomes APC[0], but SC isn't aware of the change because we're
    // currently not monitoring USB indexes.
    // TODO: track USB connection IDs
    let freshPorts = all();
    const entries = Array.from(freshPorts.values());
    const nonUniquePorts: string[] = [];
    freshPorts.forEach((v, k) => {
      const nOccur = entries.filter((e) => e.name === v.name).length;
      if (nOccur > 1) nonUniquePorts.push(k);
    });
    this.#closeSiblings(nonUniquePorts);

    // midi clients which are present in the most recent scan but not in `this.portPairs`
    // should be added to current list. midi clients which are preset in `this.portPairs`
    // but not the most recent scan are broken and should be removed
    freshPorts = all();
    let [toAdd, broken] = getDiff(
      Array.from(freshPorts.keys()),
      Array.from(this.portPairs.keys())
    );

    // close broken port and all of its siblings
    this.#closeSiblings(broken);
    // close ports for config which have been removed from `this.project`
    this.#trimRemovedConfigs();

    // at this point, ports *might* have been closed. if ports were closed, then port
    // indexes have changed. refresh the current midi client list to be safe
    freshPorts = all();
    [toAdd, broken] = getDiff(
      Array.from(freshPorts.keys()),
      Array.from(this.portPairs.keys())
    );

    // update all available, but not-configured, midi clients in `this.portPairs`
    this.#updateDisconnectedPorts(freshPorts);
    // add all newly-available midi clients to `this.portPairs`
    this.#addAll(toAdd, freshPorts);
    // open connections to devices for newly-added configs
    this.#openNewConfigs();

    // tell the frontend what happened
    this.sendToFrontend();
  }

  applyThrottle(id: string, throttleMs: number | undefined) {
    this.portPairs.forEach((v, k) => {
      if (id === k) v.applyThrottle(throttleMs);
    });
  }

  /* On project update, reset all devices, init defaults in fresh copy of `Project` */
  set project(_p: Project) {
    // this.#project = p;
    // TODO: this will have big chnages

    this.portPairs.forEach((pp) => {
      if (pp instanceof DrivenPortPair) pp.resetLights();
      pp.close();
    });
    this.portPairs.clear();
    this.#virtService.shutdown(); // close all open vPorts

    this.updatePorts();
  }

  /**
   * Send sustain events from all devices shareWith on the same channel as their
   * respective keyboards if exist, otherwise default channel
   *
   * @param msg The event from the device
   * @param The list of ids with which sustain events are being shared
   */
  #handleSustain = (msg: MidiArray, shareWith: string[]) => {
    shareWith.forEach((devId) => {
      const device = ProjectProvider.project.getDevice(devId);
      let newMsg = msg;

      if (device?.keyboardDriver !== undefined) {
        const c = device.keyboardDriver.channel;
        const asThree = msg as ThreeByteMidiArray;
        newMsg = create('controlchange', c, asThree.number, asThree.value);
      }

      this.#virtService.send(newMsg, devId);
    });
  };

  /**
   * 1. If device is configured, pass msg to config and respond/propagate.
   * 2. If sustain event, send sustain events for all devices in config.shareSustain
   * 3. Sync state with frontend
   *
   * @param pair The input+output ports for device
   * @param msg The message from the device
   */
  #onMessage = (pair: PortPair, msg: MidiArray) => {
    const config = ProjectProvider.project.getDevice(pair.id);

    if (config !== undefined) {
      // device exists. process it
      const toPropagate = config.applyOverrides(msg);
      const toDevice = config.getResponse(msg);

      if (toPropagate) {
        // send sustain events thru all virtual ports in config
        if (toPropagate.isSustain)
          this.#handleSustain(toPropagate, config.shareSustain);

        this.#virtService.send(toPropagate, config.id);
      }

      if (toDevice) pair.send(toDevice);

      // send new state to frontend
      // ws.sendInputMsg(msg.id(true), config.id, msg); TODO:
    }
  };

  /**
   * Closes the corresponding ports for each element in portIds, and closes
   * sibling ports for each id. Sibling ports are ports which share the same
   * name. E.g. a user has 2 'APC Key 25' devices plugged in
   *
   * @param portIds The corresponding IDs of the ports (and siblings) to close
   */
  #closeSiblings = (portIds: string[]) => {
    let didClose = false;

    const brokenPortNames = portIds.map((id) => this.portPairs.get(id)?.name);
    this.portPairs.forEach((pp, id, map) => {
      if (brokenPortNames.includes(pp.name)) {
        pp.close();
        map.delete(id);
        this.#virtService.close(id);
        didClose = true;
      }
    });

    return didClose;
  };

  /**
   * For every `DeviceConfig` which was added to the project, open its
   * corresponding hardware and virtual ports
   */
  #openNewConfigs = () => {
    // for every device added to project, open port and init
    ProjectProvider.project.devices
      .filter((dev) => !this.#virtService.isOpen(dev.id)) // get devices which aren't connected
      .forEach((dev) => {
        const pp = this.portPairs.get(dev.id);

        if (pp) {
          pp.open(); // open connection to device
          this.#virtService.open(pp.name, pp.siblingIndex); // open virt port

          if (dev instanceof AdapterDeviceConfig && dev.child) {
            const driver = getDriver(dev.child.driverName);
            pp.applyThrottle(driver.throttle);
          }

          this.initDevice(pp.id);
        }
      });
  };

  /**
   * Close connections to all ports for which configs have been removed from
   * `this.project`
   */
  #trimRemovedConfigs = () => {
    let didClose = false;

    this.#virtService.ports.forEach((_pp, id) => {
      if (!ProjectProvider.project.getDevice(id)) {
        this.portPairs.get(id)?.close();
        this.portPairs.delete(id);
        this.#virtService.close(id);
        didClose = true;
      }
    });

    return didClose;
  };

  /**
   * Update the information for all ports which have not been opened, but are
   * available
   *
   * @param freshPorts The currently-available MIDI ports
   */
  #updateDisconnectedPorts = (freshPorts: Map<string, DrivenPortPair>) => {
    const toUpdate = Array.from(this.portPairs.values())
      .filter((pp) => !this.#virtService.isOpen(pp.id))
      .map((pp) => pp.id);

    toUpdate.forEach((id) => {
      const freshPort = freshPorts.get(id);
      if (freshPort) this.portPairs.set(id, freshPort);
    });
  };

  /**
   * Add all of the ports to `this.portPairs`
   *
   * @param toAdd List of corresponding port IDs to add
   * @param freshPorts The currently-available MIDI ports
   */
  #addAll = (toAdd: string[], freshPorts: Map<string, DrivenPortPair>) => {
    // add new ports
    toAdd
      .map((id) => freshPorts.get(id))
      .forEach((pp) => {
        if (pp) this.portPairs.set(pp.id, pp);
      });
  };

  /**
   * Check if the list of available midi clients has changed since we last checked
   *
   * @param pollInterval Inteval in ms to wait before checking new ports again
   */
  #checkPorts = (pollInterval = 1000) => {
    const freshDevices = all(true);

    const stalePortNames = Array.from(this.portPairs.keys()).sort();
    const freshPortNames = Array.from(freshDevices.keys()).sort();

    // We only care about non-SC-created ports. The ports will change when a new
    // project is opened, etc because virtual ports will be opened/closed. ignore these
    if (JSON.stringify(stalePortNames) !== JSON.stringify(freshPortNames)) {
      this.updatePorts();
    }

    setTimeout(() => this.#checkPorts(), pollInterval);
  };
}

export const PortService = PortServiceSingleton.getInstance();
