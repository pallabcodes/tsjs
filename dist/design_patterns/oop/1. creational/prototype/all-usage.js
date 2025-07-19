"use strict";
// ### Prototype Pattern Use Cases
class Document {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}
// Usage example
const originalDoc = new Document('Prototype Doc', 'This is the content');
const clonedDoc = originalDoc.clone();
console.log(clonedDoc); // Document { title: 'Prototype Doc', content: 'This is the content' }
// #### 2. **Avoiding Costly Instantiation**
class ExpensiveObject {
    constructor() {
        console.log('Expensive Object Initialization');
        this.configuration = 'Heavy Configuration';
    }
    clone() {
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
class Shape {
    constructor(type, dimensions) {
        this.type = type;
        this.dimensions = dimensions;
    }
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    setDimensions(width, height) {
        this.dimensions = { width, height };
    }
}
// Usage example
const rectangle = new Shape('Rectangle', { width: 10, height: 5 });
const square = rectangle.clone();
square.setDimensions(5, 5);
console.log(rectangle.dimensions); // { width: 10, height: 5 }
console.log(square.dimensions); // { width: 5, height: 5 }
class Dog {
    constructor(breed) {
        this.breed = breed;
    }
    makeSound() {
        console.log('Woof!');
    }
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}
// Usage example
const dog1 = new Dog('Golden Retriever');
const dog2 = dog1.clone();
dog2.makeSound(); // Woof!
// #### 5. **Storing Prototypes for Reuse**
class PrototypeRegistry {
    constructor() {
        this.prototypes = {};
    }
    addPrototype(name, prototype) {
        this.prototypes[name] = prototype;
    }
    getPrototype(name) {
        const prototype = this.prototypes[name];
        if (!prototype)
            throw new Error('Prototype not found');
        return prototype.clone();
    }
}
// Usage example
const registry = new PrototypeRegistry();
registry.addPrototype('dog', new Dog('Labrador'));
const clonedDog = registry.getPrototype('dog');
clonedDog.makeSound(); // Woof!
// #### 6. **Copy-on-Write Mechanisms**
class TextDocument {
    constructor(content, author) {
        this.content = content;
        this.author = author;
    }
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    setAuthor(newAuthor) {
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
//# sourceMappingURL=all-usage.js.map