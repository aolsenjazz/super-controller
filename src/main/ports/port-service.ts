/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { MidiValue, MidiMessage } from 'midi-message-parser';

import { inputIdFor, msgForColor } from '@shared/device-util';
import { Project } from '@shared/project';
import { isSustain } from '@shared/util';
import { InputConfig, SupportedDeviceConfig } from '@shared/hardware-config';
import { Color } from '@shared/driver-types';
import { PortInfo } from '@shared/port-info';

import { PortPair } from './port-pair';
import { all } from './port-manager';
import { DrivenPortPair } from './driven-port-pair';
import { windowService } from '../window-service';
import { VirtualPortService } from './virtual-port-service';
import { getDiff } from '../util-main';

/**
 * Manages sending/receiving of messages to and from device, as well as syncing
 * with the front end.
 */
export class PortService {
  /* The current project */
  #project: Project;

  /* List of available port pairs */
  portPairs: DrivenPortPair[] = [];

  /* See `VirtualPortService` */
  #virtService: VirtualPortService;

  constructor(project: Project) {
    this.#project = project;
    this.#virtService = new VirtualPortService();

    this.#checkPorts(); // Scan for ports right away
  }

  /**
   * If hardware device is connected && configured:
   *
   * 1. Opens a virtual port for event propagation
   * 2. Takes control of the device
   * 3. Resets lights to reasonable defaults
   * 4. Sets callbacks for receiving messages from hardware
   * 5. Applies default backlight configuration
   *
   * @param deviceId The idea of the device
   */
  initDevice(deviceId: string) {
    const pp = this.#getPair(deviceId);
    const config = this.#project.getDevice(deviceId);

    // if hardware is connected and configured in project, run initialization
    if (pp && config) {
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

  /**
   * If supported, reset lights to defaults.
   * TODO: should run device relinquish sequence too
   *
   * @param deviceId The ID associated with the device
   */
  relinquishDevice(deviceId: string) {
    const pair = this.#getPair(deviceId);
    if (pair) pair.resetLights();
    this.#virtService.close(deviceId);
  }

  /* Pass current list of `PortPair`s to the front end */
  sendToFrontend() {
    // pass port info to frontend
    const info = this.portPairs.map(
      (p) => new PortInfo(p.name, p.siblingIndex, true)
    );

    windowService.sendPortInfos(info);
  }

  syncDeviceLights = (deviceId: string) => {
    const pp = this.#getPair(deviceId);
    const config = this.#project.getDevice(deviceId);

    if (pp && config instanceof SupportedDeviceConfig)
      this.#syncDeviceLights(pp, config);
  };

  /* On project update, reset all devices, init defaults in fresh copy of `Project` */
  set project(p: Project) {
    this.#project = p;

    this.portPairs.forEach((pp) => pp.resetLights()); // reset light for each device

    const ids = this.portPairs.map((pp) => pp.id);

    ids.forEach((id) => {
      this.#getPair(id)?.close();
      this.#removePair(id);
    });
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
   * Gets the given `PortPair` by id
   *
   * @param id The requested PortPair id
   * @returns A matching `PortPair` if exists, or null
   */
  #getPair = (id: string) => {
    const pairs = this.portPairs.filter((p) => p.id === id);
    return pairs.length === 0 ? null : pairs[0];
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

    if (deviceOrNull !== null) {
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
      const id = inputIdFor(mm.number, mm.channel, mm.type);
      windowService.sendInputMsg(id, deviceOrNull.id, msg);
    }
  };

  /**
   * Close/open virtual ports as required, set listeners, pass info to frontend,
   * and initialize device backlights
   *
   * @param portPairs The new list of port pairs
   */
  updatePorts() {
    // Filter out SuperController-created ports.
    const filtered = all()
      .filter((pair) => !pair.id.startsWith('SC '))
      .map((pair) => new DrivenPortPair(pair));

    const [newPorts, brokenPorts] = getDiff(filtered, this.portPairs, true);

    let doRefresh = false;

    // close sibling ports for all broken ports
    brokenPorts.forEach((pp) => {
      const siblings = this.portPairs.filter((sib) => sib.name === pp.name);
      siblings.forEach((sib) => {
        sib.close();
        this.#removePair(sib.id);
        this.#virtService.close(sib.id);
        doRefresh = true;
      });
    });

    // for every device removed from Project, close virtual ports, reset, and close ports here if they exist
    this.#virtService.virtualPorts
      .filter((vPort) => !this.#project.getDevice(vPort.id.replace('SC ', '')))
      .map((vPort) => {
        this.#virtService.close(vPort.id);
        doRefresh = true;
        // map to a `PortPair` or null
        const filt = this.portPairs.filter(
          (pp) => pp.id === vPort.id.replace('SC ', '')
        );
        return filt.length === 1 ? filt[0] : null;
      })
      .filter((pp) => pp !== null) // filter non-null
      .forEach((pp) => {
        pp!.close();
        this.#removePair(pp!.id);
      });

    // remove non-connected devices from this list
    const toRemove = this.portPairs
      .filter((pp) => pp.isPortOpen() === false)
      .map((pp) => pp.id);
    toRemove.forEach((id) => {
      this.#removePair(id);
    });

    // for every removed ports, add in updated ports
    const toUpdate = filtered.filter((pp) => toRemove.includes(pp.id));
    this.portPairs = this.portPairs.concat(toUpdate);

    // add new ports
    this.portPairs = this.portPairs.concat(newPorts as DrivenPortPair[]);

    if (doRefresh) {
      this.updatePorts();
      return;
    }

    // for every device added to project, open port and init
    this.#project.devices
      .filter((dev) => !this.#virtService.isOpen(dev.id)) // get devices which aren't connected
      .map((dev) => {
        // map to a `PortPair` or null
        const filt = filtered.filter((pp) => pp.id === dev.id);
        return filt.length === 1 ? filt[0] : null;
      })
      .filter((pp) => pp !== null) // filter non-null
      .forEach((pp) => {
        pp!.open(); // open connection to device
        this.#virtService.open(pp!.name, pp!.siblingIndex); // open virt port

        this.initDevice(pp!.id);
      });

    this.sendToFrontend();
  }

  #checkPorts = () => {
    // Filter out SuperController-created ports.
    const filtered = all()
      .filter((pair) => !pair.id.startsWith('SC '))
      .map((pair) => new DrivenPortPair(pair));

    const stalePortNames = this.portPairs.map((pp) => pp.id);
    const freshPortNames = filtered.map((pp) => pp.id);

    // We only care about non-SC-created ports. The ports will change when a new
    // project is opened, etc because virtual ports will be opened/closed. ignore these
    if (
      JSON.stringify(stalePortNames.sort()) !==
      JSON.stringify(freshPortNames.sort())
    ) {
      this.updatePorts();
    }

    setTimeout(() => this.#checkPorts(), 1000);
  };

  /**
   * Remove a virtual `PortPair` from `this.portPairs` by `id`. Throws if no
   * match is found
   *
   * @param id The requested ID
   */
  #removePair = (id: string) => {
    let idx = -1;

    this.portPairs.forEach((pair, index) => {
      if (pair.id === id) idx = index;
    });

    if (idx === -1) {
      throw new Error(`No matching virtual PortPair for id[${id}]`);
    }

    this.portPairs.splice(idx, 1);
  };
}
