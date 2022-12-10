export type name = { name: string };
export type age = { age: number };

type Union = name | age;

// this object may have properties from either name or age or both as it seen below
const UsingUnion: Union = { name: "john" };

type Intersection = name & age;

// however, this object must have all properties from name & age as it seen below
const UIntersection: Intersection = { name: "john", age: 11 };


