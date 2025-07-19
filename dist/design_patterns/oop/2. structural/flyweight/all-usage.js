"use strict";
class Character {
    constructor(intrinsicState) {
        this.intrinsicState = intrinsicState;
    }
    operation(extrinsicState) {
        console.log(`${this.intrinsicState} - ${extrinsicState}`);
    }
}
// Flyweight Factory
class CharacterFactory {
    constructor() {
        this.characters = {};
    }
    getCharacter(intrinsicState) {
        if (!this.characters[intrinsicState]) {
            this.characters[intrinsicState] = new Character(intrinsicState);
        }
        return this.characters[intrinsicState];
    }
}
// Usage example
const factory = new CharacterFactory();
const charA = factory.getCharacter('A');
const charB = factory.getCharacter('B');
charA.operation('First Instance'); // A - First Instance
charB.operation('Second Instance'); // B - Second Instance
// #### 2. **Object Pooling**
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }
    connect() {
        if (!this.isConnected) {
            console.log('Establishing a connection...');
            this.isConnected = true;
        }
    }
    operation(extrinsicState) {
        this.connect();
        console.log(`Database operation: ${extrinsicState}`);
    }
}
// Flyweight Factory for DatabaseConnection
class ConnectionPool {
    constructor() {
        this.pool = [];
    }
    getConnection() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        return new DatabaseConnection();
    }
    releaseConnection(connection) {
        this.pool.push(connection);
    }
}
// Usage example
const connectionPool = new ConnectionPool();
const connection1 = connectionPool.getConnection();
connection1.operation('Query 1');
connectionPool.releaseConnection(connection1);
const connection2 = connectionPool.getConnection();
connection2.operation('Query 2');
// #### 3. **Managing Large Collections of Objects**
class Tree {
    constructor(species) {
        this.species = species;
    }
    operation(extrinsicState) {
        console.log(`${this.species} tree at location ${extrinsicState}`);
    }
}
// Flyweight Factory for Trees
class Forest {
    constructor() {
        this.trees = {};
    }
    getTree(species) {
        if (!this.trees[species]) {
            this.trees[species] = new Tree(species);
        }
        return this.trees[species];
    }
}
// Usage example
const forest = new Forest();
const oakTree = forest.getTree('Oak');
const pineTree = forest.getTree('Pine');
oakTree.operation('Location 1');
pineTree.operation('Location 2');
// #### 4. **Externalizing the State**
class Car {
    constructor(model) {
        this.model = model;
    }
    operation(extrinsicState) {
        console.log(`${this.model} car with color: ${extrinsicState}`);
    }
}
// Flyweight Factory for Cars
class CarFactory {
    constructor() {
        this.cars = {};
    }
    getCar(model) {
        if (!this.cars[model]) {
            this.cars[model] = new Car(model);
        }
        return this.cars[model];
    }
}
// Usage example
const carFactory = new CarFactory();
const car1 = carFactory.getCar('Sedan');
car1.operation('Red');
const car2 = carFactory.getCar('SUV');
car2.operation('Blue');
//# sourceMappingURL=all-usage.js.map