import { expect, it, describe } from 'vitest';
import { Expect, Equal } from '../../../helpers/type-utils';

export const createSetWithoutDefaultArg = <T>() => {
  return new Set<T>();
};

export const createSet = <T = string>() => {
  return new Set<T>();
};

const stringSet = createSet<string>();
const stringOrNumberSet = createSet<string | number>();
const numberSet = createSet<number>();
const unknownSet = createSet();
const unknownSetWithoutDefaultArg = createSetWithoutDefaultArg();

type tests = [
  Expect<Equal<typeof stringSet, Set<string>>>,
  Expect<Equal<typeof stringOrNumberSet, Set<string | number>>>,
  Expect<Equal<typeof numberSet, Set<number>>>,
  Expect<Equal<typeof unknownSet, Set<string>>>,
  Expect<Equal<typeof unknownSetWithoutDefaultArg, Set<unknown>>>
];

export class Component<TProps> {
  private readonly props: TProps;

  constructor(props: TProps) {
    this.props = props;
  }

  getProps = () => this.props;
}

const cloneComponent = <TProps>(component: Component<TProps>) => {
  return new Component(component.getProps());
};

const component = new Component({ a: 1, b: 2, c: 3 });

const clonedComponent = cloneComponent(component);

const result = clonedComponent.getProps();

type TestComponent = [
  Expect<Equal<typeof result, { a: number; b: number; c: number }>>
];

const array = [
  {
    name: 'John',
  },
  {
    name: 'Steve',
  },
];

const obj = array.reduce<Record<string, { name: string }>>((accum, item) => {
  accum[item.name] = item;
  return accum;
}, {});

const fetchData = async <TData>(url: string) => {
  let data: TData = await fetch(url).then(response => response.json());

  return data;
};

async function fetching() {
  const data = await fetchData<{ name: string }>(
    'https://swapi.dev/api/people/1'
  );
}

export const getHomePageFeatureFlags = <
  TConfig extends {
    rawConfig: {
      featureFlags: {
        homePage: any;
      };
    };
  }
>(
  config: TConfig,
  override: (
    flags: TConfig['rawConfig']['featureFlags']['homePage']
  ) => TConfig['rawConfig']['featureFlags']['homePage']
) => {
  return override(config.rawConfig.featureFlags.homePage);
};

const EXAMPLE_CONFIG = {
  apiEndpoint: 'https://api.example.com',
  apiVersion: 'v1',
  apiKey: '1234567890',
  rawConfig: {
    featureFlags: {
      homePage: {
        showBanner: true,
        showLogOut: false,
      },
      loginPage: {
        showCaptcha: true,
        showConfirmPassword: false,
      },
    },
  },
};

const flags = getHomePageFeatureFlags(
  EXAMPLE_CONFIG,
  defaultFlags => defaultFlags
);

const flagsNoBanner = getHomePageFeatureFlags(EXAMPLE_CONFIG, defaultFlags => ({
  ...defaultFlags,
  showBanner: false,
}));

const typedObjectKeys = <TObject extends object>(obj: TObject) => {
  return Object.keys(obj) as Array<keyof TObject>;
};

const result1 = typedObjectKeys({
  a: 1,
  b: 2,
});

type test = Expect<Equal<typeof result1, Array<'a' | 'b'>>>;

// this is a higher order function, so TypeScript denotes first generic to params and second as the return type

const makeSafe =
  <TParams extends any[], TReturn>(func: (...args: TParams) => TReturn) =>
  (
    ...args: TParams
  ):
    | {
        type: 'success';
        result: TReturn;
      }
    | {
        type: 'failure';
        error: Error;
      } => {
    try {
      const result = func(...args);

      return {
        type: 'success',
        result,
      };
    } catch (e) {
      return {
        type: 'failure',
        error: e as Error,
      };
    }
  };

// N.B: Here, below function () => 1, which has no parameters (so TParams is [], an empty tuple) and returns a number (so TReturn is number).
const func = makeSafe(() => 1);

const resultFunc = func();

type TestSafeFn = [
  Expect<
    Equal<
      typeof resultFunc,
      | {
          type: 'success';
          result: number;
        }
      | {
          type: 'failure';
          error: Error;
        }
    >
  >
];

// upto 14