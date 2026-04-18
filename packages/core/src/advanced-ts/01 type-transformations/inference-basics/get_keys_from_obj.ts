import { Equal, Expect } from '../../../helpers/type-utils';

const testingFrameworks = {
  vitest: { label: 'Vitest' },
  jest: { label: 'Jest' },
  mocha: { label: 'Mocha' },
};

type TestingFramework = keyof typeof testingFrameworks;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tests = [Expect<Equal<TestingFramework, 'vitest' | 'jest' | 'mocha'>>];
