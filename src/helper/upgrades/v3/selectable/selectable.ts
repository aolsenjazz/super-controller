export interface Selectable<T> {
  equals(other: T | string): boolean;
  get(): T;
  label(): string;
}
