export type name = { name: string };
export type age = { age: number };

// type Union = name | age;

type Union = name | age | Intersection;

let union: Union;

union = { name: "John" };
union = { age: 11 };
union = { name: "john", age: 11 };

// take unique properties from each other and for same properties they must be available at both
type Intersection = name & age;

let intersection: Intersection = { age: 1, name: "John" };
