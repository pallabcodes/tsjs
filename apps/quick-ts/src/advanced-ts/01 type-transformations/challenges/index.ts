import { Expect, Equal } from '../../../helpers/type-utils';
import { S } from 'ts-toolbelt';

type UserPath = '/users/:id';

type UserOrganisationPath = '/users/:id/organisations/:organisationId';

type ExtractPathParams<TPath extends string> = {
  [K in S.Split<TPath, '/'>[number] as K extends `:${infer P}`
    ? P
    : never]: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestExtractParams = [
  Expect<Equal<ExtractPathParams<UserPath>, { id: string }>>,
  Expect<
    Equal<
      ExtractPathParams<UserOrganisationPath>,
      { id: string; organisationId: string }
    >
  >
];

interface Attributes {
  id: string;
  email: string;
  username: string;
}

type MutuallyExclusive<T> = {
  [K in keyof T]: Record<K, T[K]>;
}[keyof T];

type ExclusiveAttributes = MutuallyExclusive<Attributes>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestExclusiveAttr = [
  Expect<
    Equal<
      ExclusiveAttributes,
      | {
          id: string;
        }
      | {
          email: string;
        }
      | {
          username: string;
        }
    >
  >
];

type Route =
  | {
      route: '/';
      search: {
        page: string;
        perPage: string;
      };
    }
  | { route: '/about' }
  | { route: '/admin' }
  | { route: '/admin/users' };

type RoutesObject = {
  // during each iteration, this checks does R (i.e., current iteration is an object & it has "search" property); it can have additional attributes, but that doesn't matter
  // N.B: so, if the current iteration is an object and has search then infer its data-type and return else never i.e. done below
  [R in Route as R['route']]: R extends { search: infer S } ? S : never;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestRoutes = [
  Expect<
    Equal<
      RoutesObject,
      {
        '/': {
          page: string;
          perPage: string;
        };
        '/about': never;
        '/admin': never;
        '/admin/users': never;
      }
    >
  >
];

type DeepPartial<T> = T extends Array<infer U> // Step 1: Check if T is an array
  ? Array<DeepPartial<U>> // If T is an array, make its elements deeply partial
  : { [K in keyof T]?: DeepPartial<T[K]> }; // Otherwise, make each property optional and apply DeepPartial recursively

type MyType = {
  a: string;
  b: number;
  c: {
    d: string;
    e: {
      f: string;
      g: {
        h: string;
        i: string;
      }[];
    };
  };
};

type Result = DeepPartial<MyType>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests = [
  Expect<
    Equal<
      Result,
      {
        a?: string;
        b?: number;
        c?: {
          d?: string;
          e?: {
            f?: string;
            g?: {
              h?: string;
              i?: string;
            }[];
          };
        };
      }
    >
  >
];
