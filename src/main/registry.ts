/**
 * `DeviceConfig`, `InputConfig`, and `Plugin`s are all managed via registries
 * in the backend.
 */
export class Registry<T extends { id: string }> {
  private items: Map<string, T>;

  constructor() {
    this.items = new Map<string, T>();
  }

  register(item: T): void {
    this.items.set(item.id, item);
  }

  deregister(item: T | string): void {
    const id = typeof item === 'string' ? item : item.id;
    this.items.delete(id);
  }

  get<U extends T = T>(id: string): U | undefined {
    return this.items.get(id) as U | undefined;
  }

  getAll<U extends T = T>(): U[] {
    return Array.from(this.items.values()) as U[];
  }

  clear(): void {
    this.items.clear();
  }
}
