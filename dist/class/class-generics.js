"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameContent = exports.Greater = exports.Trunks = exports.Goten = void 0;
class Goku {
}
class Goten extends Goku {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stamina() { }
}
exports.Goten = Goten;
class Trunks {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    stamina() { }
}
exports.Trunks = Trunks;
class Greater {
    static { this.hobby = 'watching movies'; }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    get surName() {
        return this._surName;
    }
    set surName(value) {
        this._surName = value;
    }
    static getHobby(newHobby) {
        this.hobby = newHobby;
        return this;
    }
}
exports.Greater = Greater;
class Box {
    constructor() {
        this.content = '';
    }
    sameAs(other) {
        return other.content === this.content;
    }
    hasValue() {
        return this.value !== undefined;
    }
}
class DerivedBox extends Box {
    constructor() {
        super(...arguments);
        this.otherContent = '?';
    }
}
const base = new Box();
const derivedBox = new DerivedBox();
// This method will now correctly compare base.content with derivedBox.content
exports.isSameContent = derivedBox.sameAs(base); // boolean
class FileSystemObject {
    constructor(path, networked) {
        this.path = path;
        this.networked = networked;
    }
    isFile() {
        return this instanceof FileRep;
    }
    isDirectory() {
        return this instanceof Directory;
    }
    isNetworked() {
        return this.networked;
    }
}
class FileRep extends FileSystemObject {
    constructor(path, content) {
        super(path, false);
    }
}
class Directory extends FileSystemObject {
}
const fso = new FileRep('foo/bar.txt', 'foo');
// Correctly check types using type guards
if (fso.isFile()) {
    console.log('It is a file.');
}
else if (fso.isDirectory()) {
    console.log('It is a directory.');
}
else if (fso.isNetworked()) {
    console.log('It is networked.');
}
// Class expressions
const SomeClass = class {
    constructor(value) {
        this.content = value;
    }
};
const m = new SomeClass('Hello, World'); // Type inferred as string
// Abstract class example
class Base {
    printName() {
        console.log('Hello, ' + this.getName());
    }
}
// Subclass implements abstract class
class SubClass extends Base {
    getName() {
        return 'TypeScript Nice';
    }
}
const s = new SubClass();
s.printName();
// Function accepting a constructor
function greet(ctor) {
    const instance = new ctor();
    instance.printName();
}
// Base class is abstract, so it can't be instantiated, but it works for the SubClass
greet(SubClass);
// greet(Base); // Uncommenting this would cause an error because Base is abstract
//# sourceMappingURL=class-generics.js.map