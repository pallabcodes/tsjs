"use strict";
// ## Iterables = Array, string, Map, Set etc.
// plain object is not iterable thus needed to use Object.keys, Object.values, Object.entries or for in
function toArray(xs) {
    return [...xs];
}
let someArray = [1, "string", false];
for (let entry of someArray) {
    console.log(entry); // 1, "string", false
}
let listed = [4, 5, 6];
for (let i of listed) {
    console.log(i); // 4, 5, 6
}
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets.add("species");
for (let pet in pets) {
    console.log(pet); // "species"
}
for (let pet of pets) {
    console.log(pet); // "Cat", "Dog", "Hamster"
}
//# sourceMappingURL=async-iteration.js.map