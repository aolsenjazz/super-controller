import BasicOverridePlugin from '../../../plugins/input-plugins/basic-override';
import BacklightControlPlugin from '../../../plugins/input-plugins/backlight-control';
import {
  InputResponse,
  MonoInteractiveDriver,
} from '../../driver-types/input-drivers/mono-interactive-driver';
import { MessageProcessorMeta } from '../../message-processor';
import { MessageTransport } from '../../message-transport';
import { PluginProvider } from '../../plugin-provider';

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

  readonly value?: MidiNumber;
};

export abstract class MonoInputConfig<
  T extends InputDefault = InputDefault,
  U extends MonoInputDTO = MonoInputDTO,
  V extends MonoInteractiveDriver = MonoInteractiveDriver
> extends BaseInputConfig<U, V> {
  public abstract defaults: T;

  constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: V
  ) {
    super(deviceId, nickname, driver, plugins);
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

  public getPlugins() {
    return this.plugins;
  }

  public initDefaultPlugins(provider: PluginProvider) {
    if (this.driver.availableColors.length > 0) {
      const backlightPlugin = new BacklightControlPlugin(
        this.qualifiedId,
        this.driver
      );

      provider.register(backlightPlugin.id, backlightPlugin);
      this.plugins.push(backlightPlugin.id);
    }

    const basicOverride = new BasicOverridePlugin(
      this.qualifiedId,
      this.driver
    );

    provider.register(basicOverride.id, basicOverride);
    this.plugins.push(basicOverride.id);
  }

  public toDTO() {
    return {
      ...super.toDTO(),
      defaults: this.defaults,
      colorCapable: false,
      plugins: this.plugins,
    };
  }
}
