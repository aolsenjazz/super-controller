import { Selectable } from './selectable';

export class UnsetSelectable implements Selectable<string> {
  label() {
    return 'unset';
  }

  equals(other: string) {
    return other === 'unset';
  }

  get() {
    return 'unset';
  }
}
