// ### Prototype Pattern Use Cases

// The **Prototype Pattern** is a creational design pattern that allows cloning of objects, even complex ones, without coupling to their specific classes.

// It is useful when creating objects is expensive or when there is a need for multiple copies of an object with slight variations.

// # Key scenarios where you would use the Prototype pattern:

// 1. **Cloning Complex Objects**: Avoid reinitializing an object and duplicate it as needed.
// 2. **Avoiding Costly Instantiation**: Reuse existing objects when the cost of instantiating a new one is high.
// 3. **Creating Multiple Variants of an Object**: Quickly create similar objects with slight modifications.
// 4. **Abstracting the Cloning Process**: Let clients clone objects without needing to know their classes or constructors.
// 5. **Storing Prototypes for Reuse**: Maintain a registry of prototypes to reuse pre-configured instances.
// 6. **Copy-on-Write Mechanisms**: Create a copy of an object when it needs to be modified (common in shared resources).

// #### 1. **Cloning Complex Objects**
interface Prototype {
  clone(): this;
}

class Document implements Prototype {
  constructor(public title: string, public content: string) {}

  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

// Usage example
const originalDoc = new Document('Prototype Doc', 'This is the content');
const clonedDoc = originalDoc.clone();
console.log(clonedDoc); // Document { title: 'Prototype Doc', content: 'This is the content' }

// #### 2. **Avoiding Costly Instantiation**
class ExpensiveObject implements Prototype {
  private configuration: string;

  constructor() {
    console.log('Expensive Object Initialization');
    this.configuration = 'Heavy Configuration';
  }

  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  getConfig() {
    return this.configuration;
  }
}

// Usage example
const originalExpensiveObject = new ExpensiveObject();
const clonedExpensiveObject = originalExpensiveObject.clone();
console.log(clonedExpensiveObject.getConfig()); // Heavy Configuration

// #### 3. **Creating Multiple Variants of an Object**
class Shape implements Prototype {
  constructor(
    public type: string,
    public dimensions: { width: number; height: number }
  ) {}

  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  setDimensions(width: number, height: number) {
    this.dimensions = { width, height };
  }
}

// Usage example
const rectangle = new Shape('Rectangle', { width: 10, height: 5 });
const square = rectangle.clone();
square.setDimensions(5, 5);
console.log(rectangle.dimensions); // { width: 10, height: 5 }
console.log(square.dimensions); // { width: 5, height: 5 }

// #### 4. **Abstracting the Cloning Process**
interface Animal extends Prototype {
  makeSound(): void;
}

class Dog implements Animal {
  constructor(private breed: string) {}

  makeSound() {
    console.log('Woof!');
  }

  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

// Usage example
const dog1 = new Dog('Golden Retriever');
const dog2 = dog1.clone();
dog2.makeSound(); // Woof!

// #### 5. **Storing Prototypes for Reuse**
class PrototypeRegistry {
  private prototypes: { [key: string]: Prototype } = {};

  addPrototype(name: string, prototype: Prototype) {
    this.prototypes[name] = prototype;
  }

  getPrototype(name: string): Prototype {
    const prototype = this.prototypes[name];
    if (!prototype) throw new Error('Prototype not found');
    return prototype.clone();
  }
}

// Usage example
const registry = new PrototypeRegistry();
registry.addPrototype('dog', new Dog('Labrador'));

const clonedDog = registry.getPrototype('dog') as Dog;
clonedDog.makeSound(); // Woof!

// #### 6. **Copy-on-Write Mechanisms**
class TextDocument implements Prototype {
  constructor(public content: string, private author: string) {}

  clone(): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  setAuthor(newAuthor: string) {
    this.author = newAuthor;
  }

  getAuthor() {
    return this.author;
  }
}

// Usage example
const sharedDoc = new TextDocument('Shared Content', 'Alice');
const userSpecificDoc = sharedDoc.clone();
userSpecificDoc.setAuthor('Bob');

console.log(sharedDoc.getAuthor()); // Alice
console.log(userSpecificDoc.getAuthor()); // Bob
