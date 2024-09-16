import { Aggregate } from '@shared/aggregate';
import { MonoInputDTO } from '@shared/hardware-config/input-config/mono-input-dto';

export class MonoInputAggregate extends Aggregate<MonoInputDTO> {
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
