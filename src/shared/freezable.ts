/**
 * Base, empty icicle which all `Freezable` classes must provide a subclass for.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseIcicle {
  className: string;
}

/**
 * Objects which implement `Freezable` are serializable such that they can be
 * both saved to disk and passed back and forth in IPC. `Freezable` objects should
 * also implement a strategy to restore the object to its original state
 * (really just deserializing it); the precedent with this project is to implement
 * this functionality within the constructor.
 */
export interface Freezable<T extends BaseIcicle> {
  freeze(): T;
}
