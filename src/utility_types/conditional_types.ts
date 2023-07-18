type SomeType = string;

type CustomSomeType = SomeType extends string ? string : null;

function someFunction<T>(value: T) {
  type A = T extends boolean
    ? "Type A"
    : T extends string
    ? "Type B"
    : T extends number
    ? "Type N"
    : "Type Z";
  const someOtherFunc = (someArg: A) => {
    //  a's value must be 'Type A or Type B'
    const a: A = someArg;
  };
  return someOtherFunc;
}

// const someFn = someFunction(true);
const someFn = someFunction(1);

type StringOrNot<T> = T extends string ? string : never;
type AUnion = string | number | boolean | null | never;

// type Exclude <T, U> = T extends U ? never : T;
type ResultType = Exclude<"a" | "b" | "c", "a" | "b">;
/*
'a' extends 'a' | 'b' ? never : 'a' :: here it returns never
'b' extends 'a' | 'b' ? never : 'b' :: here it returns never
'c' extends 'a' | 'b'   ? never : 'c' :: here it returns c
*/

type MyType<T> = T extends string | number ? T : never; // distributive
// type MyType_<T> = (() => T) extends () => string | number ? T : never; // non-distributive
type MyType_<T> = [T] extends [string | number] ? T : never; // non-distributive

// it doesn't take the extra boolean it stays as defined within "MyType<T>"
type MyResult = MyType<string | number | boolean>; // string | number

type MyResult_ = MyType_<string | number | boolean>; // never
type MyResult__ = MyType_<string | number>; // string | number

// infer type :
type UnpackArrayType<T> = T extends (infer R)[] ? R : T;
type T1 = UnpackArrayType<string[]>;
type T2 = UnpackArrayType<number>;

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
// so, here if Type argument is array, then infer its element via "type variable i.e. Item"
type Str = Flatten<string[]>;
type Num = Flatten<number>;

// if the type argument is a function , then infer its return value with an type variable i.e. Return
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never;

type InferSomething<T> = T extends infer U ? U : never;
// here, type argument is "1", & then type variable i.e. U also inferred from T; so U = infer T  = "1"
// is T assignable to infer T = "1" / U ="1", so if given value is other than "1" then it throws error like below

type Inferred = InferSomething<"1">;

// let value: Inferred = "2"; // throws error as its value could only be = "1"

interface Example {
  foo: string;
  permission: "READ" | "CREATE";
}

type GenericExample<T, K extends keyof T> = T extends infer U ? T[K] : never;
const generic: Array<GenericExample<Example, "permission">> = ["READ", "CREATE"];

// type InferSomething2<T> = T extends { a: infer A; b: number } ? A : any;
type InferSomething2<T> = T extends { a: infer A; b: infer B } ? A & B : never;
// type Inferred2 = InferSomething2<{ a: "hello typescript" }>;
// type Inferred2 = InferSomething2<{ a: "hello typescript"; b: 11 }>; // type = never
type Inferred2 = InferSomething2<{ a: { someProp: "FIFA" }; b: { gameRating: 10 } }>;

type MyFuncReturnValue = ReturnType<() => true>;

interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

// function createLabel(id: number): IdLabel;
// function createLabel(name: string): NameLabel;
// function createLabel(nameOrId: string | number): IdLabel | NameLabel;
// function createLabel(nameOrId: string | number): IdLabel | NameLabel {
//   throw "unimplemented";
// }

type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;

// now just single function needed
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
let x = createLabel("typescript");
let y = createLabel("golang");
let xy = createLabel(Math.random() ? "hello" : 11);

// type MessageOf<T extends { message: unknown }> = T["message"];
// interface Email {
//   message: string;
// }

// type EmailMessageContents = MessageOf<Email>;

// to make this fallback to never when not avaiable

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
type DogMessageContents = MessageOf<Dog>;

type PromiseReturnType<T> = T extends Promise<infer Response> ? Response : T;
type T = PromiseReturnType<string>;
