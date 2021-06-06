import { addListener, PortPair } from '@alexanderolsen/port-manager';
import { MidiValue, MidiMessage } from 'midi-message-parser';

import { InputConfig } from '../hardware-config';
import { Color } from '../driver-types';
import { inputIdFor } from '../device-util';
import { DrivenPortPair } from '../driven-port-pair';
import { windowService } from '../window-service';
import { Project } from '../project';
import { isSustain } from '../util';
import { PortInfo } from './port-info';

import { VirtualPortService } from './virtual-port-service';

export class PortService {
  project: Project;

  portPairs: DrivenPortPair[] = [];

  #virtService: VirtualPortService;

  constructor(project: Project) {
    this.project = project;
    this.#virtService = new VirtualPortService();

    this.initAllDevices();
    addListener(this.onPortsChange);
  }

  initAllDevices() {
    this.portPairs.forEach((pp) => pp.resetLights());
    this.initConfiguredDevices();
  }

  initConfiguredDevices() {
    this.project.devices.forEach((d) => this.initLights(d.id));
  }

  initLights(deviceId: string) {
    this.turnOffLights(deviceId);
    const dev = this.project.getDevice(deviceId);

    if (dev) {
      const inputIds = dev.inputs.map((input) => input.id);
      this.updateLights(deviceId, inputIds);
    }
  }

  turnOffLights(deviceId: string) {
    const pair = this.#getPair(deviceId);
    if (pair) pair.resetLights();
  }

  updateLights(dId: string, iIds: string[]) {
    const dev = this.project.getDevice(dId);
    const pp = this.#getPair(dId);

    if (dev && pp) {
      type Tuple = [InputConfig, Color | undefined];

      iIds
        .map((id) => {
          return dev.getInput(id);
        })
        .filter((i) => i !== undefined)
        .map((i) => [i, i!.currentColor] as Tuple)
        .filter((tuple) => tuple[1] !== undefined) // eslint-disable-line
        .map(([i, c]) => InputConfig.msgFor(i, c))
        .filter((conf) => conf !== undefined)
        .forEach((conf) => pp.send(conf!.toMidiArray()));
    }
  }

  close(id: string) {
    this.turnOffLights(id);
    this.#virtService.close(id);
  }

  /* If device is configured, pass msg to config and respond/propagate */
  #onMessage = (pair: PortPair, msg: MidiValue[]) => {
    const deviceOrNull = this.project.getDevice(pair.id);

    if (deviceOrNull !== null) {
      // device exists. hand to `Device` object, and propagate responses
      const [toDevice, toPropagate] = deviceOrNull.handleMessage(
        msg as MidiValue[]
      );

      if (toPropagate) this.#virtService.send(toPropagate, deviceOrNull.id);
      if (isSustain(msg)) this.#handleSustain(msg, deviceOrNull.shareSustain);
      if (toDevice) pair.send(toDevice);

      const mm = new MidiMessage(msg, 0);
      const id = inputIdFor(mm.number, mm.channel, mm.type);
      windowService.sendInputState(id, toDevice, toPropagate);
    }
  };

  #handleSustain = (msg: MidiValue[], shareWith: string[]) => {
    shareWith.forEach((devId) => {
      const device = this.project.getDevice(devId);

      if (device?.keyboardConfig !== undefined) {
        const mm = new MidiMessage(msg, 0);
        mm.channel = device?.keyboardConfig?.channel;
        this.#virtService.send(mm.toMidiArray(), devId);
      }
    });
  };

  /**
   * Close/open virtual ports as required, set listeners, pass info to frontend,
   * and initialize device backlights
   */
  onPortsChange = (portPairs: PortPair[]) => {
    // pass to portService to open/close corresponding virtual ports
    const filtered = portPairs.filter((pair) => !pair.id.startsWith('SC '));

    this.portPairs = filtered.map((pair) => new DrivenPortPair(pair));
    this.#virtService.onHardwarePortsChange(filtered);

    this.#sendToFrontend(filtered);

    // listen to message from devices
    portPairs.forEach((pair) => {
      pair.onMessage((_delta: number, msg: number[]) =>
        this.#onMessage(pair, msg as MidiValue[])
      );
    });

    this.initAllDevices();
  };

  #sendToFrontend = (portPairs: PortPair[]) => {
    // pass port info to frontend
    const info = portPairs.map(
      (p) => new PortInfo(p.id, p.name, p.occurrenceNumber, true)
    );
    windowService.sendPortInfos(info);
  };

  #getPair = (id: string) => {
    const pairs = this.portPairs.filter((p) => p.id === id);
    return pairs.length === 0 ? null : pairs[0];
  };
}
