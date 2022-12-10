// https://www.typescriptlang.org/docs/handbook/symbols.html#symbolreplace

type SymbolIndex = {
  [key: symbol | string]: string; // works
};


const sym = Symbol("desc");

const t1: SymbolIndex = {
  foo: "bar",
  [Symbol.iterator]: "qux",
  sym: "sym",
};

console.log(t1.foo, t1.sym, t1[Symbol.iterator], t1["oh"]);
