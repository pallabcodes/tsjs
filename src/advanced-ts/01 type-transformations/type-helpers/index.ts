import { Expect, Equal } from '../../../helpers/type-utils';

type ReturnWhatIPassIn<T> = T;
type Something = ReturnWhatIPassIn<'something'>;

type Maybe<T> = T | null | undefined;
type Example = Maybe<number>;

// N.B: T extends {} means T can be anything except null or undefined
// const whatever: {} = false; // it works due to the same reason since datatype is here {}

// N.B: {} works because everything in JS is an object, therefore, whichever datatype is used, it will be an extension from {}
type MaybeType<T extends {}> = T | null | undefined;
type MaybeExample = Maybe<string[]>; // so array which is again an object therefore T extends {} works fine and type here string[]
type MaybeExample2 = Maybe<false>; // now it should be false which is basically a boolean and boolean is ultimately an object

type TestMaybe = [
  MaybeType<'ts'>,
  MaybeType<1>,
  MaybeType<false>,
  // MaybeType<null>, // which is why this will be a type error
  // MaybeType<undefined>, // which is why this will be a type error
  MaybeType<[]>,
  MaybeType<{ id: 1; address: { locality: { pin: '744321' } } }>
];

// because here TRoute within a string literal but TRoute doesn't know whether it will be null, undefined, number, boolean, or even string, symbol or reference datatype
// type AddRoutePrefix<TRoute> = `/${TRoute}`;

// solution: which is why explicitly needed to use extends keyword as below
type AddRoutePrefix<TRoute extends string> = `/${TRoute}`;

const addRoutePrefix = (route: string) => {};

type tests_1 = [
  Expect<Equal<AddRoutePrefix<''>, '/'>>,
  Expect<Equal<AddRoutePrefix<'about'>, '/about'>>,
  Expect<Equal<AddRoutePrefix<'profile'>, '/profile'>>,
  Expect<Equal<AddRoutePrefix<'dashboard'>, '/dashboard'>>
];

type CreateDataShape<TData, TError> = {
  data: TData;
  error: TError;
};

type tests_2 = [
  Expect<
    Equal<
      CreateDataShape<string, TypeError>,
      {
        data: string;
        error: TypeError;
      }
    >
  >,
  Expect<
    Equal<
      CreateDataShape<number, Error>,
      {
        data: number;
        error: Error;
      }
    >
  >,
  Expect<
    Equal<
      CreateDataShape<boolean, SyntaxError>,
      {
        data: boolean;
        error: SyntaxError;
      }
    >
  >
];

type CreateDataShapeWithDefault<TData, TError = undefined> = {
  data: TData;
  error: TError;
};

type tests_r = [
  Expect<
    Equal<
      CreateDataShapeWithDefault<string>,
      // Won't throw error despite needing 2 type argument since now provided default type argument on CreateDataShapeWithDefault
      {
        data: string;
        error: undefined;
      }
    >
  >,
  Expect<
    Equal<
      CreateDataShape<boolean, SyntaxError>,
      {
        data: boolean;
        error: SyntaxError;
      }
    >
  >
];
// (...args: any) => any it means the function none or any no. of arguments and return value could be of any data type
type GetParametersAndReturnType<T extends (...args: any) => any> = {
  params: Parameters<T>;
  returnValue: ReturnType<T>;
};

type testsForParamAndReturnType = [
  Expect<
    Equal<
      GetParametersAndReturnType<() => string>,
      { params: []; returnValue: string }
    >
  >,
  Expect<
    Equal<
      GetParametersAndReturnType<(s: string) => void>,
      { params: [string]; returnValue: void }
    >
  >,
  Expect<
    Equal<
      GetParametersAndReturnType<(n: number, b: boolean) => number>,
      { params: [number, boolean]; returnValue: number }
    >
  >
];

// Must provide at least one value, then it could be empty and since used spread so in case of empty array it will work fine
type NonEmptyArray<T> = [T, ...Array<T>];

export const makeEnum = (values: NonEmptyArray<string>) => {};

makeEnum(['a']);
makeEnum(['a', 'b', 'c']);
// @ts-expect-error since it expects at least one value to be provided
makeEnum([]);
