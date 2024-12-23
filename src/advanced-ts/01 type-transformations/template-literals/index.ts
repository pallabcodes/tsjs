import { Expect, Equal } from '../../../helpers/type-utils';
import { S } from 'ts-toolbelt';

type Route = `/${string}`;

export const goToRoute = (route: Route): void => {
  console.log(route);
};

goToRoute('/');
goToRoute('/users');
goToRoute('/users/register');
goToRoute('/users/login');

goToRoute('/users/1');
// goToRoute('https://facebook.com'); // this throws error as expected since the given value shound't have any '/' here it has twice

type Routes = '/users' | '/users/:id' | '/posts' | '/posts/:id';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DynamicRoutesV1 = '/users/:id' | '/posts/:id';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DynamicRoutesV2 = Extract<Routes, `${string}`>; // since used `${string}` so it picks all types from Routes
type DynamicRoutesV3 = Extract<Routes, `${string}:${string}`>; // since used `${string}:${string}` so '/users/:id' | '/posts/:id'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DynamicRoutesV4 = Extract<Routes, `:${string}`>; // since no string literal in Route as ':string' so it will be never

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests_1 = Expect<Equal<DynamicRoutesV3, '/users/:id' | '/posts/:id'>>;

type BreadType = 'rye' | 'brown' | 'white';
type Filling = 'cheese' | 'ham' | 'salami';

type Sandwich = `${BreadType} sandwich with ${Filling}`;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests_2 = Expect<
  Equal<
    Sandwich,
    | 'rye sandwich with cheese'
    | 'rye sandwich with ham'
    | 'rye sandwich with salami'
    | 'brown sandwich with cheese'
    | 'brown sandwich with ham'
    | 'brown sandwich with salami'
    | 'white sandwich with cheese'
    | 'white sandwich with ham'
    | 'white sandwich with salami'
  >
>;

type Path = 'Users/John/Documents/notes.txt';
type SplitPath = S.Split<Path, '/'>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests_3 = Expect<
  Equal<SplitPath, ['Users', 'John', 'Documents', 'notes.txt']>
>;

// when used string literal / backticks like as below, it does user+2nd literal, post+2nd literal, comment+2nd literal
// e.g. user -> userId, userName; post -> postId, postName, comment -> commentId, commentName
type TemplateLiteralKey = `${'user' | 'post' | 'comment'}${'Id' | 'Name'}`; // returns a multiple unions
type ObjectOfKeys = Record<TemplateLiteralKey, string>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests_4 = Expect<
  Equal<
    ObjectOfKeys,
    {
      userId: string;
      userName: string;
      postId: string;
      postName: string;
      commentId: string;
      commentName: string;
    }
  >
>;

type Event = 'log_in' | 'log_out' | 'sign_out';
type UppercaseEvent = Uppercase<Event>; // go over each type of Event and turn each of them into uppercase
type ObjectOfKeysAlt = Record<UppercaseEvent, string>;

type tests_5 = [
  Expect<
    Equal<
      ObjectOfKeysAlt,
      {
        LOG_IN: string;
        LOG_OUT: string;
        SIGN_OUT: string;
      }
    >
  >
];

// Define the 'TypePurchases' object with string literal values for the keys.
export type TypePurchases = {
  firstPurchase: 'first_purchase';
  renewalSelf: 'renewal_self';
  monthlySubscription: 'monthly_subscription';
  annualSubscription: 'annual_subscription';
};

// Defining the SelfHostedSignupProcess object as a constant with literal values (as const).
// Using 'as const' makes sure the object values are treated as literal types.
export const SelfHostedSignupProcess = {
  START: 'START',
  CREATED_CUSTOMER: 'CREATED_CUSTOMER',
  CREATED_INTENT: 'CREATED_INTENT',
  CONFIRMED_INTENT: 'CONFIRMED_INTENT',
  CREATED_SUBSCRIPTION: 'CREATED_SUBSCRIPTION',
  PAID: 'PAID',
  CREATED_LICENSE: 'CREATED_LICENSE',
} as const; // This ensures the values are treated as literal types

// Utility type to extract the values of TypePurchases object
type ValueOf<T> = T[keyof T];

// Constructing a new type 'MetadataGatherWireTransferKeys' based on the values of 'TypePurchases',
// followed by '_alt_payment_method' appended to each of those values. This is a template literal type.
export type MetadataGatherWireTransferKeys =
  `${ValueOf<TypePurchases>}_alt_payment_method`;

// 'CustomerMetadataGatherWireTransfer' type uses 'Record' to map the 'MetadataGatherWireTransferKeys' to strings,
// and 'Partial' makes these fields optional.
export type CustomerMetadataGatherWireTransfer = Partial<
  Record<MetadataGatherWireTransferKeys, string>
>;

// Defining the 'CloudCustomer' type which contains customer-related information.
export type CloudCustomer = {
  id: string;
  creator_id: string;
  create_at: number;
  email: string;
  name: string;
  num_employees: number;
  contact_first_name: string;
};
