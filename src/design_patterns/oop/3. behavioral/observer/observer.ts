// N.B: it is all about "notification" behavior

// Abstract Subject class
abstract class Subject<T = unknown> {
  constructor() {
    // Prevent instantiation of the abstract class
    if (new.target === Subject) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  // Method to register an observer; implement this in concrete subjects
  abstract registerObserver(observer: Observer<T>): void;

  // Method to remove an observer; implement this in concrete subjects
  abstract removeObserver(observer: Observer<T>): void;

  // Method to notify all observers; implement this in concrete subjects
  abstract notifyObservers(): void;
}

// Concrete Subject implementation
class ConcreteSubject extends Subject<number> {
  private observers: Observer<number>[] = []; // List of observers
  private value = 0; // Value to notify observers about

  // Register a new observer
  registerObserver(observer: Observer<number>): void {
    this.observers.push(observer); // Add observer to the list
  }

  // Remove an observer
  removeObserver(observer: Observer<number>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1); // Remove observer from the list
    }
  }

  // Notify all registered observers about changes
  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.value); // Send the current value to each observer
    }
  }

  // Update the value and notify observers
  setValue(value: number): void {
    this.value = value; // Change the value
    this.notifyObservers(); // Notify all observers about the new value
  }
}

// Abstract Observer class
abstract class Observer<T = unknown> {
  constructor() {
    // Prevent instantiation of the abstract class
    if (new.target === Observer) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  // Method to be implemented by concrete observers
  abstract update(value: T): void;
}

// Concrete Observer implementation
class ConcreteObserver extends Observer<number> {
  private value = 0;

  constructor(private subject: ConcreteSubject) {
    super();
    this.subject.registerObserver(this); // Register this observer with the subject
  }

  // This method is called when the subject notifies observers
  update(value: number): void {
    this.value = value; // Update the observer's value
    console.log(`Observer updated with value: ${value}`); // Log the update for demonstration
  }
}

// Abstract Store class
abstract class Store {
  constructor() {
    // Prevent instantiation of the abstract class
    if (new.target === Store) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  // Method to add a customer; implement this in concrete stores
  abstract addCustomer(customer: Customer): void;

  // Method to remove a customer; implement this in concrete stores
  abstract removeCustomer(customer: Customer): void;

  // Method to notify all customers; implement this in concrete stores
  abstract notifyCustomers(): void;

  // Method to update stock quantity; implement this in concrete stores
  abstract updateQuantity(quantity: number): void;
}

// Concrete Store implementation
class BookStore extends Store {
  private customers: Customer[] = []; // List of customers
  private stockQuantity = 0; // Current stock quantity

  // Add a customer to the notification list
  addCustomer(customer: Customer): void {
    this.customers.push(customer); // Register customer to receive updates
  }

  // Remove a customer from the notification list
  removeCustomer(customer: Customer): void {
    const index = this.customers.indexOf(customer);
    if (index !== -1) {
      this.customers.splice(index, 1); // Unregister customer from updates
    }
  }

  // Notify all customers of stock updates
  notifyCustomers(): void {
    for (const customer of this.customers) {
      customer.update(this.stockQuantity); // Send the current stock quantity to each customer
    }
  }

  // Update the stock quantity and notify customers
  updateQuantity(quantity: number): void {
    this.stockQuantity = quantity; // Change stock quantity
    this.notifyCustomers(); // Notify customers of the new stock quantity
  }
}

// Abstract Customer class
abstract class Customer {
  constructor() {
    // Prevent instantiation of the abstract class
    if (new.target === Customer) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  // Method to be implemented by concrete customers
  abstract update(stockQuantity: number): void;
}

// Concrete Customer implementation
class BookCustomer extends Customer {
  private observedStockQuantity = 0;

  constructor(private store: BookStore) {
    super();
    this.store.addCustomer(this); // Register this customer with the store for updates
  }

  // Update method called when stock changes
  update(stockQuantity: number): void {
    this.observedStockQuantity = stockQuantity; // Update the customer's observed stock quantity
    if (stockQuantity > 0) {
      console.log('Hello, a book you are interested in is back in stock!'); // Notify the customer
    }
  }
}

// Demonstration of the pattern usage
const store = new BookStore(); // Create a new book store

const customer1 = new BookCustomer(store); // Create a new customer
// const customer2 = new BookCustomer(store); // Create another customer

// Use case: Setting stock quantity to 0
console.log('Setting stock to 0.');
store.updateQuantity(0); // Notify customers that stock is 0

// Use case: Setting stock quantity to 5
console.log('\nSetting stock to 5.');
store.updateQuantity(5); // Notify customers that stock is now 5

// Customer1 decides to stop receiving notifications
store.removeCustomer(customer1); // Remove customer1 from notifications

// Use case: Setting stock quantity to 2
console.log('\nSetting stock to 2.');
store.updateQuantity(2); // Notify remaining customers about the updated stock

// When to use the pattern:
// Use the pattern when you have one object (the Subject) that needs to notify multiple objects (Observers) about changes in its state.
// Common scenarios include UI frameworks where a model needs to update multiple views or notification systems where multiple subscribers need updates.
