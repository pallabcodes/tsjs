// ### Flyweight Pattern Use Cases
//
// The **Flyweight Pattern** is a structural design pattern that reduces the number of objects created by sharing common objects rather than creating new ones every time.
// It is useful when you need to optimize memory usage by sharing common data and separating the intrinsic state (shared) from the extrinsic state (unique to each object).
//
// Key scenarios where you would use the Flyweight pattern:
//
// 1. **Reducing Memory Usage**: Share common data and avoid duplicating it across multiple objects.
// 2. **Object Pooling**: Reuse existing objects to reduce the overhead of creating and destroying objects.
// 3. **Managing Large Collections of Objects**: Optimize memory consumption when working with large numbers of objects that have similar state.
// 4. **Externalizing the State**: Keep the unique state of each object outside the shared, immutable state to improve performance.
//
// #### 1. **Reducing Memory Usage**
interface Flyweight {
  operation(extrinsicState: string): void;
}

class Character implements Flyweight {
  constructor(private intrinsicState: string) {}

  operation(extrinsicState: string): void {
    console.log(`${this.intrinsicState} - ${extrinsicState}`);
  }
}

// Flyweight Factory
class CharacterFactory {
  private characters: { [key: string]: Character } = {};

  getCharacter(intrinsicState: string): Character {
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
class DatabaseConnection implements Flyweight {
  private isConnected = false;

  connect() {
    if (!this.isConnected) {
      console.log('Establishing a connection...');
      this.isConnected = true;
    }
  }

  operation(extrinsicState: string): void {
    this.connect();
    console.log(`Database operation: ${extrinsicState}`);
  }
}

// Flyweight Factory for DatabaseConnection
class ConnectionPool {
  private pool: DatabaseConnection[] = [];

  getConnection(): DatabaseConnection {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return new DatabaseConnection();
  }

  releaseConnection(connection: DatabaseConnection) {
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
class Tree implements Flyweight {
  constructor(private species: string) {}

  operation(extrinsicState: string): void {
    console.log(`${this.species} tree at location ${extrinsicState}`);
  }
}

// Flyweight Factory for Trees
class Forest {
  private trees: { [key: string]: Tree } = {};

  getTree(species: string): Tree {
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
class Car implements Flyweight {
  constructor(private model: string) {}

  operation(extrinsicState: string): void {
    console.log(`${this.model} car with color: ${extrinsicState}`);
  }
}

// Flyweight Factory for Cars
class CarFactory {
  private cars: { [key: string]: Car } = {};

  getCar(model: string): Car {
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
