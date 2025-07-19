"use strict";
const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26,
});
person.on("firstNameChanged", (newName) => {
    // (parameter) newName: string
    console.log(`new name is ${newName.toUpperCase()}`);
});
person.on("ageChanged", (newAge) => {
    // (parameter) newAge: number
    if (newAge < 0) {
        console.warn("warning! negative age");
    }
});
//# sourceMappingURL=the_template_literal_types.js.map