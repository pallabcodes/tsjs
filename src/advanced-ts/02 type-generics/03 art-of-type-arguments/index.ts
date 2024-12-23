import { expect, it } from 'vitest';
import { Expect, Equal } from '../../../helpers/type-utils';

type GreetingResult<TGreeting> = TGreeting extends 'hello'
  ? 'goodbye'
  : 'hello';

function youSayGoodbyeISayHello<TGreeting extends 'hello' | 'goodbye'>(
  greeting: TGreeting
): TGreeting extends 'hello' ? 'goodbye' : 'hello' {
  return (greeting === 'goodbye' ? 'hello' : 'goodbye') as any;
}

function youSayGoodbyeISayHelloAlt<TGreeting extends 'hello' | 'goodbye'>(
  greeting: TGreeting
) {
  return (
    greeting === 'goodbye' ? 'hello' : 'goodbye'
  ) as GreetingResult<TGreeting>;
}

it('Should return goodbye when hello is passed in', () => {
  const result = youSayGoodbyeISayHelloAlt('hello');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type test = [Expect<Equal<typeof result, 'goodbye'>>];

  expect(result).toEqual('goodbye');
});

it('Should return hello when goodbye is passed in', () => {
  const result = youSayGoodbyeISayHelloAlt('goodbye');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type test = [Expect<Equal<typeof result, 'hello'>>];

  expect(result).toEqual('hello');
});

it('Should return goodbye when hello is passed in', () => {
  const result = youSayGoodbyeISayHello('hello');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type test = [Expect<Equal<typeof result, 'goodbye'>>];

  expect(result).toEqual('goodbye');
});

it('Should return hello when goodbye is passed in', () => {
  const result = youSayGoodbyeISayHello('goodbye');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type test = [Expect<Equal<typeof result, 'hello'>>];

  expect(result).toEqual('hello');
});

type Person = {
  name: string;
  age: number;
  birthdate: Date;
};

export function remapPerson<Key extends keyof Person>(
  key: Key,
  value: Person[Key]
): Person[Key] {
  if (key === 'birthdate') {
    return new Date() as Person[Key];
  }

  return value;
}

export const curryFunction =
  <T>(t: T) =>
  <U>(u: U) =>
  <V>(v: V) => {
    return {
      t,
      u,
      v,
    };
  };

it('Should return an object which matches the types of each input', () => {
  const result = curryFunction(1)(2)(3);

  expect(result).toEqual({
    t: 1,
    u: 2,
    v: 3,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type test = [
    Expect<Equal<typeof result, { t: number; u: number; v: number }>>
  ];
});

export interface Cache<T> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T) => void;
  // You can fix this by only changing the line below!
  clone: <U>(transform: (elem: T) => U) => Cache<U>;
}

const createCache = <T>(initialCache?: Record<string, T>): Cache<T> => {
  const cache: Record<string, T> = initialCache || {};

  return {
    get: key => cache[key],
    set: (key, value) => {
      cache[key] = value;
    },
    clone: transform => {
      const newCache: Record<string, any> = {};

      for (const key in cache) {
        // @ts-expect-error type issue
        newCache[key] = transform(cache[key]);
      }
      return createCache(newCache);
    },
  };
};

it('Should let you get and set to/from the cache', () => {
  const cache = createCache<number>();

  cache.set('a', 1);
  cache.set('b', 2);

  expect(cache.get('a')).toEqual(1);
  expect(cache.get('b')).toEqual(2);
});

it('Should let you clone the cache using a transform function', () => {
  const numberCache = createCache<number>();

  numberCache.set('a', 1);
  numberCache.set('b', 2);

  const stringCache = numberCache.clone(elem => {
    return String(elem);
  });

  const a = stringCache.get('a');

  expect(a).toEqual('1');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type tests = [Expect<Equal<typeof a, string | undefined>>];
});

const returnBothOfWhatIPassIn = <
  TParams extends {
    a: unknown;
    b: unknown;
  }
>(
  params: TParams
): [TParams['a'], TParams['b']] => {
  return [params.a, params.b];
};

it('Should return a tuple of the properties a and b', () => {
  const result = returnBothOfWhatIPassIn({
    a: 'a',
    b: 1,
  });

  expect(result).toEqual(['a', 1]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type test1 = Expect<Equal<typeof result, [string, number]>>;
});

const getValue = <TObj, TKey extends keyof TObj>(obj: TObj, key: TKey) => {
  return obj[key];
};

const obj = {
  a: 1,
  b: 'some-string',
  c: true,
};

const numberResult = getValue(obj, 'a');
const stringResult = getValue(obj, 'b');
const booleanResult = getValue(obj, 'c');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests = [
  Expect<Equal<typeof numberResult, number>>,
  Expect<Equal<typeof stringResult, string>>,
  Expect<Equal<typeof booleanResult, boolean>>
];
