import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { Aggregate } from '@shared/aggregate';

export class PluginAggregate extends Aggregate<PluginDTO> {
  get on() {
    return this.groupValue((p) => p.on);
  }

  get title() {
    return this.groupValue((p) => p.title);
  }

  get aggregateCapable() {
    return this.groupValue((p) => p.aggregateCapable);
  }
}
