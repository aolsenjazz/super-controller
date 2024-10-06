import { PadDriver } from '../../driver-types';
import { MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';

export class PadConfig extends MonoInputConfig {
  defaultValue?: MidiNumber;

  static fromDriver(deviceId: string, d: PadDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    return new PadConfig(deviceId, '', [], def);
  }

  public get state() {
    return {};
  }

  public toDTO(): MonoInputDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
    };
  }

  get type() {
    return 'pad' as const;
  }
}
