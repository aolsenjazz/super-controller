import { Selectable } from './selectable';
import { FxDriver } from '../driver-types';

export class FxSelectable implements Selectable<FxDriver> {
  fx: FxDriver;

  constructor(fx: FxDriver) {
    this.fx = fx;
  }

  label() {
    return this.fx.title;
  }

  equals(other: FxDriver | string) {
    return typeof other === 'string'
      ? other === this.fx.title
      : other.title === this.fx.title;
  }

  get() {
    return this.fx;
  }
}
