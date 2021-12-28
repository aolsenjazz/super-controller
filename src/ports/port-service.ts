import { addListener, PortPair, all } from '@alexanderolsen/port-manager';
import { MidiValue, MidiMessage } from 'midi-message-parser';

import { InputConfig, SupportedDeviceConfig } from '../hardware-config';
import { Color } from '../driver-types';
import { inputIdFor, msgForColor } from '../device-util';
import { DrivenPortPair } from '../main/driven-port-pair';
import { windowService } from '../main/window-service';
import { Project } from '../project';
import { isSustain } from '../util';
import { PortInfo } from './port-info';

import { VirtualPortService } from './virtual-port-service';

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

    addListener(this.#onPortsChange); // listen to changes to available hardware

    this.#onPortsChange(all()); // Scan for ports right away
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
      this.#virtService.open(pp.name, pp.occurrenceNumber); // open virtual port

      pp.runControlSequence(); // take control of midi device
      pp.resetLights(); // init default lights

      pp.onMessage((_delta: number, msg: number[]) =>
        this.#onMessage(pp, msg as MidiValue[])
      );

      // if device is configured, apply default light config
      if (config.supported) this.#syncDeviceLights(pp, config);
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
      (p) => new PortInfo(p.id, p.name, p.occurrenceNumber, true)
    );

    windowService.sendPortInfos(info);
  }

  syncDeviceLights = (deviceId: string) => {
    const pp = this.#getPair(deviceId);
    const config = this.#project.getDevice(deviceId);

    if (pp && config && config.supported) this.#syncDeviceLights(pp, config);
  };

  /* On project update, reset all devices, init defaults in fresh copy of `Project` */
  set project(p: Project) {
    this.#project = p;

    this.portPairs.forEach((pp) => pp.resetLights()); // reset light for each device

    this.#virtService.shutdown(); // close all open vPorts
    p.devices.forEach((config) => this.initDevice(config.id)); // init each configured device
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
      .map((i) => [i, i!.currentColor] as Tuple) // get current color
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
  #onPortsChange = (portPairs: PortPair[]) => {
    // Filter out SuperController-created ports.
    const filtered = portPairs
      .filter((pair) => !pair.id.startsWith('SC '))
      .map((pair) => new DrivenPortPair(pair));

    // We only care about non-SC-created ports. The ports will change when a new
    // project is opened, etc because virtual ports will be opened/closed. ignore these
    if (JSON.stringify(this.portPairs) === JSON.stringify(filtered)) {
      return;
    }

    // Update local port list
    this.portPairs = filtered;
    this.sendToFrontend();

    // Close all virtual ports
    this.#virtService.shutdown();

    // Reinitialize all devices
    // This might seem heavy-handed, but it's so much easier than account for
    // when a user disconnects a controller of index 0 where there is more than
    // one of that controller connected.
    filtered.forEach((pp) => this.initDevice(pp.id));
  };
}
