import { Equal, Expect } from '../../../helpers/type-utils';

type A =
  | {
      type: 'a';
      a: string;
    }
  | {
      type: 'b';
      b: string;
    }
  | {
      type: 'c';
      c: string;
    };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUnion = (result: A) => {
  switch (result.type) {
    case 'a':
      return result.a;
    case 'b':
      return result.b;
    case 'c':
      return result.c;
    default:
      throw new Error('NOT IMPLEMENTED');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type B = 'a' | 'b' | 'c';

export type Event =
  | { type: 'click'; event: MouseEvent; a: string }
  | { type: 'focus'; event: FocusEvent; a: string }
  | { type: 'keydown'; event: KeyboardEvent };

// type Extract<T, U> = T extends U ? T : never;

type Fruit = 'apple' | 'banana' | 'orange';

export type BananaOrOrange = Extract<Fruit, 'banana' | 'orange'>;

const fruits = ['apple', 'banana', 'orange'] as const;

export type AppleOrBanana = (typeof fruits)[0 | 1]; // based on index types it will be 'apple' | 'banana'
export type Fruit2 = (typeof fruits)[number]; // all indexes are type number therefore it will pick all unions 'apple' | 'banana' | 'orange'

export type TestAppleOrBanana = [
  Expect<Equal<AppleOrBanana, 'apple' | 'banana'>>
];

export type TestFruits = [Expect<Equal<Fruit2, 'apple' | 'banana' | 'orange'>>];

// so, now when passed type: 'click', this will be selected as type { type: 'click'; event: MouseEvent } and similarly for focus, keydown etc.
type ClickEvent = Extract<Event, { type: 'click' }>; // {type: "click", event: MouseEvent, a: string}

// Below will throw a type error since it is missing "a: string" within Equal
// type tests1 = [Expect<Equal<ClickEvent, { type: 'click'; event: MouseEvent }>>];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type tests = [
  Expect<Equal<ClickEvent, { type: 'click'; event: MouseEvent; a: string }>>
];

export type Event2 =
  | { type: 'click'; event: MouseEvent; a: string }
  | { type: 'focus'; event: FocusEvent; a: string }
  | { type: 'keydown'; event: KeyboardEvent };

// so, it goes over each unions and extract their type and then creates a union type as below
// N.B: so if any of union doesn't have type within Event2, it will throw error
export type EventType = Event2['type'];

// type tests = [Expect<Equal<EventType, 'click' | 'focus' | 'keydown'>>];

function walkToTheOffice(action: 'grabACoffee' | 'keepWalking') {
  const transitions = {
    grabACoffee: 'late',
    keepWalking: 'on time',
  } as const;

  const result = transitions[action];
  console.log(result);
}

walkToTheOffice('grabACoffee'); // late
walkToTheOffice('keepWalking'); // on time

export const fakeDataDefaults = {
  String: 'Default string',
  Int: 1,
  Float: 1.14,
  Boolean: false,
  ID: 'id',
};

type FakeDataDefaults = typeof fakeDataDefaults;

export type StringType = FakeDataDefaults['String'];
export type IntType = FakeDataDefaults['Int'];
export type FloatType = FakeDataDefaults['Int'];
export type BooleanType = FakeDataDefaults['Boolean'];
export type IDType = FakeDataDefaults['ID'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tests = [
  Expect<Equal<StringType, string>>,
  Expect<Equal<IntType, number>>,
  Expect<Equal<FloatType, number>>,
  Expect<Equal<BooleanType, boolean>>,
  Expect<Equal<StringType, string>>
];

// N.B: problem with this approach (as an alternative for as const) is that it only for first level in case non-primitive which is why "whatever gets a string as datatype while it should get `12` as datatype "
export const programModeEnumMapFreeze = Object.freeze({
  GROUP: 'group',
  // ANNOUNCEMENT: 'announcement',
  // ONE_ON_ONE: '1on1',
  // SELF_DIRECTED: 'selfDirected',
  // PLANNED_ONE_ON_ONE: 'planned1on1',
  PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
  cool: {
    whatever: '12',
  },
});

// N.B: wheres as const works on any level on nesting correctly (not just like Object.freeze which only works on first level)
export const programModeEnumMap = {
  GROUP: 'group',
  ANNOUNCEMENT: 'announcement',
  ONE_ON_ONE: '1on1',
  SELF_DIRECTED: 'selfDirected',
  PLANNED_ONE_ON_ONE: 'planned1on1',
  PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
  ANOTHER: {
    whatever: '12',
  },
} as const;

export type EnumAlt = typeof programModeEnumMap;

// N.B: When doing index-based, it can take a union as well as below (rather than just one)
export type IndividualProgram =
  | (typeof programModeEnumMap)['ONE_ON_ONE' | 'PLANNED_ONE_ON_ONE']
  | 'SELF_DIRECTED'
  | 'PLANNED_ONE_ON_ONE';

export type IndividualProgramAlt = Exclude<
  keyof typeof programModeEnumMap,
  'GROUP' | 'ANNOUNCEMENT' | 'ANOTHER'
>;

// Why as const needed ?

// ISSUE#1: by default typeof programModeEnumMap will be an object with string data type (just quickly check typeof programModeEnumMap) to verify
// ISSUE#2: but another issue since it will allow -> programModeEnumMap.GROUP = 'whatever' without as const,

// Solution: now with as const data type will string literal as assigned e.g. 'group', 'announcement' and prevent reassignment
// N.B:

export type GroupProgram = (typeof programModeEnumMap)['GROUP']; // 'group'
export type AnnouncementProgram = (typeof programModeEnumMap)['ANNOUNCEMENT']; // 'announcement'
export type OneOnOneProgram = (typeof programModeEnumMap)['ONE_ON_ONE']; // '1on1'
export type SelfDirectedProgram = (typeof programModeEnumMap)['SELF_DIRECTED']; // 'selfDirected'
// prettier-ignore
export type PlannedOneOnOnProgram = (typeof programModeEnumMap)['PLANNED_ONE_ON_ONE']; // 'planned1on1'
// prettier-ignore
export type PlannedSelfDirectedProgram = (typeof programModeEnumMap)['PLANNED_SELF_DIRECTED']; // 'plannedSelfDirected'

const frontendToBackendEnumMap = {
  singleModule: 'SINGLE_MODULE',
  multiModule: 'MULTI_MODULE',
  sharedModule: 'SHARED_MODULE',
} as const;

// typeof here go over the given data and determine its type

type Obj = typeof frontendToBackendEnumMap;

export type BackendModuleEnum = Obj[keyof Obj];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Test = Expect<
  Equal<BackendModuleEnum, 'SINGLE_MODULE' | 'MULTI_MODULE' | 'SHARED_MODULE'>
>;
