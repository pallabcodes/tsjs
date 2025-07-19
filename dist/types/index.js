"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateStarship = (id, starship) => {
};
updateStarship(1, { name: "Explorer", enableHyperJump: true });
const startShips = {
    Explorer1: { name: "Explorer1", enableHyperJump: true },
    Explorer2: { name: "Explorer2", enableHyperJump: false }
};
let johnsDrink = "coffee";
// let janesDrink: Exclude<AvailableDrinks, "tea" | "orange juice"> = "lemonade";
let janesDrink = "lemonade";
// let janesDrink_: Extract<AvailableDrinks, DrinksJaneLikes> = "mohito"; // wrong
let janesDrink_ = "coffee"; // wrong
function paintStarship(id, color) {
    return { id, color };
}
// paintStarship(1, undefined);
paintStarship(1, "magenta");
function Deletable(Base) {
    // this is the mixin :: class transformation
    return class extends Base {
        delete() {
        }
    };
}
class Vehicle {
    constructor(name) {
        this.name = name;
    }
}
class User {
    constructor(name) {
        this.name = name;
    }
}
/* whichever class given as argument will be extended from type Constructable; then Deletable function return a new brand new class  by extedning this class */
const DeletableVehicle = Deletable(Vehicle);
const DeletableUser = Deletable(User);
class Profile {
}
const profile = new Profile();
profile.user = new DeletableUser("john");
profile.vehicle = new DeletableVehicle("toyota");
const myObject = {
    sayHello() {
        return this.helloWorld();
    }
};
myObject.sayHello = myObject.sayHello.bind({
    helloWorld() {
        return `Hello World`;
    }
});
console.log(myObject.sayHello());
function makeObject(desc) {
    let data = desc.data || {};
    let methods = desc.methods || {};
    // to force type/shape on this object {...data, ...methods} used as D & M
    return { ...data, ...methods };
}
let obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx, dy) {
            // here, this will refer to D/data's values and M/methods value
            this.x += dx;
            this.y += dy;
        }
    }
});
obj.x = 10;
obj.y = 11;
obj.moveBy(4, 4);
let employee = {
    id: 1,
    name: `John`,
    city: "Boston",
    location: "US"
};
//# sourceMappingURL=index.js.map