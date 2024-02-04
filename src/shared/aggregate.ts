/**
 * Aggregate used to show the values of multiple entities in a group. Provides functions
 * to get the aggregate value, along with with functions to describe the aggregate value,
 * e.g. `isDefaultValue`, `labelFor`
 */
export abstract class Aggregate<K> {
  protected entities: K[];

  constructor(entities: K[]) {
    this.entities = entities;
  }

  /**
   * Returns whether or not the given fieldValue is equal to the default value for
   * every entitiy in the aggregate, where each entity's default value
   * is accessed via the `defaultGetter` param
   */
  protected isDefaultValue<T>(fieldValue: T, defaultGetter: (input: K) => T) {
    const nonDefaultValues = this.entities.filter(
      (i) => defaultGetter(i) !== fieldValue
    );
    return nonDefaultValues.length === 0;
  }

  /**
   * If `fieldValue` is the default value for all of the entities in the
   * aggregate, returns a string formatted `${fieldValue} [default]`. Otherwise, simply
   * returns `${fieldValue}`
   */
  protected labelFor<T>(fieldValue: T, defaultGetter: (input: K) => T) {
    const isDefault = this.isDefaultValue(fieldValue, defaultGetter);
    return `${fieldValue}${isDefault ? ' [default]' : ''}`;
  }

  /**
   * Returns a value of type T which represents the value for all entities in
   * the aggregate. The field being accessed is determined
   * by `getterFn` while equality between individual values is determined with
   * `equalityFn`
   *
   * @param getterFn Returns the value being retrieve from entities
   * @param equalityFn Returns whether the values are equal
   * @returns A value representing all of the values in the group
   */
  protected groupValue<T>(
    getterFn: (config: K) => T,
    equalityFn: (a: T, b: T) => boolean = (a, b) => a === b
  ): '<multiple values>' | T {
    const vals = this.entities.map(getterFn);
    const allMatch = vals.filter((v) => !equalityFn(v, vals[0])).length === 0;

    return allMatch ? vals[0] : '<multiple values>';
  }

  /**
   * Returns the intersection of the array field, accessed via `getterFn`, for all
   * entities within this aggregate. If needed, `transform` function can be used to transform
   * the compared values, while still returning type T. E.g:
   *
   * ```
   * class Foo { bars: Bar[] }
   * class Bar { member: string }
   *
   * getIntersection((a: Foo) => a.bars, (b: Bar) => b.member)
   * ```
   */
  protected getIntersection<T>(
    getterFn: (i: K) => T[],
    transform: (a: T) => unknown = (a: T) => a
  ) {
    const arrays = this.entities.map((e) => getterFn(e));
    const transformed = arrays.map((arr) => arr.map((e) => transform(e)));

    const result = transformed.reduce((a: unknown[], b: unknown[]) =>
      a.filter((c) => b.includes(c))
    );

    return Array.from(
      new Set(
        arrays.flat().filter((e: T) => {
          return result.includes(transform(e));
        })
      )
    );
  }
}
