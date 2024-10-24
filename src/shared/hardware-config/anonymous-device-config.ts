import TranslatorPlugin from '../../plugins/device-plugins/translator';
import { PluginProvider } from '../plugin-provider';
import { DeviceConfig } from './device-config';

export class AnonymousDeviceConfig extends DeviceConfig {
  constructor(
    portName: string,
    siblingIndex: number,
    nickname?: string,
    plugins: string[] = []
  ) {
    super(portName, 'Anonymous', siblingIndex, nickname, plugins);
  }

  public applyOverrides(mArray: NumberArrayWithStatus) {
    return mArray;
  }

  public getResponse() {
    return undefined;
  }

  public init() {
    // no-op
  }

  public initDefaultPlugins(provider: PluginProvider) {
    if (this.plugins.length > 0)
      throw new Error('plugins have already be initialized!');

    const translator = new TranslatorPlugin(this.id);
    provider.register(translator.id, translator);
    this.plugins.push(translator.id);
  }

  toDTO() {
    return {
      ...this.stub(),
      className: this.constructor.name,
      type: 'anonymous' as const,
    };
  }
}
