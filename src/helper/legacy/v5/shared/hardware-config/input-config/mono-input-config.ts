import {
  create,
  MidiArray,
  ThreeByteMidiArray,
  TwoByteMidiArray,
} from '../../midi-array';
import { OverrideablePropagator } from '../../propagators';
import { InputResponse } from '../../driver-types';
import { BaseInputConfig, InputConfigStub } from './base-input-config';

export interface MonoInputConfigStub<T extends InputDefault = InputDefault>
  extends InputConfigStub {
  defaults: T;
  colorCapable: boolean;
  statusString: StatusString | 'noteon/noteoff';
  outputResponse: InputResponse;
  channel: Channel;
  number: MidiNumber;
  value?: MidiNumber;
}

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly statusString: StatusString | 'noteon/noteoff';

  /* See InputResponse */
  readonly response: InputResponse;
};

export abstract class MonoInputConfig<
  T extends InputDefault = InputDefault,
> extends BaseInputConfig {
  defaults: T;

  outputPropagator: OverrideablePropagator<InputResponse, InputResponse>;

  #nickname?: string;

  constructor(
    defaultVals: T,
    outputPropagator: OverrideablePropagator<InputResponse, InputResponse>,
    nickname?: string,
  ) {
    super();

    this.defaults = defaultVals;
    this.outputPropagator = outputPropagator;
    this.#nickname = nickname;
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    const ma = msg instanceof MidiArray ? msg : create(msg);

    if (ma instanceof TwoByteMidiArray || ma instanceof ThreeByteMidiArray) {
      const noteOnOffMatch =
        this.defaults.statusString === 'noteon/noteoff' &&
        ma.statusString.includes('note');

      return (
        (noteOnOffMatch || ma.statusString === this.defaults.statusString) &&
        ma.channel === this.defaults.channel &&
        ma.number === this.defaults.number
      );
    }

    return this.id === ma.asString(true);
  }

  applyStub(s: MonoInputConfigStub) {
    this.response = s.outputResponse;
    this.statusString = s.statusString;
    this.channel = s.channel;
    this.number = s.number;
    this.value = s.value || 0;

    if (s.statusString === 'programchange') {
      this.response = 'constant';
    }
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    return this.outputPropagator.handleMessage(msg);
  }

  get statusString(): StatusString | 'noteon/noteoff' {
    return this.outputPropagator.statusString;
  }

  set statusString(statusString: StatusString | 'noteon/noteoff') {
    this.outputPropagator.statusString = statusString;
  }

  get channel() {
    return this.outputPropagator.channel;
  }

  set channel(channel: Channel) {
    this.outputPropagator.channel = channel;
  }

  get number() {
    return this.outputPropagator.number;
  }

  set number(number: MidiNumber) {
    this.outputPropagator.number = number;
  }

  get value(): MidiNumber {
    return this.outputPropagator.value;
  }

  set value(value: MidiNumber) {
    this.outputPropagator.value = value;
  }

  get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;
    const n = this.defaults.number;

    return `${ss}.${c}.${n}`;
  }

  get nickname() {
    return this.#nickname || `Input ${this.number}`;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }

  abstract get response(): InputResponse;

  abstract set response(response: InputResponse);
}
