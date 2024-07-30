import { Selectable } from './selectable';

export class MultipleValuesSelectable implements Selectable<string> {
  label() {
    return '<multiple values>';
  }

  equals(other: string) {
    return other === '<multiple values>';
  }

  get() {
    return '<multiple values>';
  }
}
