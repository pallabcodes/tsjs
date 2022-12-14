export type name = { name: string };
export type age = { age: number };

// type Union = name | age;

type Union = name | age | Intersection;

let union: Union;

// union = { name: "John" };
// union = { age: 11 };
// union = { name: "john", age: 11 };

// or, it could with Union (|) the property could just satisfy one of the given type but intersection has to satisfy both

type Intersection = name & age;

// here type Intersection is an object & it must have both properties from name & age (unless they are optional)
let intersection: Intersection = { age: 1, name: "John" };
