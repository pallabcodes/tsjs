export class Animal {
  constructor(public name: string) {}
}

class AnimalFarm implements Iterable<Animal> {
  private animalList: Animal[] = []; // Holds the list of animals

  constructor(animals?: Animal[]) {
    if (animals) {
      this.animalList = animals;
    }
  }

  // Adds an animal to the farm
  add(animal: Animal): void {
    this.animalList.push(animal);
  }

  // Returns the total number of animals
  get count(): number {
    return this.animalList.length;
  }

  // Iterator implementation
  [Symbol.iterator](): Iterator<Animal> {
    let index = 0;
    const animals = this.animalList;

    return {
      next(): IteratorResult<Animal> {
        if (index < animals.length) {
          // @ts-expect-error whatever
          return {
            value: animals[index++], // Ensured to be a valid Animal
            done: false,
          };
        } else {
          // For `done: true`, omit `value` as it's not required
          return { done: true } as IteratorResult<Animal>;
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
