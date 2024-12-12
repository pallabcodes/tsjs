import { Expect, Equal } from '../../../helpers/type-utils';

type Route = '/' | '/about' | '/admin' | '/admin/users';

type RoutesObject = {
  [R in Route]: R;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestRoutes = [
  Expect<
    Equal<
      RoutesObject,
      {
        '/': '/';
        '/about': '/about';
        '/admin': '/admin';
        '/admin/users': '/admin/users';
      }
    >
  >
];

interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}

type AttributeGetters = {
  [K in keyof Attributes]: () => Attributes[K];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestAttr = [
  Expect<
    Equal<
      AttributeGetters,
      {
        firstName: () => string;
        lastName: () => string;
        age: () => number;
      }
    >
  >
];

interface Attributes {
  firstName: string;
  lastName: string;
  age: number;
}

type AttributeGettersV2 = {
  [K in keyof Attributes as `get${Capitalize<K>}`]: () => Attributes[K];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests = [
  Expect<
    Equal<
      AttributeGettersV2,
      {
        getFirstName: () => string;
        getLastName: () => string;
        getAge: () => number;
      }
    >
  >
];

interface Example {
  name: string;
  age: number;
  id: string;
  organisationId: string;
  groupId: string;
}

type OnlyIdKeys<T> = {
  [K in keyof T as K extends `${string}${'id' | 'Id'}${string}`
    ? K
    : never]: T[K]; // On each iteration, if never i.e., skipped
};

type TestOnlyIdKeys = [
  Expect<
    Equal<
      OnlyIdKeys<Example>,
      {
        id: string;
        organisationId: string;
        groupId: string;
      }
    >
  >,
  Expect<Equal<OnlyIdKeys<{}>, {}>>
];

type RouteAlt =
  | {
      route: '/';
      search: {
        page: string;
        perPage: string;
      };
    }
  | { route: '/about'; search: {} }
  | { route: '/admin'; search: {} }
  | { route: '/admin/users'; search: {} };

/**
 * This is useful, but less powerful than below a solution i.e., RoutesObjectAltV2:
 */
type RoutesObjectAlt = {
  [R in RouteAlt['route']]: Extract<RouteAlt, { route: R }>['search'];
};

// Here, R represents the individual Route (union). From there it goes over each union and then
// it picks R['route'] as key i.e. '/': R['search'] as value i.e. {page: string, perPage: string}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RoutesObjectAltV2 = {
  [R in RouteAlt as R['route']]: R['search'];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestRoutesV2 = [
  Expect<
    Equal<
      // RoutesObjectAlt,
      RoutesObjectAlt,
      {
        '/': {
          page: string;
          perPage: string;
        };
        '/about': {};
        '/admin': {};
        '/admin/users': {};
      }
    >
  >
];

interface Values {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

// N.B: This is how to get types of object values, and it will be a `union` type of values like here it is string | number
// N.B: so based on all data type used on values (here 2: number, string); below will form a "UNION" type
export type GetObjectValues = Values[keyof Values];

type ValuesAsUnionOfTuples = {
  [V in keyof Values]: [V, Values[V]];
}[keyof Values]; // N.B: so, once again by doing "keyof Values", it gets the values i.e., modified within this ValuesAsUnionOfTuples not from OG Values

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestValuesAsUnionOfTuples = [
  Expect<
    Equal<
      ValuesAsUnionOfTuples,
      | ['id', number]
      | ['email', string]
      | ['firstName', string]
      | ['lastName', string]
    >
  >
];

interface FruitMap {
  apple: 'red';
  banana: 'yellow';
  orange: 'orange';
}

type TransformedFruit = {
  [F in keyof FruitMap]: `${F}:${FruitMap[F]}`;
}[keyof FruitMap];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestTransformedFruit = [
  Expect<
    Equal<TransformedFruit, 'apple:red' | 'banana:yellow' | 'orange:orange'>
  >
];

type Fruit =
  | {
      name: 'apple';
      color: 'red';
    }
  | {
      name: 'banana';
      color: 'yellow';
    }
  | {
      name: 'orange';
      color: 'orange';
    };

type TransformedFruitAlt = {
  // when iteration on unions, F represents each union, i.e., an Object (since by default, an object can't be used as a key here thus re-map using as and instead use F['name'])
  [F in Fruit as F['name']]: `${F['name']}:${F['color']}`; // as key basically re-mapping the key
}[Fruit['name']];

export type TestTransformedFruitAlt = [
  Expect<
    Equal<TransformedFruitAlt, 'apple:red' | 'banana:yellow' | 'orange:orange'>
  >
];
