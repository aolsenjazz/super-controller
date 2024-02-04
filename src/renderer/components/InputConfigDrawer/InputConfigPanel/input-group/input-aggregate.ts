import { Aggregate } from '@shared/aggregate';
import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-config';

export class InputAggregate extends Aggregate<MonoInputIcicle> {
  public get homogenous() {
    if (this.entities.length === 1) return true;
    return (
      this.entities.filter((c) => ['xy', 'switch'].includes(c.type)).length ===
      0
    );
  }

  public get homogenousPluginAggregates() {
    const minPlugins = Math.min(...this.entities.map((e) => e.plugins.length));
    Array.from(Array(minPlugins).keys()).map((n) => {
      const getter = (e: MonoInputIcicle) => e.plugins[n].title;
      const sameTitle = this.groupValue(getter) !== '<multiple values>';

      if (sameTitle === true && this.entities[0].plugins[n].aggregateCapable) {
      }
    });
  }
}
