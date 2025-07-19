"use strict";
// Symbol is just a built-in object that returns a "symbol primitive" also called "symbol value"
// Each Symbol must be unique, [Symbol.iterator] is for of and [Symbol.asyncIterator] is for await of
// this is how to maka a Symbol and then using it as property below
const sym = Symbol("desc");
const t1 = {
    foo: "bar",
    [Symbol.iterator]: "qux",
    [sym]: "sym",
};
console.log(t1.foo, t1.sym, t1[Symbol.iterator], t1["oh"]);
// [ t1[Symbol.iterator] ] = ["qux"]; [ ...t1[Symbol.iterator] ] = ["q", "u", x"]
// get all the Symbols from an object; returns array
Object.getOwnPropertySymbols(t1).forEach((item, index) => {
    console.log(item); // [Symbol.iterator]
    console.log(t1[item]); // now to get the value t1[item]
});
// get all of its own defined properties
Object.getOwnPropertyDescriptors(t1); // all
Object.getOwnPropertyNames(t1); // ["foo"]
Object.getOwnPropertyDescriptor(t1, "foo");
Object.getOwnPropertyDescriptor(t1, sym);
Object.getOwnPropertyDescriptor(t1, Symbol.iterator);
// making a plain object iterable with Symbol
const myIterable = {};
// @ts-ignore
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
};
// @ts-ignore
console.log([...myIterable]); // [1, 2] => to loop just do for (const item of [...myIterable]) {}
// same as before just using computed property here
const someObj = {
    *[Symbol.iterator]() {
        yield "a";
        yield "b";
    },
};
class Foo {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
    }
}
//# sourceMappingURL=symbol.js.map