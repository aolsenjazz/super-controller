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

  toDTO() {
    return {
      ...this.stub(),
      className: this.constructor.name,
      type: 'anonymous' as const,
    };
  }
}
