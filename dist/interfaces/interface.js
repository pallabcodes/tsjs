"use strict";
let john = {
    fistName: "John",
    surName: "Lena",
    age: 21,
    getSalary: (base = 100000) => base * 12,
    movieEarnings(bonus) {
        return this.getSalary(600000) + bonus || 100000;
    }
};
console.log(john.getSalary(500000), john.movieEarnings(400000));
// # interface guards using union '|', in, instanceof and typeof
const games = { title: "FIFA" };
if ("title" in games)
    console.log("It has title property");
const printInfo = (person) => {
    switch (person.type) {
        case "Student": {
            console.log(`${person.name} and his marks is ${person.marks} `);
            break;
        }
        case "Player": {
            console.log(`${person.name} and his team is ${person.teamName} `);
            break;
        }
    }
};
printInfo({ type: "Student", name: `John`, marks: 100 });
printInfo({ type: "Player", name: `John`, teamName: "FC BARCA" });
// however if there's no distinct property then instanceof may be used for classes
class Student1 {
    constructor(name, marks) {
        this.name = name;
        this.marks = marks;
    }
    getMarks() {
        return this.marks;
    }
}
class Player1 {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
    getScore() {
        return this.score;
    }
}
const printInfo1 = (person) => {
    if (person instanceof Student1) {
        console.log(`${person['marks']}`);
    }
    else {
        console.log(`${person['score']}`);
    }
};
printInfo1(new Student1("Ross Geller", 100));
printInfo1(new Player1("Ross Geller", 120));
// # interface declaration
//# sourceMappingURL=interface.js.map