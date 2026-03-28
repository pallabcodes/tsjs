// ## by using mapped types make some property (not all) optional conditionally
class ImplementationType {}

type Definition = {
  name: string;
  defaultImplementation?: ImplementationType;
};

type DefinitionMap = Record<string, Definition>;

/*
 * obj1 = { foo : {name: "John" }} // here defaultImplementation not required
 * obj1 = { foo : {name: "John" }} // here defaultImplementation is optional
 *
 * */

// can ImplementationType extend {defaultImplementation: ImplementationType} = "false"
// type Show = ImplementationType extends {defaultImplementation: ImplementationType} ? "true" : "false";

// type Show2<K> = K extends keyof Definition ? Definition[K] : never;

// type KeyHere = Show2<"defaultImplementation">; // ImplementationType,
// type KeyHere = Show2<"name">; // string,

type NonImplementedKeys<T extends DefinitionMap> = {
  // since a blank T[K] i.e. {}/ ImplementationType doesn't extend { defaultImplementation: ImplementationType };
  // so then it will return K i.e. "defaultImplementation"

  // so , after all done it is { name: "name", defaultImplementation: "defaultImplementation"} and then keyof T
  // "name" | "defaultImplementation"

  [K in keyof T]: T[K] extends { defaultImplementation: ImplementationType } ? never : K;
}[keyof T];

type A = { id: number };
type B = { id: number };

type AB = {
  // take the common property from A & B then take its value by type (A & B)[K]
  [K in keyof A & B]: (A & B)[K];
};

type NiceIntersection<S, T> = { [K in keyof (S & T)]: (S & T)[K] };

type ImplementationMap<T extends DefinitionMap> = NiceIntersection<
  { [K in NonImplementedKeys<T>]: ImplementationType },
  { [K in keyof T]?: ImplementationType }
>;

type DefinitionMapExample = {
  foo: { name: "x" };
  bar: {
    name: "y";
    defaultImplementation: {
      /*...*/
    };
  };
};

// {foo: ImplementationType, bar?: ImplementationType | undefined}
type ImplementationMapExample = ImplementationMap<DefinitionMapExample>;

// alternative

// Gets the keys of T whose values are assignable to V
type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

type ImplementationMap_<T extends DefinitionMap> =
  // A partial (all properties are optional) record for all the keys
  Partial<Record<keyof T, ImplementationType>> &
    // Require ImplementationType for all the keys that do not have defaultImplementation
    Record<KeysMatching<T, { defaultImplementation?: undefined }>, ImplementationType>;

/*
Test is equivalent to
{
  foo: ImplementationType,
  bar?: ImplementationType,
  baz: ImplementationType
}
*/
type Test = ImplementationMap_<{
  foo: { name: "x" };
  bar: {
    name: "y";
    defaultImplementation: {
      /*...*/
    };
  };
  baz: { name: "z"; defaultImplementation: undefined };
}>;

// another with the same: make some property optional conditionally by using mapped types
type Strong<T> = { __phantom?: T; marker: "strong" };
type Weak<T> = { __phantom?: T; marker: "weak" };
// helper functions, to be used later
function strong<T>(): Strong<T> {
  return { marker: "strong" };
}
function weak<T>(): Weak<T> {
  return { marker: "weak" };
}

// input type for my function
type Rec = { [index: string]: Strong<unknown> | Weak<unknown> };

// helper types
type OptionalPropertyNames<T> = {
  [K in keyof T]: T[K] extends Weak<any> ? K : never;
}[keyof T];
type RequiredPropertyNames<T> = {
  [K in keyof T]: T[K] extends Weak<any> ? never : K;
}[keyof T];

// output type for my function
type Unified<T extends Rec> = {
  [K in OptionalPropertyNames<T>]?: T[K] extends Weak<infer I> ? I : never;
} & {
  [K in RequiredPropertyNames<T>]: T[K] extends Strong<infer I> ? I : never;
};

function unify<T extends Rec>(input: T): Strong<Unified<T>> {
  // implementation is irrelevant now
  return {} as any;
}

// when we have the Strong value, we can 'unbox' the type
type Unboxed<T> = T extends Strong<infer I> ? I : never;

const unified = unify({ strong: strong<string>(), weak: weak<string>() });

// now this compiles...
const valid: Array<Unboxed<typeof unified>> = [{ strong: "" }, { strong: "", weak: "" }];

// ...and this do not
// const invalid: Array<Unboxed<typeof unified>> = [{}, { weak: "" }, { unknown: "" }];

// ------------------------------------------------------------------------------------------------------------

// ## Typescript conditional mapped type with multiple conditions

type Id<T extends HandlerBase<any>> = string & { __type: T };

class HandlerBase<T extends HandlerBase<T>> {}

class HandlerA extends HandlerBase<HandlerA> {
  str!: string;
  b!: Id<HandlerB>;
  bArr!: Id<HandlerB>[];
}

class HandlerB extends HandlerBase<HandlerA> {}

type DenormalizedHandler<T> = {
  [P in keyof T]: T[P] extends Id<infer U>
    ? DenormalizedHandler<U>
    : T[P] extends Array<Id<infer U>>
    ? Array<DenormalizedHandler<U>>
    : T[P];
};

// const handler: DenormalizedHandler<HandlerA> = undefined;
// handler.str; // Is string
// handler.b; // Is DenormalizedHandler<HandlerB>
// handler.bArr; // Is DenormalizedHandler<HandlerB>[]

// ------------------------------------------------------------------------------------------------------------

// ## by using mapped type make some properties optional if specific condition is met

type OptionalArrays<T> = {
  [key in keyof T as T[key] extends Array<any> ? key : never]?: T[key];
} & {
  [key in keyof T as T[key] extends Array<any> ? never : key]: T[key];
};

interface Example {
  foo: string[];
  bar: number;
}

type Example2 = OptionalArrays<Example>;
/*
type Example2 = {
    foo?: string[] | undefined;
} & {
    bar: number;
}
*/

// alternative

type ArrayKeys<T> = {
  [key in keyof T]: T[key] extends Array<any> ? key : never;
}[keyof T];

type OptionalArrays_<T> = Omit<T, ArrayKeys<T>> & // get one type without array keys
  Partial<Pick<T, ArrayKeys<T>>>; // get one type with array keys as optional

interface Example {
  foo: string[];
  bar: number;
}

type Example2_ = OptionalArrays<Example>;

const value1: Example2_ = {
  foo: [],
  bar: 3,
};

const value2: Example2_ = {
  foo: undefined,
  bar: 3,
};

// ------------------------------------------------------------------------------------------------------------

// ## filter out just the "readonly properties" when using mapped types
// interface I1 {
//   readonly n: number;
//   s: string;
// }

// now based on I1 make an interface that will look like this = interface I2 {s: string}

// type Writable<T> = Pick<T, { [P in keyof T]-?: (<U>() => U extends { [Q in P]: T[P] } ? 1 : 2) extends <U>() => U extends { -readonly [Q in P]: T[P] } ? 1 : 2 ? P : never; }[keyof T] >;
//
// type IfEquals<X, Y, A=X, B=never> =
//   (<T>() => T extends X ? 1 : 2) extends
//     (<T>() => T extends Y ? 1 : 2) ? A : B;
//
// type WritableKeys<T> = {
//   [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
// }[keyof T];
//
// type ReadonlyKeys<T> = {
//   [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
// }[keyof T];
//
// type NonOptional = Pick<I1, WritableKeys<I1>>;
// type Optional = Pick<I1, ReadonlyKeys<I1>>;

interface I1 {
  readonly n: number;
  s: string;
}

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type ExcludeOptionalProps<T> = Pick<T, RequiredKeys<T>>;
type ExcludeNotOptionalProps<T> = Pick<T, OptionalKeys<T>>;

type I3 = {
  a: string;
  b?: number;
  c: boolean | undefined;
};

type I4 = ExcludeOptionalProps<I3>; // {a: string; c: boolean | undefined}
type I5 = ExcludeNotOptionalProps<I3>; // {b?: number}

// ------------------------------------------------------------------------------------------------------------

// ## how to exclude getter only properties from type

type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

// Alternatively:
/*
type IfEquals<X, Y, A, B> =
    [2] & [0, 1, X] extends [2] & [0, 1, Y] & [0, infer W, unknown]
    ? W extends 1 ? B : A
    : B;
*/

type WritableKeysOf<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>;
}[keyof T];

type WritablePart<T> = Pick<T, WritableKeysOf<T>>;

class Car {
  engine!: number;
  get hp() {
    return this.engine / 2;
  }
  get kw() {
    return this.engine * 2;
  }
}

function applySnapshot(car: Car, snapshot: Partial<WritablePart<Car>>) {
  let key: keyof typeof snapshot;
  for (key in snapshot) {
    if (!snapshot.hasOwnProperty(key)) continue;
    // car[key as number] = snapshot[key];
  }
}

const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

// # make a type from ODirection variable then just
type Direction = typeof ODirection;
type Direction1 = keyof typeof ODirection; // makes an union of keys i.e. "Up" | "Down" | "Left" | "Right"

// now to get the correspoing value from each key
type Direction2 = (typeof ODirection)[keyof typeof ODirection]; // 0 | 1 | 2 | 3

// #Mapped Types: https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types

//at the left side: loop, key Remapping with String Literals and Utility types
// at the right side: do whatever