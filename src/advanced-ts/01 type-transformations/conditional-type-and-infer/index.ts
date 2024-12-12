import { Expect, Equal } from '../../../helpers/type-utils';
import { S } from 'ts-toolbelt';

type YouSayGoodbyeAndISayHello<T> = T extends 'hello' ? 'goodbye' : 'hello';

export type tests = [
  Expect<Equal<YouSayGoodbyeAndISayHello<'hello'>, 'goodbye'>>,
  Expect<Equal<YouSayGoodbyeAndISayHello<'goodbye'>, 'hello'>>
];

// prettier-ignore
type YouSayGoodbyeAndISayHelloAlt<T> = T extends 'hello' | 'goodbye' ? T extends 'hello' ? 'goodbye' : 'hello' : never;

// prettier-ignore
export type TestYouSayGoodbyeAndISayHelloAlt = YouSayGoodbyeAndISayHelloAlt<'Whatever'>; // since it doesn't 'hello' or 'goodbye' -> type never

type tests_1 = [
  Expect<Equal<YouSayGoodbyeAndISayHelloAlt<'hello'>, 'goodbye'>>,
  Expect<Equal<YouSayGoodbyeAndISayHelloAlt<'goodbye'>, 'hello'>>,
  Expect<Equal<YouSayGoodbyeAndISayHelloAlt<'alright pal'>, never>>,
  Expect<Equal<YouSayGoodbyeAndISayHelloAlt<1>, never>>
];

type GetDataValue<T> = T extends { data: any } ? T['data'] : never; // uses an index-based access type

type GetDateValueExample1 = GetDataValue<{ data: 'hello' }>; // 'hello'
type GetDateValueExample2 = GetDataValue<{ data: { name: 'hello' } }>; // { name: "hello" }

// N.B: The type "TData" (below) is only available within the "?" clause, and not accessible after the ":" clause like below
// N.B: The name TData is arbitrary so it could be whatever like `TInferredData`
type GetDataValueAlt<T> = T extends { data: infer TData }
  ? TData | undefined
  : never; // whatever value passed to data inferred

type GetDateValueAltExample1 = GetDataValueAlt<{ data: 1 }>;

type TestGetDataValue = [
  Expect<Equal<GetDataValue<{ data: 'hello' }>, 'hello'>>,
  Expect<
    Equal<
      GetDataValueAlt<{ data: { name: 'hello' } }>,
      { name: 'hello' } | undefined
    >
  >,
  Expect<
    Equal<
      GetDataValue<{ data: { name: 'hello'; age: 20 } }>,
      { name: 'hello'; age: 20 }
    >
  >,
  // Expect that if you pass in string, so the type will be never
  Expect<Equal<GetDataValue<string>, never>>
];

// so this interface the following 4 generics
interface MyComplexInterface<Event, Context, Name, Point> {
  getEvent: () => Event;
  getContext: () => Context;
  getName: () => Name;
  getPoint: () => Point;
}

type Example = MyComplexInterface<
  'click',
  'window',
  'my-event',
  { x: 12; y: 14 }
>;

// N.B: Since no need to infer the first three types (Event, Context, Name), so either use `{}/any` would be just fine but

// so, here MyComplexInterface uses any as type argument and since type any works irrespective of a data-type, thus it gets proper type hints of methods from MyComplexInterface
type GetPointWithAny<T> = T extends MyComplexInterface<any, any, any, any>
  ? T['getPoint']
  : never;

// so, here MyComplexInterface uses {} as type argument and since {} type any works except null/ undefined, thus it gets proper type hints of methods from MyComplexInterface
type GetPointWithObj<T> = T extends MyComplexInterface<{}, {}, {}, { id: 1 }>
  ? T['getPoint']
  : never;

// N.B: any works with every data type (including null, undefined) whereas {} also works every data-type (except null, undefined)
type GetPoint<T> = T extends MyComplexInterface<any, any, any, infer TPoint>
  ? TPoint
  : never;

// type GetPointExample = GetPoint<1, 2, 3, 4>; // GetPoint expects a single type argument but provided 4

type GetPointExample2 = GetPoint<MyComplexInterface<1, 2, 3, 4>>; // GetPoint expects a single type argument but provided 4

type TestGetPoint = [Expect<Equal<GetPoint<Example>, { x: 12; y: 14 }>>];

type Names = [
  'Matt Johnson',
  'Jimi Hendrix',
  'Eric Clapton',
  'John Mayer',
  'BB King'
];

type GetSurname<T> = T extends `${infer First} ${infer Last}` ? Last : never;
type GetSurnameAlt<T extends string> = S.Split<T, ' '>[1];

type TestNames = [
  Expect<Equal<GetSurname<Names[0]>, 'Johnson'>>,
  Expect<Equal<GetSurname<Names[1]>, 'Hendrix'>>,
  Expect<Equal<GetSurname<Names[2]>, 'Clapton'>>,
  Expect<Equal<GetSurname<Names[3]>, 'Mayer'>>,
  Expect<Equal<GetSurname<Names[4]>, 'King'>>,
  Expect<Equal<GetSurnameAlt<Names[4]>, 'King'>>
];

const getServerSideProps = async () => {
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const json: { title: string } = await data.json();
  return {
    props: {
      json: json,
      isJSON: true,
    },
  };
};

// prettier-ignore
type InferPropsFromServerSideFunction<T> = T extends () => Promise<{ props: infer P; }> ? P : never;
// type ExampleInferFromServerSideFn = typeof getServerSideProps;
type Props = InferPropsFromServerSideFunction<typeof getServerSideProps>;

type TestInferPropsFromServerSideFn = [
  Expect<
    Equal<
      InferPropsFromServerSideFunction<typeof getServerSideProps>,
      { json: { title: string }; isJSON: boolean }
    >
  >
];

const parser1 = {
  parse: () => 1,
};

const parser2 = () => '123';

const parser3 = {
  extract: () => true,
};

type GetParserResult<T> = T extends {
  parse: () => infer TResult;
}
  ? TResult
  : T extends () => infer TResult
  ? TResult
  : T extends {
      extract: () => infer TResult;
    }
  ? TResult
  : never;

type GetParserResultAlt<T> = T extends
  | {
      parse: () => infer TResult;
    }
  | {
      extract: () => infer TResult;
    }
  | (() => infer TResult) ? TResult : never;

type TestParser = [
  Expect<Equal<GetParserResult<typeof parser1>, number>>,
  Expect<Equal<GetParserResult<typeof parser2>, string>>,
  Expect<Equal<GetParserResult<typeof parser3>, boolean>>
];

type Fruit = 'apple' | 'banana' | 'orange';

type GetAppleOrBanana<T> = T extends 'apple' | 'banana' ? T : never;
type AppleOrBanana = GetAppleOrBanana<Fruit>;

export type TestFruit = [Expect<Equal<AppleOrBanana, 'apple' | 'banana'>>];
