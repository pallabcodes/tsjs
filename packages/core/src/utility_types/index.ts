// # Awaited<>: basically this "Awaited" represents the (await data or then data)'s data type
type S = Awaited<Promise<string>>; // string
type N = Awaited<Promise<Promise<number>>>; // number
type BoolOrNum = Awaited<boolean | Promise<number>>; // boolean | number


// # Required<>
type Props = { a?: number, b?: string };

const obj1: Props = { a: 1 }
const obj2: Required<Props> = { a: 11, b: "hello ts" }

// # Readonly<>

type Todo = { title: string }

const todo: Readonly<Todo> = { title: "added title" }; // assigned value
// todo.title = "update title"; // but can't re-assign value since it's readonly


// # Record <KeyType, ValueType>

type CatInfo = { age: number, breed: string };
type CatName = "miffy" | "persian";

const cats: Record<CatName, CatInfo> = {
    miffy: { age: 10, breed: "Persian" },
    persian: { age: 16, breed: "British Shorthair" }
}

// # Pick<Type, Keys>

type Todo1 = {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo1, 'title' | 'completed'>;

const todo1: TodoPreview = {
    title: "clean room",
    completed: false
}


// # Omit<Type, Keys>

type TodoOmit = Omit<Todo1, "description">;
const todo2: TodoOmit = { title: "some", completed: false }


// # Exclude<UnionType, ExcludeMembers>: just exclude types(s) at the right side

type T0 = Exclude<"a" | "b" | "c" | "d", "a">; // "b" | "c" | "d"
type T1 = Exclude<"a" | "b" | "c" | "d", "b" | "c" | "d">; // "a"

type T2 = Exclude<"string" | "number" | (() => void), Function>; // string | number

type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; x: number }
    | { kind: "triangle"; x: number; y: number };

type T3 = Exclude<Shape, { kind: "circle" }>; // {kind: "square", x: number} | { kind: "triangle", x: number, y: number }

// # Extract<Type, Union>: just take or extract the type(s) at the right side

type T0_extract = Extract<"a" | "b" | "c", "a" | "f">;
type T1_extract = Extract<"string" | "number" | (() => void), Function>;

type Shape_extract =
    | { kind: "circle"; radius: number }
    | { kind: "square"; x: number }
    | { kind: "triangle"; x: number; y: number };

type T3_extract = Extract<Shape, { kind: "circle" }>; // {kind: "circle", radius: number}

// # NonNullable<Type> : exclude null / undefined from <Type>

type T0_notnull = NonNullable<string | number | undefined>; // string | number
type T1_notnull = NonNullable<string[] | null | undefined>; // string[]
type T2_notnull = NonNullable<null | undefined>; // never

// #  Parameters<Type>: makes a tupple type from the types used in the parameter of a function type Type 

declare function f1(arg: { a: number; b: string }): void;

type T0_parameter = Parameters<() => string>; // no parameter so type = []
type T1_parameter = Parameters<(s: string) => string>; // single parameter so type = [s: string]
type T2_parameter = Parameters<any>; // so type = unknown[]
type T3_parameter = Parameters<never>; // so type = never
type T4_parameter = Parameters<<T>(arg: T) => T>; // so type = [arg: unknown]

// # ConstructorParameters<Type>: makes a tuple type from from Type's parameter or never if Type is not a fn

type T0_constructorParameters = ConstructorParameters<ErrorConstructor>; // [message?: string]
type T1_constructorParameters = ConstructorParameters<FunctionConstructor>; // string[]

class C {
    constructor(a: number, b:string) {}
}

type T3_constructorParameters = ConstructorParameters<typeof C>; // [a: number, b: string]
type T4_constructorParameters = ConstructorParameters<any>; // unknown[]

// # ReturnType<Type>

declare function f2(): { a: number, b: string };

type T0_returnType = ReturnType<() => string>;
