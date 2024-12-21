// ### Hybrid Factory + Singleton Pattern Use Cases
//
// The **Factory Pattern** allows for the creation of objects without specifying the exact class of object that will be created.
// The **Singleton Pattern** ensures that a class has only one instance and provides a global access point to that instance.
//
// Combining both patterns is useful when you need to ensure that a single instance of a class is created while also providing flexible object creation logic.

class Singleton {
  private static instance: Singleton;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  showMessage() {
    console.log('Singleton instance created');
  }
}

interface Product {
  doSomething(): void;
}

class ConcreteProductA implements Product {
  doSomething() {
    console.log('ConcreteProductA doing something');
  }
}

class ConcreteProductB implements Product {
  doSomething() {
    console.log('ConcreteProductB doing something');
  }
}

class ProductFactory {
  static createProduct(type: string): Product {
    if (type === 'A') {
      return new ConcreteProductA();
    } else if (type === 'B') {
      return new ConcreteProductB();
    }
    throw new Error('Unknown product type');
  }
}

// Usage example
const productA = ProductFactory.createProduct('A');
productA.doSomething(); // ConcreteProductA doing something

const singletonInstance = Singleton.getInstance();
singletonInstance.showMessage(); // Singleton instance created
