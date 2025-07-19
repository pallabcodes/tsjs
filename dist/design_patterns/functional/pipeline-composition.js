"use strict";
// A pipeline allows chaining functions together, enhancing readability and maintaining a clean flow.
const pipe = (...fns) => (initialValue) => fns.reduce((acc, fn) => fn(acc), initialValue); // reduce here means towards left, so start from rightmost
// Usage
const processNumber = pipe((n) => n + 2, (n) => n * 3, (n) => n - 4);
const pipedResult = processNumber(5); // result is 13
// Function composition
const compose = (...fns) => (initialValue) => fns.reduceRight((acc, fn) => fn(acc), initialValue); // towards right, so starts from leftMost
// Usage
const addOne = (x) => x + 1;
const multiplyBy2 = (x) => x * 2;
const composedFunction = compose(multiplyBy2, addOne);
console.log(composedFunction(5)); // result is 12
// N.B: composition / compose or pipe or pipeline
// # 1. Define Basic Behaviors as Functions
// Behavior 1: Can Fly
const canFly = () => ({
    fly: () => "I'm flying!",
});
// Behavior 2: Can Swim
const canSwim = () => ({
    swim: () => "I'm swimming!",
});
// Behavior 3: Can Run
const canRun = () => ({
    run: () => "I'm running!",
});
// #2. Create Composable Entities
// Create a Bird by composing behaviors
const createBird = () => ({
    ...canFly(),
    species: 'Bird',
});
// Create a Fish by composing behaviors
const createFish = () => ({
    ...canSwim(),
    species: 'Fish',
});
// Create a Cheetah by composing behaviors
const createCheetah = () => ({
    ...canRun(),
    species: 'Cheetah',
});
// #3. Use the Composed Objects
// Create instances of the composed objects
const parrot = createBird();
const salmon = createFish();
const cheetah = createCheetah();
// Interact with the instances
console.log(`${parrot.species}: ${parrot.fly()}`); // Output: Bird: I'm flying!
console.log(`${salmon.species}: ${salmon.swim()}`); // Output: Fish: I'm swimming!
console.log(`${cheetah.species}: ${cheetah.run()}`); // Output: Cheetah: I'm running!
// --------------------------------------------------------
// Base class
class Animal {
    constructor(name) {
        this.name = name;
    }
    makeSound() {
        return "Some sound";
    }
}
// Derived classes
class Bird extends Animal {
    fly() {
        return `${this.name} is flying!`;
    }
}
class Fish extends Animal {
    swim() {
        return `${this.name} is swimming!`;
    }
}
class Cheetah extends Animal {
    run() {
        return `${this.name} is running fast!`;
    }
}
// Usage
const parrot = new Bird("Parrot");
console.log(parrot.fly()); // Output: Parrot is flying!
const salmon = new Fish("Salmon");
console.log(salmon.swim()); // Output: Salmon is swimming!
const cheetah = new Cheetah("Cheetah");
console.log(cheetah.run()); // Output: Cheetah is running fast!
// ## Refactored to Use Composition Over Inheritance
// ## Step 1: Define Behaviors as Functions
// Mixin for Flying behavior
const canFly = (base) => ({
    fly: () => `${base.name} is flying!`,
});
// Mixin for Swimming behavior
const canSwim = (base) => ({
    swim: () => `${base.name} is swimming!`,
});
// Mixin for Running behavior
const canRun = (base) => ({
    run: () => `${base.name} is running fast!`,
});
//  #2. Step 2: Create Base Object Creator
const createAnimal = (name) => ({
    name,
    makeSound: () => "Some sound", // Common functionality can still be included
});
// ## 3. Step 3: Create Composed Objects
// Create a Bird with fly behavior
const createBird = (name) => {
    const animal = createAnimal(name);
    return { ...animal, ...canFly(animal) };
};
// Create a Fish with swim behavior
const createFish = (name) => {
    const animal = createAnimal(name);
    return { ...animal, ...canSwim(animal) };
};
// Create a Cheetah with run behavior
const createCheetah = (name) => {
    const animal = createAnimal(name);
    return { ...animal, ...canRun(animal) };
};
// ## 4. Step 4: Use the Composed Objects
// Usage
const parrot = createBird("Parrot");
console.log(parrot.fly()); // Output: Parrot is flying!
const salmon = createFish("Salmon");
console.log(salmon.swim()); // Output: Salmon is swimming!
const cheetah = createCheetah("Cheetah");
console.log(cheetah.run()); // Output: Cheetah is running fast!
// ----------------------------------------------------------------------------------------------------------------
// Mixin for Driving behavior
const canDrive = (base) => ({
    drive: () => `${base.name} is driving!`,
});
// Mixin for Flying behavior
const canFly = (base) => ({
    fly: () => `${base.name} is flying!`,
});
// Mixin for Delivering behavior
const canDeliver = (base) => ({
    deliver: (package) => `${base.name} delivered ${package}!`,
});
// Create a base object for common vehicle properties
const createVehicle = (name) => ({
    name,
    makeSound: () => "Vroom vroom!", // Common functionality
});
// Create a Car
const createCar = (name) => {
    const vehicle = createVehicle(name);
    return { ...vehicle, ...canDrive(vehicle), ...canDeliver(vehicle) };
};
// Create a Drone
const createDrone = (name) => {
    const vehicle = createVehicle(name);
    return { ...vehicle, ...canFly(vehicle), ...canDeliver(vehicle) };
};
// Usage
const car = createCar("Car");
console.log(car.drive()); // Output: Car is driving!
console.log(car.deliver("Pizza")); // Output: Car delivered Pizza!
const drone = createDrone("Drone");
console.log(drone.fly()); // Output: Drone is flying!
console.log(drone.deliver("Medicine")); // Output: Drone delivered Medicine!
//# sourceMappingURL=pipeline-composition.js.map