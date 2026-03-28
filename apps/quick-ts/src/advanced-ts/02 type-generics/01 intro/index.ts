// import { Expect, Equal } from '../../../helpers/type-utils';

// These T1, T2 are Generic type and solely belongs to this Params
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Params<T1, T2> = {
  a: T1;
  b: T2;
};

// These T1, T2 are Generic type and solely belongs to this function below
const returnOfBothWhatIPassIn = <T1, T2>(params: { a: T1; b: T2 }) => {
  return {
    first: params.a,
    second: params.b,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const result = returnOfBothWhatIPassIn({ a: 1, b: 2 });

class Component<TProps> {
  // private readonly props: TProps; // diff

  constructor(props: TProps) {
    this.props = props;
  }

  private readonly props: TProps; // diff

  // getPropsArrowFn = () => this.props;

  getProps(): TProps {
    return this.props;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const component = new Component({ a: 1, b: 2 });

// prettier-ignore
export const concatenateFirstNameAndLastName = <T extends { firstName: string; lastName: string }>(user: T) => {
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  };
};

const users = [
  {
    id: 1,
    firstName: 'Matt',
    lastName: 'Johnson',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const newUsers = users.map(concatenateFirstNameAndLastName);
