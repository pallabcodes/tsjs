const mySet = new Set();
mySet.add(1);

JSON.stringify(mySet); // "{}"

const map = new Map();
map.set(1);

JSON.stringify(map); // "{}"

const obj = { id: 1 };
JSON.stringify(obj); // "{id: 1}"

const list = [1];
JSON.stringify(list); // "[1]"

const fn = () => 2;
JSON.stringify(fn); // undefined

JSON.stringify("Hello, JavaScripters"); // '"Hello, JavaScripters"'

JSON.stringify(1); // "1"

JSON.stringify(false); // "false"

JSON.stringify(Symbol("foo")); // undefined

JSON.stringify(null); // "null"

JSON.stringify(undefined); // undefined