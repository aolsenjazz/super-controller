/**
 * `DeviceConfig`, `InputConfig`, and `Plugin`s are all managed via registries
 * in the backend.
 */
export class Registry<V, T extends { id: string; toDTO: () => V }> {
  private items: Map<string, T>;

  public constructor() {
    this.items = new Map<string, T>();
  }

  public register(key: string, item: T): void {
    this.items.set(key, item);
  }

  public deregister(item: T | string): void {
    const id = typeof item === 'string' ? item : item.id;
    this.items.delete(id);
  }

  public get<U extends T = T>(id: string): U | undefined {
    return this.items.get(id) as U | undefined;
  }

  public getAll<U extends T = T>(): U[] {
    return Array.from(this.items.values()) as U[];
  }

  public clear(): void {
    this.items.clear();
  }

  public toSerializable(): Record<string, V> {
    return Object.fromEntries(
      Array.from(this.items.entries()).map(([key, value]) => [
        key,
        value.toDTO(),
      ])
    );
  }
}
