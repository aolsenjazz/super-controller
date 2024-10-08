import {
  InputResponse,
  MonoInteractiveDriver,
} from '../../driver-types/input-drivers/mono-interactive-driver';
import { MessageProcessorMeta } from '../../message-processor';
import { MessageTransport } from '../../message-transport';
import {
  byteToStatusString,
  idForMsg,
  NOTE_OFF,
  NOTE_ON,
} from '../../midi-util';
import { PluginProvider } from '../../plugin-provider';
import { getQualifiedInputId } from '../../util';

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
  U extends MonoInputDTO = MonoInputDTO,
  V extends MonoInteractiveDriver = MonoInteractiveDriver
> extends BaseInputConfig<U> {
  public abstract defaults: T;

  public plugins: string[];

  constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: V
  ) {
    super(deviceId, nickname, driver);

    this.plugins = plugins;
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

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    let message = msg;

    for (let i = 0; i < this.plugins.length; i++) {
      const plugin = meta.pluginProvider.get(this.plugins[i]);
      if (plugin && plugin.on === true) {
        const toPropagate = plugin.process(message, meta);
        if (toPropagate === undefined) return undefined;
        message = toPropagate;
      }
    }

    return message;
  }

  public applyStub(s: U) {
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

  public get qualifiedId() {
    return getQualifiedInputId(this.deviceId, this.id);
  }
}
