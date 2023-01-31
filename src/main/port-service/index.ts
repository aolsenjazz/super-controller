/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { Project } from '@shared/project';
import { MidiArray } from '@shared/midi-array';
import { inputIdFor, getDiff } from '@shared/util';
import {
  InputConfig,
  SupportedDeviceConfig,
  AdapterDeviceConfig,
} from '@shared/hardware-config';
import { DrivenPortInfo } from '@shared/driven-port-info';

import { PortPair } from './port-pair';
import { all } from './port-manager';
import { DrivenPortPair } from './driven-port-pair';
import { windowService } from '../window-service';
import { VirtualPortService } from './virtual-port-service';
import { getDriver } from '../drivers';

/**
 * Manages sending/receiving of messages to and from device, as well as syncing
 * with the front end.
 */
export class PortService {
  /* The current project */
  #project: Project;

  /* List of available port pairs */
  portPairs: Map<string, DrivenPortPair> = new Map();

  /* See `VirtualPortService` */
  #virtService: VirtualPortService;

  constructor(project: Project) {
    this.#project = project;
    this.#virtService = new VirtualPortService();

    this.#checkPorts(); // Scan for ports right away
  }

  /* Pass current list of `PortPair`s to the front end */
  sendToFrontend() {
    // pass port info to frontend
    const info = Array.from(this.portPairs.values()).map((p) => {
      return new DrivenPortInfo(p.name, p.siblingIndex, true, p.driver);
    });

    windowService.sendPortInfos(info);
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
    const config = this.#project.getDevice(deviceId);

    // if hardware is connected and configured in project, run initialization
    if (pp && config) {
      if (pp instanceof DrivenPortPair) {
        pp.runControlSequence(); // take control of midi device
        pp.resetLights(); // init default lights
      }

      pp.onMessage((_delta: number, tuple: MidiTuple) => {
        const msg = new MidiArray(tuple);
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
    const config = this.#project.getDevice(deviceId);

    if (pp && config instanceof SupportedDeviceConfig) {
      config.inputs
        .filter((i) => i.currentColor !== undefined)
        .map((i) => i.currentColor!) // get message for color
        .forEach((arr) => pp.send(arr)); // send color message
    }
  };

  syncInputLight = (deviceId: string, config: InputConfig) => {
    const pp = this.portPairs.get(deviceId);

    if (pp && config.currentColor) {
      pp.send(config.currentColor);
    }
  };

  /**
   * Synchronize the list of available MIDI clients with the list of configured
   * devices in `this.project`. Removes + closes unneeded connections, opens new
   * connections, runs device initialization, lets the frontend know.
   */
  updatePorts() {
    // midi clients which are present in the most recent scan but not in `this.portPairs`
    // should be added to current list. midi clients which are preset in `this.portPairs`
    // but not the most recent scan are broken and should be removed
    let freshPorts = all();
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
  set project(p: Project) {
    this.#project = p;

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
      const newMsg = new MidiArray(msg.array);
      const device = this.#project.getDevice(devId);

      if (device?.keyboardDriver !== undefined) {
        newMsg.channel = device.keyboardDriver.channel;
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
    const device = this.#project.getDevice(pair.id);

    if (device !== undefined) {
      // device exists. process it
      const [toDevice, toPropagate] = device.handleMessage(msg);

      // send sustain events thru all virtual ports in config
      if (toPropagate && toPropagate.isSustain)
        this.#handleSustain(toPropagate, device.shareSustain);

      // propagate the msg thru virtual port to clients
      if (toPropagate) this.#virtService.send(toPropagate, device.id);

      // send response to hardware device
      if (toDevice) {
        // const asSupported = device as SupportedDeviceConfig;
        // asSupported.inputs.forEach((i) => {
        //   if (i.number === 32) {}
        // });
        pair.send(toDevice);
      }

      // send new state to frontend
      const id = inputIdFor(msg);
      windowService.sendInputMsg(id, device.id, msg);
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
    this.#project.devices
      .filter((dev) => !this.#virtService.isOpen(dev.id)) // get devices which aren't connected
      .forEach((dev) => {
        const pp = this.portPairs.get(dev.id);

        if (pp) {
          pp.open(); // open connection to device
          this.#virtService.open(pp.name, pp.siblingIndex); // open virt port

          if (dev instanceof AdapterDeviceConfig) {
            const driver = getDriver(dev.child!.name);
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
      if (!this.#project.getDevice(id)) {
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
