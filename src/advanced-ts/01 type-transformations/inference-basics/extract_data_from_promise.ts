import { Equal, Expect } from '../../../helpers/type-utils';

const getUser = () => {
  return Promise.resolve({ id: 1, name: 'john', email: 'john12@gmail.com' });
};

type GetUserPromise = ReturnType<typeof getUser>;

type ReturnValue = Awaited<GetUserPromise>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tests = Expect<
  Equal<ReturnValue, { id: number; name: string; email: string }>
>;
