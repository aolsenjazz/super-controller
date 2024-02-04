// eslint-disable-next-line max-classes-per-file
import { Aggregate } from '@shared/aggregate';

class Bar {
  baz: string;

  constructor(baz: string) {
    this.baz = baz;
  }
}

class Foo {
  stringMember: string;

  arrayMember: string[];

  objectArrayMember: Bar[];

  constructor(strMem: string, arrMem: string[], objectArrayMem: Bar[]) {
    this.stringMember = strMem;
    this.arrayMember = arrMem;
    this.objectArrayMember = objectArrayMem;
  }
}

class FooAggregate extends Aggregate<Foo> {
  constructor() {
    const foos = ['abc', 'bcd', 'cde'].map(
      (s) =>
        new Foo(
          s,
          [...s],
          [...s].map((s2) => new Bar(s2))
        )
    );

    super(foos);
  }

  getArrayMemberIntersection() {
    const getter = (f: Foo) => f.arrayMember;
    return this.getIntersection(getter);
  }

  getBarIntersection() {
    const getter = (f: Foo) => f.objectArrayMember;
    const transform = (b: Bar) => b.baz;
    return this.getIntersection(getter, transform);
  }
}

describe('getIntersection', () => {
  test('gets intersection of simple object arrays', () => {
    const fa = new FooAggregate();
    const intersection = fa.getArrayMemberIntersection();

    expect(intersection).toEqual(['c']);
  });

  test('gets intersection of complex object arrays using transform', () => {
    const fa = new FooAggregate();
    const intersection = fa.getBarIntersection();

    expect(intersection.length).toBe(3);
    expect(intersection[0].baz).toBe('c');
  });
});
