import { ActivatableMixin, DisposableMixin } from "./mixin";

class Disposable {
  isDisposed: boolean = false;
  dispose() {
    this.isDisposed = true;
  }
}

class Activatable {
  isActive: boolean = false;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

// Only extend a single class
// class Example extends Activatable, Disposable {}

class Exampl extends DisposableMixin(ActivatableMixin(class {})) {
  number = "11";
  constructor() {
    super();
    this.number = this.number + 1;
  }
}

const examl: Exampl = new Exampl();

const Example = DisposableMixin(
  ActivatableMixin(
    class {
      number = 12;
    }
  )
);

// const example = new Example();

// get the type of the class
type Examplee = InstanceType<typeof Example>;

function takeExample(example: Examplee) {
  console.log(example.number);
}

type A<T> = (x: T) => T;
type B = <T>(x: T) => T;

interface GenericInterface<T> {
  (x: T): T;
}

type B2 = <T>(x: T) => T;

interface GenericInterface2 {
  <T>(x: T): T;
}

export type User = {
  name: string;
  age: number;
  occupation: string;
};

interface Admin {
  name: string;
  age: number;
  role: string;
}

export type Person = User | Admin;

export const users: User[] = [
  {
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  {
    name: "Kate Müller",
    age: 23,
    occupation: "Astronaut",
  },
];

export const persons: Person[] /* <- Person[] */ = [
  {
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  {
    name: "Jane Doe",
    age: 32,
    role: "Administrator",
  },
  {
    name: "Kate Müller",
    age: 23,
    occupation: "Astronaut",
  },
  {
    name: "Bruce Willis",
    age: 64,
    role: "World saver",
  },
];

// export function logPerson(user: User) {
//   console.log(` - ${user.name}, ${user.age}`);
// }

export function logPerson(person: Person) {
  let additionalInformation: string;
  if ('role' in person) {
    additionalInformation = person.role;
  } else {
    additionalInformation = person.occupation;
  }
  console.log(` - ${person.name}, ${person.age} ${additionalInformation}`);
}

// users.forEach(logPerson);
persons.forEach(logPerson);
