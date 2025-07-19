"use strict";
// Command Pattern, Mediator
// Subject
class Stock {
    constructor(symbol) {
        this.symbol = symbol;
        // Use parameter property
        this.observers = [];
        this.price = 0;
    }
    // Add getter for price
    getPrice() {
        return this.price;
    }
    // Register a user for updates
    addObserver(user) {
        this.observers.push(user); // Add user to the list of observers
    }
    // Remove a user from updates
    removeObserver(user) {
        const index = this.observers.indexOf(user); // Find the index of the user
        if (index !== -1) {
            this.observers.splice(index, 1); // Remove user from the list
        }
    }
    // Notify all users about price changes
    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this.symbol, this.price); // Call the update method on each observer
        }
    }
    // Update stock price and notify users
    setPrice(newPrice) {
        this.price = newPrice; // Update the stock price
        this.notifyObservers(); // Notify users of the new price
    }
}
class User {
    constructor(name) {
        this.name = name;
    } // Use parameter property
    update(symbol, price) {
        console.log(`Hello ${this.name}, the price of ${symbol} is now $${price}!`);
    }
}
// Usage
const stock = new Stock('AAPL'); // Create a stock object for Apple Inc.
const user1 = new User('Alice'); // Create a user object for Alice
const user2 = new User('Bob'); // Create a user object for Bob
// Users subscribe to stock price updates
stock.addObserver(user1); // Alice is now observing AAPL
stock.addObserver(user2); // Bob is now observing AAPL
// Simulate price updates
stock.setPrice(150); // Notifies Alice and Bob about the new price
// Output:
// Hello Alice, the price of AAPL is now $150!
// Hello Bob, the price of AAPL is now $150!
stock.setPrice(155); // Notifies Alice and Bob again
// Output:
// Hello Alice, the price of AAPL is now $155!
// Hello Bob, the price of AAPL is now $155!
// Later, if Alice wants to stop receiving notifications
stock.removeObserver(user1); // Alice unsubscribes from updates
stock.setPrice(160); // Notifies only Bob about the new price
// Output:
// Hello Bob, the price of AAPL is now $160!
// Key TypeScript Changes:
//   Type Annotations:
//
//   Added type annotations for symbol, observers, and price in the Stock class.
// Added types for method parameters and return types (e.g., addObserver, removeObserver, notifyObservers, setPrice).
//   Explicitly defined User[] type for observers (array of User objects).
// Class Property Types:
//
//   symbol, observers, and price have been typed explicitly.
//   Method Types:
//
//   Methods like addObserver, removeObserver, notifyObservers, and setPrice now have appropriate return types (void since they don’t return any value).
//# sourceMappingURL=stock-price.trading.observer.js.map