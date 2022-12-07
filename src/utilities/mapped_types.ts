// maka a new type from existing type

type Properties = "propA" | "propB";

// type MappedProperties = {
//   [P in Properties]: boolean;
// };

// type MyMappedType<Properties extends string | number | symbol> = {
//   [P in Properties]: boolean;
// };

// type MyNewType = MyMappedType<"propA" | "propB">;

type MyMappedType<T> = {
  // P must be key of T object
  [P in keyof T]: T[P];
  // readonly [P in keyof T]: T[P]; // all properties within T will be readonly
  // [P in keyof T]?: T[P]; // all properties within T will be optional
  // [P in keyof T]: T[P] | null; // all properties within T will be optional
};

type MyNewType = MyMappedType<{ a: "a"; b: "b" }>;

type Pick1<T, Properties extends keyof T> = {
  [P in Properties]: T[P];
};

// type MyNewType2 = Pick1<{ a: "a"; b: "b" }, "a">;
type MyNewType2 = Pick1<{ a: "a"; b: "b" }, "a" | "b">;

type Record1<K extends keyof any, T> = {
  [P in K]: T;
} & { someProperty: string };

// so, here it makes a Type {A: number, B: number, someProperty: string}
const someRecord: Record1<"A" | "B", number> = {
  A: 1,
  B: 2,
  someProperty: "hello typescript",
};
// someRecord.apples = "apples"; // wrong
// someRecord.oranges = "oranges"; // wrong

interface Record2 {
  [key: number]: number;
}

type Artist = { name: string; bio: string };

type Subscriber<Type> = {
  [Property in keyof Type]: (newValue: Type[Property]) => void;
};

type ArtistSub = Subscriber<Artist>;

// mapped type: add conditional modifier specifically

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

// https://www.typescriptlang.org/play?ts=4.3.5#code/C4TwDgpgBA8mwEsD2A7AhgGwIICcdpAGcAeAFQD4oBeKAbwCgooBtAawhCgRSnZCQBmUUlDSFhbDgF0oEAB7AIKACbjc+EMTQoQlAPy8OUAFxQUEAG4QcUvadKSQU+gF8oAMjqMWfLjz6CwqLiDnwy8ooqangEWjr6ZpbWJoZO9o7OLvT03Io4AmgAxtAAonJoALZgGNAMTAJISKaEwDjcAObMUgDc3gBGaDimKACuFX3WvS699KCQUGWV1RAATNSw8Mjo2DFExItVNeS9APQAVLPgpeWHq+t1TFANSHZQLW0onTIAPlAjKhABNwIMoph4vI8oAMhmYxhMcFN6GcTkA
interface ExampleArray {
  foo: string[];
  bar: number;
}

type ExampleArray2 = OptionalArrays<ExampleArray>;

type OptionalArrays<T> = {
  [key in keyof T as T[key] extends Array<any> ? key : never]?: T[key];
} & {
  [key in keyof T as T[key] extends Array<any> ? never : key]: T[key];
};

// https://www.typescriptlang.org/play?ts=4.3.5#code/C4TwDgpgBAggTnAhiA0hEBnAPAFQHxQC8UA3gFBSVQDaA1ulAJYB2U9IA9gGZQ4C6ALl510fKBAAewCMwAmGWAmRZEzEAQD8bBkOYQAbhDhkAviM49+ZMqEhQA8mGCMOzRABt4STLgKEKVPYAtozAuAA0it5oPvgEAGRQAPRJUADmEMBQrtC20ADuoQAWHACuWYhKINqYAZQACpXOHlj1jADGtBFRyDHYcQQp6ZnZelB5UIXARVCV3jUKiAocTi5u7tYs0nBciO3QAKISiEFg7tDklFwcHEIYwHAsadR8ANwBAEaVuqVBH0bvEzvGzgQ7HU7nABMRAcq1cHi8yGwRxOZwgeGB7Vc9yg+g8pQgAEYhCiIRBocRLlBrrcaHxwp9vlAAMwMkzWLHMHF49wEyEk8FoimkAI0oSlOQQLgsCCyBmUL5wISs0wc7FZHkE5kC1FQmFUxXKtlAA

type ArrayKeys<T> = {
  [key in keyof T]: T[key] extends Array<any> ? key : never;
}[keyof T];

type OptionalArrays2<T> = Omit<T, ArrayKeys<T>> & // get one type without array keys
  Partial<Pick<T, ArrayKeys<T>>>; // get one type with array keys as optional

interface ExampleHere {
  foo: string[];
  bar: number;
}

type ExampleHere2 = OptionalArrays2<ExampleHere>;

const value1: ExampleHere2 = {
  foo: [],
  bar: 3,
};

const value2: ExampleHere2 = {
  foo: undefined,
  bar: 3,
};

const value3: ExampleHere2 = {
  bar: 3,
};

// https://stackoverflow.com/questions/66928064/typescript-mapped-type-add-optional-modifier-conditionally
// https://www.typescriptlang.org/play?#code/MYGwhgzhAECSC2AHEBTeKB2AXMWCWA9hgCoCeiK0A3gL4CwAUFuZQCIoBmeGe+R0AXmqNo0DGHQAuaBCwAnbgHMANCOgATTmACuILAmRpMOPhgD80g6nTZchEi0b0mLaOy49TAWTCJB0ACUUYAI5dQAeWQUMFTdObl57AD5GRmYKaAA5IisjbBR1AGkUUghw4mgUAA8sTHUYdwTvXyT-KgBtQuhuaABrEoIOaGIAXWliTpHKmrqYKk0OHT1cmxN7SyRrYzsiMgoaaDMxFAA3FDloaUKadv7SQeGRtNdMvGAUWHy5CGDTcIBlZTDVpCDpdHp3B4ACn+0AAZMMAJRjaAw+FIybOdKUFbbZqIcrTWoYepxDyJIg+RAgrJvD5fH7AP5UNSiTrdDBZHKbPK1IolMrEJIo3G2Ux7FBOIEshiiNngzmQoajCxwHmrHYOChOFIMZ4ZRqeexUgCiVQkhjaag4BAI0ioYgkKGkAHIqi7oDRVLLoAAjMBye2OqTQF2kF1AhZLfTqvHrajQAD0ACoAHTp5OJz2epypBiJrNUG12tWGDXilhA-1yVWita7VwAH2g2hJ8QwBSxrjrmtN5p5-h7+PChopGD7FtQuqAA

class ImplementationType {}

type Definition = {
  name: string;
  defaultImplementation?: ImplementationType;
};

type DefinitionMap = Record<string, Definition>;

type NonImplementedKeys<T extends DefinitionMap> = {
  [K in keyof T]: T[K] extends { defaultImplementation: ImplementationType }
    ? never
    : K;
}[keyof T];

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

// same solution with Partial and Record

// Gets the keys of T whose values are assignable to V
type KeysMatching<T, V> = {[K in keyof T]: T[K] extends V ? K : never}[keyof T]

type ImplementationMap2<T extends DefinitionMap> =
// A partial (all properties are optional) record for all the keys
  Partial<Record<keyof T, ImplementationType>> &
  // Require ImplementationType for all the keys that do not have defaultImplementation
  Record<KeysMatching<T, { defaultImplementation?: undefined }>, ImplementationType>

/*
Test is equivalent to
{
  foo: ImplementationType,
  bar?: ImplementationType,
  baz: ImplementationType
}
*/
type Test = ImplementationMap2<{
  foo: { name: 'x' },
  bar: { name: 'y', defaultImplementation: { /*...*/ } },
  baz: { name: 'z', defaultImplementaiton: undefined }
}>



// https://stackoverflow.com/questions/67552360/conditionally-apply-modifier-in-mapped-type-per-property

interface SomeInterface {
  name: string;
}

type TestType = {
  a: SomeInterface;
  b: string;
};

type Intersection<A, B> = A & B extends infer U
  ? { [P in keyof U]: U[P] }
  : never;

type Matching<T, SomeInterface> = {
  [K in keyof T]: T[K] extends SomeInterface ? K : never;
}[keyof T];

type NonMatching<T, SomeInterface> = {
  [K in keyof T]: T[K] extends SomeInterface ? never : K;
}[keyof T];

type DesiredOutcome = Intersection<
  Partial<Pick<TestType, Matching<TestType, SomeInterface>>>,
  Required<Pick<TestType, NonMatching<TestType, SomeInterface>>>
>;

// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir
// https://blog.logrocket.com/understanding-infer-typescript/