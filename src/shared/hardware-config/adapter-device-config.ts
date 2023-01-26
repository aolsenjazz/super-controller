import { SupportedDeviceConfig } from './supported-device-config';

export class AdapterDeviceConfig implements SupportedDeviceConfig {
  isAdapter = true;

  name: string;

  supported = true;

  siblingIndex: number;

  child?: SupportedDeviceConfig;

  constructor(
    name: string,
    siblingIndex: number,
    child?: SupportedDeviceConfig
  ) {
    this.name = name;
    this.siblingIndex = siblingIndex;
    this.child = child;
  }

  setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  get isSet() {
    return this.child !== undefined;
  }

  bindingAvailable(
    eventType: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel
  ) {
    return this.child!.bindingAvailable(eventType, number, channel);
  }

  handleMessage(msg: number[]): (number[] | null)[] {
    return this.child!.handleMessage(msg);
  }

  get inputs() {
    return this.child!.inputs;
  }

  get shareSustain() {
    return this.child!.shareSustain;
  }

  get nickname() {
    return this.child!.nickname;
  }

  set nickname(nickname: string) {
    this.child!.nickname = nickname;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
  }

  shareWith(id: string) {
    return this.child!.shareWith(id);
  }

  stopSharing(id: string) {
    return this.child!.stopSharing(id);
  }

  sharingWith(id: string) {
    return this.child!.sharingWith(id);
  }

  /**
   * Get an input by id
   *
   * @param id The ID of the requested input
   * @returns
   */
  getInput(id: string) {
    return this.child!.getInput(id);
  }

  toJSON(saveState: boolean) {
    return JSON.stringify({
      isAdapter: true,
      name: this.name,
      siblingIndex: this.siblingIndex,
      child:
        this.child !== undefined ? this.child.toJSON(saveState) : undefined,
    });
  }

  /* eslint-disable-next-line */
  static fromParsedJSON(obj: any) {
    let child;

    if (obj.child) {
      child = JSON.parse(obj.child);
      child = SupportedDeviceConfig.fromParsedJSON(child);
    }

    return new AdapterDeviceConfig(obj.name, obj.siblingIndex, child);
  }
}
