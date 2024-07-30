import { Aggregate } from '@shared/aggregate';
import { InputIcicle } from '@shared/hardware-config/input-config/base-input-config';

export class InputAggregate extends Aggregate<InputIcicle> {
  public get type() {
    return this.groupValue((e) => e.type);
  }
}
