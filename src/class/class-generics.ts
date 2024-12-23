class Goku<Type> {
  isSaiyan!: Type;
}

interface Saiyan {
  level: number;
  stamina: () => void;
}

export class Goten extends Goku<boolean> implements Saiyan {
  level!: number;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stamina(): void {}
}

export class Trunks implements Saiyan {
  level!: number;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stamina(): void {}
}

export class Greater {
  static hobby = 'watching movies';

  private _name!: string;

  get name(): string {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }

  private _surName!: string;

  get surName(): string {
    return this._surName;
  }

  set surName(value: string) {
    this._surName = value;
  }

  static getHobby(newHobby: string): typeof Greater {
    this.hobby = newHobby;
    return this;
  }
}

class Box<T = unknown> {
  public value!: T;
  public content = '';

  sameAs(other: this): boolean {
    return other.content === this.content;
  }

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

class DerivedBox extends Box<string> {
  otherContent = '?';
}

const base = new Box();
const derivedBox = new DerivedBox();

// This method will now correctly compare base.content with derivedBox.content
export const isSameContent = derivedBox.sameAs(base); // boolean

class FileSystemObject {
  constructor(public path: string, private networked: boolean) {}

  isFile(): this is FileRep {
    return this instanceof FileRep;
  }

  isDirectory(): this is Directory {
    return this instanceof Directory;
  }

  isNetworked(): this is Networked {
    return this.networked;
  }
}

class FileRep extends FileSystemObject {
  constructor(path: string, content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children!: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep('foo/bar.txt', 'foo');
// Correctly check types using type guards
if (fso.isFile()) {
  console.log('It is a file.');
} else if (fso.isDirectory()) {
  console.log('It is a directory.');
} else if (fso.isNetworked()) {
  console.log('It is networked.');
}

// Class expressions
const SomeClass = class<Type> {
  content!: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new SomeClass('Hello, World'); // Type inferred as string

// Abstract class example
abstract class Base {
  abstract getName(): string;
  printName() {
    console.log('Hello, ' + this.getName());
  }
}

// Subclass implements abstract class
class SubClass extends Base {
  getName(): string {
    return 'TypeScript Nice';
  }
}

const s = new SubClass();
s.printName();

// Function accepting a constructor
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}

// Base class is abstract, so it can't be instantiated, but it works for the SubClass
greet(SubClass);
// greet(Base); // Uncommenting this would cause an error because Base is abstract
