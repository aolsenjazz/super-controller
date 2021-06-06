import { PortPair, Port } from '@alexanderolsen/port-manager';
import { MidiMessage } from 'midi-message-parser';

import { DeviceDriver } from './driver-types';
import { DRIVERS } from './drivers';

export class DrivenPortPair implements PortPair {
  #pair: PortPair;

  driver?: DeviceDriver;

  constructor(pair: PortPair) {
    this.#pair = pair;
    this.driver = DRIVERS.get(pair.name);

    this.iPort = pair.iPort;
    this.oPort = pair.oPort;
    this.open = pair.open;
    this.close = pair.close;
    this.send = pair.send;
    this.onMessage = pair.onMessage;
    /* eslint-disable-next-line */
    this._equals = pair._equals;
    this.id = pair.id;
    this.occurrenceNumber = pair.occurrenceNumber;
    this.hasInput = pair.hasInput;
    this.hasOutput = pair.hasOutput;
    this.name = pair.name;
  }

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

  id: string;

  occurrenceNumber: number;

  hasInput: boolean;

  hasOutput: boolean;

  name: string;

  iPort: null | Port;

  oPort: null | Port;

  open: () => void;

  close: () => void;

  send: (msg: number[]) => void;

  onMessage: (cb: (delta: number, msg: number[]) => void) => void;

  _equals: (other: PortPair) => boolean;
}
