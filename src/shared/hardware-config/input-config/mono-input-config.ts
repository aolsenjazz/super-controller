import { MidiArray } from '../../midi-array';
import { OverrideablePropagator } from '../../propagators';
import { InputResponse } from '../../driver-types';
import { BaseInputConfig, InputConfigStub } from './base-input-config';

export interface MonoInputConfigStub extends InputConfigStub {
  defaults: InputDefault;
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

export abstract class MonoInputConfig extends BaseInputConfig {
  defaults: InputDefault;

  outputPropagator: OverrideablePropagator<InputResponse, InputResponse>;

  #nickname?: string;

  constructor(
    defaultVals: InputDefault,
    outputPropagator: OverrideablePropagator<InputResponse, InputResponse>,
    nickname?: string
  ) {
    super();

    this.defaults = defaultVals;
    this.outputPropagator = outputPropagator;
    this.#nickname = nickname;
  }

  applyStub(s: MonoInputConfigStub) {
    this.response = s.outputResponse;
    this.statusString = s.statusString;
    this.channel = s.channel;
    this.number = s.number;
    this.value = s.value || 0;
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    return this.outputPropagator.handleMessage(msg);
  }

  restoreDefaults() {
    this.response = this.defaults.response;
    this.statusString = this.defaults.statusString;
    this.channel = this.defaults.channel;
    this.number = this.defaults.number;
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
