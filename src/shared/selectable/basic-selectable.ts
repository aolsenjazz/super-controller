import { Selectable } from './selectable';

export class BasicSelectable<T> implements Selectable<T> {
  #value: T;

  #l: string;

  constructor(value: T, label?: string) {
    this.#value = value;

    this.#l = label || `${value}`;
  }

  label() {
    return this.#l;
  }

  equals(other: T | string) {
    return this.#value === other;
  }

  get() {
    return this.#value;
  }
}
