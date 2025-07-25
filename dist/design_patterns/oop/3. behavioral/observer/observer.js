"use strict";
// N.B: it is all about "notification" behavior
// Abstract Subject class
class Subject {
    constructor() {
        // Prevent instantiation of the abstract class
        if (new.target === Subject) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
    }
}
// Concrete Subject implementation
class ConcreteSubject extends Subject {
    constructor() {
        super(...arguments);
        this.observers = []; // List of observers
        this.value = 0; // Value to notify observers about
    }
    // Register a new observer
    registerObserver(observer) {
        this.observers.push(observer); // Add observer to the list
    }
    // Remove an observer
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1); // Remove observer from the list
        }
    }
    // Notify all registered observers about changes
    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this.value); // Send the current value to each observer
        }
    }
    // Update the value and notify observers
    setValue(value) {
        this.value = value; // Change the value
        this.notifyObservers(); // Notify all observers about the new value
    }
}
// Abstract Observer class
class Observer {
    constructor() {
        // Prevent instantiation of the abstract class
        if (new.target === Observer) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
    }
}
// Concrete Observer implementation
class ConcreteObserver extends Observer {
    constructor(subject) {
        super();
        this.subject = subject;
        this.value = 0;
        this.subject.registerObserver(this); // Register this observer with the subject
    }
    // This method is called when the subject notifies observers
    update(value) {
        this.value = value; // Update the observer's value
        console.log(`Observer updated with value: ${value}`); // Log the update for demonstration
    }
}
// Abstract Store class
class Store {
    constructor() {
        // Prevent instantiation of the abstract class
        if (new.target === Store) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
    }
}
// Concrete Store implementation
class BookStore extends Store {
    constructor() {
        super(...arguments);
        this.customers = []; // List of customers
        this.stockQuantity = 0; // Current stock quantity
    }
    // Add a customer to the notification list
    addCustomer(customer) {
        this.customers.push(customer); // Register customer to receive updates
    }
    // Remove a customer from the notification list
    removeCustomer(customer) {
        const index = this.customers.indexOf(customer);
        if (index !== -1) {
            this.customers.splice(index, 1); // Unregister customer from updates
        }
    }
    // Notify all customers of stock updates
    notifyCustomers() {
        for (const customer of this.customers) {
            customer.update(this.stockQuantity); // Send the current stock quantity to each customer
        }
    }
    // Update the stock quantity and notify customers
    updateQuantity(quantity) {
        this.stockQuantity = quantity; // Change stock quantity
        this.notifyCustomers(); // Notify customers of the new stock quantity
    }
}
// Abstract Customer class
class Customer {
    constructor() {
        // Prevent instantiation of the abstract class
        if (new.target === Customer) {
            throw new TypeError('Cannot construct Abstract instances directly');
        }
    }
}
// Concrete Customer implementation
class BookCustomer extends Customer {
    constructor(store) {
        super();
        this.store = store;
        this.observedStockQuantity = 0;
        this.store.addCustomer(this); // Register this customer with the store for updates
    }
    // Update method called when stock changes
    update(stockQuantity) {
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
//# sourceMappingURL=observer.js.map