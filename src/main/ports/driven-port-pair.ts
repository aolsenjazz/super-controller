import { MidiMessage } from 'midi-message-parser';

import { DeviceDriver } from '@shared/driver-types';

import { PortPair } from './port-pair';
import { DRIVERS } from '../drivers';

/**
 * PortPair with an attached driver. Useful so that we can reset the lights
 * on devices to their initial state without having to know a device's configuration
 * (if it has any).
 */
export class DrivenPortPair extends PortPair {
  /* The actual PortPair */
  #pair: PortPair;

  /* The related driver, if any */
  driver?: DeviceDriver;

  constructor(pair: PortPair) {
    super(pair.iPort, pair.oPort);
    this.#pair = pair;
    this.driver = DRIVERS.get(pair.name);
  }

  /* Reset all of the lights on the device to their initial state. */
  resetLights() {
    const d = this.driver;

    if (d === undefined) return;

    d.inputGrids
      .map((ig) => ig.inputs)
      .flat()
      .forEach((input) => {
        const defaultColor = input.availableColors.filter((c) => c.default)[0];

        if (defaultColor) {
          const mm = new MidiMessage(
            defaultColor.eventType,
            input.default.number,
            defaultColor.value,
            input.default.channel,
            0
          );

          this.#pair.send(mm.toMidiArray());
        }
      });
  }

  /**
   * Sends a sequence of MIDI messages to the device in order to gain control of its
   * lights. This sequence of messages is the same sequence sent by Ableton in order
   * to put devices into Control Surface mode. Not all devices require a control
   * sequence in order to relinquish control of lights.
   */
  runControlSequence() {
    if (this.driver) {
      this.driver.controlSequence?.forEach((msgArray) => {
        const mm = new MidiMessage(...msgArray, 0);
        this.#pair.send(mm.toMidiArray());
      });
    }
  }
}
