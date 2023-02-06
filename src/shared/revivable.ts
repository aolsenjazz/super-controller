/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint @typescript-eslint/no-unused-vars: 0 */

interface Revivable {
  toJSON(): {
    name: string;
    args: any[];
  };
}

type Constructor<T> = {
  new (...args: any[]): T;
  readonly prototype: T;
};

const implementations: Constructor<Revivable>[] = [];

export function GetImplementations(): Constructor<Revivable>[] {
  return implementations;
}
export function register<T extends Constructor<Revivable>>(ctor: T) {
  implementations.push(ctor);
  return ctor;
}
