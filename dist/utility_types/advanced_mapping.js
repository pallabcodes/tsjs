"use strict";
// ## by using mapped types make some property (not all) optional conditionally
class ImplementationType {
}
// helper functions, to be used later
function strong() {
    return { marker: "strong" };
}
function weak() {
    return { marker: "weak" };
}
function unify(input) {
    // implementation is irrelevant now
    return {};
}
const unified = unify({ strong: strong(), weak: weak() });
// now this compiles...
const valid = [{ strong: "" }, { strong: "", weak: "" }];
class HandlerBase {
}
class HandlerA extends HandlerBase {
}
class HandlerB extends HandlerBase {
}
const value1 = {
    foo: [],
    bar: 3,
};
const value2 = {
    foo: undefined,
    bar: 3,
};
class Car {
    get hp() {
        return this.engine / 2;
    }
    get kw() {
        return this.engine * 2;
    }
}
function applySnapshot(car, snapshot) {
    let key;
    for (key in snapshot) {
        if (!snapshot.hasOwnProperty(key))
            continue;
        // car[key as number] = snapshot[key];
    }
}
const ODirection = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3,
};
// #Mapped Types: https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
//at the left side: loop, key Remapping with String Literals and Utility types
// at the right side: do whatever
//# sourceMappingURL=advanced_mapping.js.map