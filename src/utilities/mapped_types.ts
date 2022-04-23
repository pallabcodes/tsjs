// maka a new type from existing type

type Properties = "propA" | "propB";

// type MappedProperties = {
//   [P in Properties]: boolean;
// };

// type MyMappedType<Properties extends string | number | symbol> = {
//   [P in Properties]: boolean;
// };

// type MyNewType = MyMappedType<"propA" | "propB">;

type MyMappedType<T> = {
  // P must be key of T object
  [P in keyof T]: T[P];
  // readonly [P in keyof T]: T[P]; // all properties within T will be readonly
  // [P in keyof T]?: T[P]; // all properties within T will be optional
  // [P in keyof T]: T[P] | null; // all properties within T will be optional
};

type MyNewType = MyMappedType<{ a: "a"; b: "b" }>;

type Pick1<T, Properties extends keyof T> = {
  [P in Properties]: T[P];
};

// type MyNewType2 = Pick1<{ a: "a"; b: "b" }, "a">;
type MyNewType2 = Pick1<{ a: "a"; b: "b" }, "a" | "b">;

type Record1<K extends keyof any, T> = {
  [P in K]: T;
} & { someProperty: string };

const someRecord: Record1<"A" | "B", number> = {
  A: 1,
  B: 2,
  someProperty: "hello typescript",
};
// someRecord.apples = "apples"; // wrong
// someRecord.oranges = "oranges"; // wrong

interface Record2 {
  [key: number]: number;
}
