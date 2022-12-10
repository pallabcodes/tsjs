
// ## Iterables
// An object is deemed iterable if it has an implementation for the Symbol.iterator property. Some built-in types like Array, Map, Set, String, Int32Array, Uint32Array, etc. have their Symbol.iterator property already implemented. Symbol.iterator function on an object is responsible for returning the list of values to iterate on.

function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs]
}

let someArray = [1, "string", false];
for (let entry of someArray) {
  console.log(entry); // 1, "string", false
}


let listed = [4, 5, 6];

for (let i of listed) {
  console.log(i); // 4, 5, 6
}


let pets = new Set<string>(["Cat", "Dog", "Hamster"]);
pets.add("species");
for (let pet in pets) {
  console.log(pet); // "species"
}
for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}