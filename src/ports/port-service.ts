import { addListener, PortPair, all } from '@alexanderolsen/port-manager';
import { MidiValue, MidiMessage } from 'midi-message-parser';

import { InputConfig } from '../hardware-config';
import { Color } from '../driver-types';
import { inputIdFor, msgForColor } from '../device-util';
import { DrivenPortPair } from '../driven-port-pair';
import { windowService } from '../window-service';
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
  project: Project;

  /* List of available port pairs */
  portPairs: DrivenPortPair[] = [];

  /* See `VirtualPortService` */
  #virtService: VirtualPortService;

  constructor(project: Project) {
    this.project = project;
    this.#virtService = new VirtualPortService();

    this.initAllDevices();
    addListener(this.onPortsChange);
    this.onPortsChange(all());
  }

  /**
   * Returns all connected devices to their default state, then applies lights configs.
   *
   * TODO: I don't like that we're automatically running control sequences. should really only
   * be run if the device is configured in project
   */
  initAllDevices() {
    this.portPairs.forEach((pp) => {
      pp.runControlSequence();
      pp.resetLights();
    });
    this.initConfiguredDevices();
  }

  /* Applies light configs to connected devices */
  initConfiguredDevices() {
    this.project.devices.forEach((d) => this.initLights(d.id));
  }

  /**
   * Turns off all lights on device, then applies light configs
   *
   * @param deviceId The id of the device
   */
  initLights(deviceId: string) {
    this.turnOffLights(deviceId);
    const dev = this.project.getDevice(deviceId);

    if (dev && dev.supported) {
      const inputIds = dev.inputs.map((input) => input.id);
      this.updateLights(deviceId, inputIds);
    }
  }

  /**
   * Turns off all lights on the device
   *
   * @param deviceId The id of the device
   */
  turnOffLights(deviceId: string) {
    const pair = this.#getPair(deviceId);
    if (pair) pair.resetLights();
  }

  /**
   * Synchronize device hardware color with InputConfig.currentColor for all ids
   *
   * @param dId The id of the device
   * @param iIds The list of input ids to sync
   */
  updateLights(dId: string, iIds: string[]) {
    const dev = this.project.getDevice(dId);
    const pp = this.#getPair(dId);

    if (dev && pp && dev.supported) {
      type Tuple = [InputConfig, Color | undefined];

      iIds
        .map((id) => dev.getInput(id)) // get the InputConfig
        .filter((i) => i !== undefined) // filter undefined
        .map((i) => [i, i!.currentColor] as Tuple) // get current color
        .filter((tuple) => tuple[1] !== undefined) // eslint-disable-line
        .map(([i, c]) => msgForColor(i.default.number, i.default.channel, c)) // get message for color
        .filter((conf) => conf !== undefined) // filter undefined
        .forEach((conf) => pp.send(conf!.toMidiArray())); // send color message
    }
  }

  /**
   * Turn off all lights (if disconnected, does nothing) and close virtual port
   *
   * @param id The device id
   */
  close(id: string) {
    this.turnOffLights(id);
    this.#virtService.close(id);
  }

  /**
   * 1. If device is configured, pass msg to config and respond/propagate.
   * 2. If sustain event, send sustain events for all devices in config.shareSustain
   * 3. Sync state with frontend
   *
   * @param pair The input+output ports for device
   * @param msg The message from the device
   */
  #onMessage = (pair: PortPair, msg: MidiValue[]) => {
    const deviceOrNull = this.project.getDevice(pair.id);

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
      windowService.sendInputState(id, toDevice, toPropagate);
      windowService.onDeviceMessage(deviceOrNull.id, msg);
    }
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
      const device = this.project.getDevice(devId);

      if (device?.keyboardDriver !== undefined) {
        const mm = new MidiMessage(msg, 0);
        mm.channel = device?.keyboardDriver?.channel;
        this.#virtService.send(mm.toMidiArray(), devId);
      }
    });
  };

  /**
   * Close/open virtual ports as required, set listeners, pass info to frontend,
   * and initialize device backlights
   *
   * @param portPairs The new list of port pairs
   */
  onPortsChange = (portPairs: PortPair[]) => {
    // Filter out SuperController-created ports.
    const filtered = portPairs.filter((pair) => !pair.id.startsWith('SC '));
    this.portPairs = filtered.map((pair) => new DrivenPortPair(pair));

    // pass to virtualPortService to open/close corresponding virtual ports
    this.#virtService.onHardwarePortsChange(filtered);

    this.sendToFrontend();

    // listen to message from devices
    portPairs.forEach((pair) => {
      pair.onMessage((_delta: number, msg: number[]) =>
        this.#onMessage(pair, msg as MidiValue[])
      );
    });

    this.initAllDevices();
  };

  /* Pass current list of `PortPair`s to the front end */
  sendToFrontend() {
    // pass port info to frontend
    const info = this.portPairs.map(
      (p) => new PortInfo(p.id, p.name, p.occurrenceNumber, true)
    );

    windowService.sendPortInfos(info);
  }

  /**
   * Gets the given `PortPair` by id
   *
   * @param { string } id The requested PortPair id
   * @return { PortPair | null }
   */
  #getPair = (id: string) => {
    const pairs = this.portPairs.filter((p) => p.id === id);
    return pairs.length === 0 ? null : pairs[0];
  };
}
