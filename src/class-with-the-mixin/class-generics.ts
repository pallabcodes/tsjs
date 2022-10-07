class Goku<Type> {
  isSaiyan!: Type;
}

interface Saiyan {
  level: number;
  stamina: () => void;
}

class Goten extends Goku<boolean> implements Saiyan {
  level!: number;

  stamina(): void {
  }
}

class Trunks implements Saiyan {
  level!: number;

  stamina(): void {
  }
}

class Greater {
  static hobby: string = "watching movies";

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
  };

  set surName(value: string) {
    this._surName = value;
  };

  static getHobby(newHobby: string): typeof Greater {
    this.hobby = newHobby;
    return this;
  }
}

class Box<T = any> {
  public value!: T;
  public content: string = "";

  sameAs(other: this) {
    return other.content = this.content;
  }

  hasValue(): this is { value: T } {
    // here this's value is an object that value property whose type is T
    return this.value !== undefined;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derivedBox = new DerivedBox();

// this method will allow to compare the base.content === derivedBox.content
// derivedBox.sameAs(base)

class FileSystemObject {
  constructor(public path: string, private networked: boolean) {
  }

  isFile(): this is FileRep {
    return this instanceof FileRep;
  };

  isDirectory(): this is Directory {
    return this instanceof Directory;
  }

  isNetworked(): this is Networked & this {
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

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");
// if(fso.isFile()) {} else if(fso.isDirectory()) {} else if {fso.isNetworked()} {}

// class expressions
const SomeClass = class<Type> {
  content!: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new SomeClass("Hello, World"); // Type has been inferred from the argument here i.e. string

// abstract class : not allowed to be directly instantiated, abstract for field, class and method
abstract class Base {
  abstract getName(): string;
  printName() {
    console.log("Hello, " + this.getName());
  }
}
// this is not allowed with abstract class
// const b =  new Base()

// when extending the base class with abstract members has to be implemented within subclass like here getName

class SubClass extends Base {
  getName(): string {
    return "TypeScript Nice";
  }
}

// now the method/props can be used from subclass
const s = new SubClass()
s.printName();

// write a function that accept something like a constructor
function greet(ctor: new () => Base ) {
  // @ts-ignore
  const instance = new ctor();
  instance.printName()
}
// Base class is abstract, so it can't be instantiated, but it works for the SubClass
greet(SubClass);
// greet(Base);
