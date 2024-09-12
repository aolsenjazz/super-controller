import { Aggregate } from '@shared/aggregate';
import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-icicle';

export class MonoInputAggregate extends Aggregate<MonoInputIcicle> {
  public get type() {
    return this.groupValue((e) => e.type);
  }

  public get outputResponse() {
    return this.groupValue((i) => i.defaults.response);
  }

  public get statusString() {
    return this.groupValue((i) => i.defaults.statusString);
  }

  public get channel() {
    return this.groupValue((i) => i.defaults.channel);
  }

  public get number() {
    return this.groupValue((i) => i.defaults.number);
  }
}
