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

type MyResult = MyType<string | number | boolean>;
type MyResult_ = MyType_<string | number | boolean>;

// infer type
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
type Str = Flatten<string[]>;
type Num = Flatten<number>;

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type InferSomething<T> = T extends infer U ? U : any;
type Inferred = InferSomething<1>;

// type InferSomething2<T> = T extends { a: infer A; b: number } ? A : any;
type InferSomething2<T> = T extends { a: infer A; b: infer B } ? A & B : any;
// type Inferred2 = InferSomething2<{ a: "hello typescript" }>; // type = any
// type Inferred2 = InferSomething2<{ a: "hello typescript"; b: 11 }>; // type = any
type Inferred2 = InferSomething2<{
  a: { someProp: "FIFA" };
  b: { gameRating: 10 };
}>; // type = any

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

type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

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
