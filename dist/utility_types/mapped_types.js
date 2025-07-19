"use strict";
// maka a new type from existing type
// this object's key must be from DayOfTheWeek and value type will be T
const chores = {
    sunday: "do the dishes",
    monday: "walk the dog",
    tuesday: "water the plants",
    wednesday: "take out the trash",
    thursday: "clean your room",
    friday: "mow the lawn",
    saturday: "relax",
};
// this object's key must be from DayOfTheWeek and value type will be T
const workDays = {
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
};
// so, here it makes a Type {A: number, B: number, someProperty: string}
const someRecord = {
    A: 1,
    B: 2,
    someProperty: "hello typescript",
};
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
const value3 = {
    bar: 3,
};
// https://stackoverflow.com/questions/66928064/typescript-mapped-type-add-optional-modifier-conditionally
class ImplementationType {
}
// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir
//# sourceMappingURL=mapped_types.js.map