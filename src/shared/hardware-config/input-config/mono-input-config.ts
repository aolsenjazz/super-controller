import { MessageTransport } from '@shared/message-transport';
import {
  byteToStatusString,
  idForMsg,
  NOTE_OFF,
  NOTE_ON,
} from '@shared/midi-util';
import { PluginProvider } from '@shared/plugin-provider';
import type { InputResponse } from '../../driver-types';
import { BaseInputConfig } from './base-input-config';
import { MonoInputDTO } from './mono-input-dto';

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
  K extends MonoInputDTO = MonoInputDTO
> extends BaseInputConfig<K> {
  defaults: T;

  public plugins: string[];

  constructor(nickname: string, plugins: string[], defaultVals: T) {
    super(nickname);

    this.plugins = plugins;
    this.defaults = defaultVals;
  }

  public isOriginator(msg: NumberArrayWithStatus) {
    if ([2, 3].includes(msg.length)) {
      const statusNibble = (msg[0] & 0xf0) as StatusByte;
      const statusString = byteToStatusString(statusNibble);
      const channel = (msg[0] & 0x0f) as Channel;
      const noteOnOffMatch =
        this.defaults.statusString === 'noteon/noteoff' &&
        [NOTE_OFF, NOTE_ON].includes(statusNibble);

      return (
        (noteOnOffMatch || statusString === this.defaults.statusString) &&
        channel === this.defaults.channel &&
        msg[1] === this.defaults.number
      );
    }

    return this.id === idForMsg(msg, true);
  }

  public applyStub(s: K) {
    super.applyStub(s);

    this.plugins = s.plugins;
  }

  public init(
    loopbackTransport: MessageTransport,
    pluginProvider: PluginProvider
  ) {
    this.plugins
      .map((id) => pluginProvider.get(id))
      .forEach((p) => p?.init(loopbackTransport));
  }

  public toDTO() {
    return {
      ...super.toDTO(),
      defaults: this.defaults,
      colorCapable: false,
      plugins: this.plugins,
    };
  }

  public handleMessage(
    msg: NumberArrayWithStatus
  ): NumberArrayWithStatus | undefined {
    // TODO:
    return msg;
  }

  public get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;
    const n = this.defaults.number;

    return `${ss}.${c}.${n}`;
  }
}
