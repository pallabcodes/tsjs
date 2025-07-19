"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
class Animal {
    constructor(name) {
        this.name = name;
    }
}
exports.Animal = Animal;
class AnimalFarm {
    constructor(animals) {
        this.animalList = []; // Holds the list of animals
        if (animals) {
            this.animalList = animals;
        }
    }
    // Adds an animal to the farm
    add(animal) {
        this.animalList.push(animal);
    }
    // Returns the total number of animals
    get count() {
        return this.animalList.length;
    }
    // Iterator implementation
    [Symbol.iterator]() {
        let index = 0;
        const animals = this.animalList;
        return {
            next() {
                if (index < animals.length) {
                    // @ts-expect-error whatever
                    return {
                        value: animals[index++], // Ensured to be a valid Animal
                        done: false,
                    };
                }
                else {
                    // For `done: true`, omit `value` as it's not required
                    return { done: true };
                }
            },
        };
    }
}
// Example Usage
const farm = new AnimalFarm();
farm.add(new Animal('Cow'));
farm.add(new Animal('Sheep'));
farm.add(new Animal('Goat'));
for (const animal of farm) {
    console.log(animal.name); // Outputs: Cow, Sheep, Goat
}
//# sourceMappingURL=symbol.js.map