import { PluginIcicle } from '@plugins/base-plugin';
import { Aggregate } from '@shared/aggregate';

export class PluginAggregate extends Aggregate<PluginIcicle> {
  get on() {
    return this.groupValue((p) => p.on);
  }

  get title() {
    return this.groupValue((p) => p.title);
  }
}
