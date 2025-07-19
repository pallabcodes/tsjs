"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persons = exports.users = void 0;
exports.logPerson = logPerson;
const mixin_1 = require("./mixin");
class Disposable {
    constructor() {
        this.isDisposed = false;
    }
    dispose() {
        this.isDisposed = true;
    }
}
class Activatable {
    constructor() {
        this.isActive = false;
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}
// Only extend a single class
// class Example extends Activatable, Disposable {}
class Exampl extends (0, mixin_1.DisposableMixin)((0, mixin_1.ActivatableMixin)(class {
})) {
    constructor() {
        super();
        this.number = "11";
        this.number = this.number + 1;
    }
}
const examl = new Exampl();
const Example = (0, mixin_1.DisposableMixin)((0, mixin_1.ActivatableMixin)(class {
    constructor() {
        this.number = 12;
    }
}));
function takeExample(example) {
    console.log(example.number);
}
exports.users = [
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
exports.persons /* <- Person[] */ = [
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
function logPerson(person) {
    let additionalInformation;
    if ('role' in person) {
        additionalInformation = person.role;
    }
    else {
        additionalInformation = person.occupation;
    }
    console.log(` - ${person.name}, ${person.age} ${additionalInformation}`);
}
// users.forEach(logPerson);
exports.persons.forEach(logPerson);
//# sourceMappingURL=index.js.map