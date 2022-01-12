/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { MidiValue, MidiMessage } from 'midi-message-parser';

import { Project } from '@shared/project';
import { isSustain, inputIdFor, msgForColor, getDiff } from '@shared/util';
import { InputConfig, SupportedDeviceConfig } from '@shared/hardware-config';
import { Color } from '@shared/driver-types';
import { PortInfo } from '@shared/port-info';

import { PortPair } from './port-pair';
import { all } from './port-manager';
import { DrivenPortPair } from './driven-port-pair';
import { windowService } from '../window-service';
import { VirtualPortService } from './virtual-port-service';

/**
 * Manages sending/receiving of messages to and from device, as well as syncing
 * with the front end.
 */
export class PortService {
  /* The current project */
  #project: Project;

  /* List of available port pairs */
  portPairs: Map<string, PortPair> = new Map();

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
    const info = Array.from(this.portPairs.values()).map(
      (p) => new PortInfo(p.name, p.siblingIndex, true)
    );

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
    if (pp instanceof DrivenPortPair && config) {
      pp.runControlSequence(); // take control of midi device
      pp.resetLights(); // init default lights

      pp.onMessage((_delta: number, msg: number[]) => {
        // we'll occasionally receive message of length 1. ignore these.
        // reason is unclear, message of lenght 1 don't match midi spec
        if (msg.length >= 2) {
          this.#onMessage(pp, msg as MidiValue[]);
        }
      });

      // // if device is configured, apply default light config
      if (config instanceof SupportedDeviceConfig) {
        this.#syncDeviceLights(pp, config);
      }
    }
  }

  syncDeviceLights = (deviceId: string) => {
    const pp = this.portPairs.get(deviceId);
    const config = this.#project.getDevice(deviceId);

    if (pp && config instanceof SupportedDeviceConfig)
      this.#syncDeviceLights(pp, config);
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
   * Synchronize device hardware lights with software state
   *
   * @param pp The PortPair for device
   * @param config The SupportedDeviceConfig for device
   */
  #syncDeviceLights = (pp: PortPair, config: SupportedDeviceConfig) => {
    type Tuple = [InputConfig, Color | undefined];

    config.inputs
      .map((i) => [i, i.currentColor] as Tuple) // get current color
      .filter((tuple) => tuple[1] !== undefined) // eslint-disable-line
      .map(([i, c]) => msgForColor(i.default.number, i.default.channel, c)) // get message for color
      .filter((conf) => conf !== undefined) // filter undefined
      .forEach((conf) => pp.send(conf!.toMidiArray())); // send color message
  };

  /**
   * Send sustain events from all devices shareWith on the same channel as their
   * respective keyboards
   *
   * @param msg The event from the device
   * @param The list of ids with which sustain events are being shared
   */
  #handleSustain = (msg: MidiValue[], shareWith: string[]) => {
    shareWith.forEach((devId) => {
      const device = this.#project.getDevice(devId);

      if (device?.keyboardDriver !== undefined) {
        const mm = new MidiMessage(msg, 0);
        mm.channel = device?.keyboardDriver?.channel;
        this.#virtService.send(mm.toMidiArray(), devId);
      }
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
  #onMessage = (pair: PortPair, msg: MidiValue[]) => {
    const deviceOrNull = this.#project.getDevice(pair.id);

    if (deviceOrNull !== undefined) {
      // device exists. process it
      const [toDevice, toPropagate] = deviceOrNull.handleMessage(
        msg as MidiValue[]
      );

      // send sustain events thru all virtual ports in config
      if (isSustain(msg)) this.#handleSustain(msg, deviceOrNull.shareSustain);

      // propagate the msg thru virtual port to clients
      if (toPropagate) this.#virtService.send(toPropagate, deviceOrNull.id);

      // send response to hardware device
      if (toDevice) pair.send(toDevice);

      // send new state to frontend
      const mm = new MidiMessage(msg, 0);
      const id = inputIdFor(mm);
      windowService.sendInputMsg(id, deviceOrNull.id, msg);
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
      .map((dev) => this.portPairs.get(dev.id))
      .forEach((pp) => {
        if (pp) {
          pp.open(); // open connection to device
          this.#virtService.open(pp.name, pp.siblingIndex); // open virt port
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
  #updateDisconnectedPorts = (freshPorts: Map<string, PortPair>) => {
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
  #addAll = (toAdd: string[], freshPorts: Map<string, PortPair>) => {
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
