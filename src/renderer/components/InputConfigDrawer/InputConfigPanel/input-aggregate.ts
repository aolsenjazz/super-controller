import { Aggregate } from '@shared/aggregate';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';

export class InputAggregate extends Aggregate<InputDTO> {
  public get type() {
    return this.groupValue((e) => e.type);
  }
}
