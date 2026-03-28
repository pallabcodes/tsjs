import { Equal, Expect } from '../../../helpers/type-utils';

const makeQuery = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  opts?: { method?: string; headers?: { [key: string]: string }; body?: string }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => {};

// type MakeQuery = typeof makeQuery; // this will return a function as type by having parameter and return type
// type MakeQuery2<X, Y> = <T = MakeQuery>() => T extends X ? X : Y; // this will return a function as type by having parameter and return type

type MakeQueryParameters = Parameters<typeof makeQuery>; // it only extracts "parameter types" and make it into a tuple
// type MakeQueryParametersSecondArg = MakeQueryParameters[1]; // now accessing the second parameter

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tests = [
  Expect<
    Equal<
      MakeQueryParameters,
      [
        url: string,
        opts?: {
          method?: string;
          headers?: { [key: string]: string };
          body?: string;
        }
      ]
    >
  >
];
