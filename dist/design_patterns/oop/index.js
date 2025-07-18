"use strict";
// OOP is about encapsulation, abstraction, polymorphism and inheritance
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGateway = void 0;
// Here’s a **TypeScript** class that demonstrates **encapsulation**, **abstraction**, **polymorphism**, and **inheritance** using a real-world example of an **e-commerce platform with payment processing**.
// ### Code Example
// Abstract Class: Defines the blueprint for all payment gateways
class PaymentGateway {
    constructor() {
        this.transactionId = Math.random().toString(36).substring(7); // Generate a random transaction ID
    }
    getTransactionId() {
        return this.transactionId;
    }
}
exports.PaymentGateway = PaymentGateway;
// Subclass (Inheritance): Handles credit card payments
class CreditCardGateway extends PaymentGateway {
    constructor(cardNumber) {
        super(); // Calls the parent class constructor
        this.cardNumber = cardNumber;
    }
    // Polymorphism: Provides specific implementation for processPayment
    processPayment(amount) {
        console.log(`Processing credit card payment of $${amount} using card ending in ****${this.cardNumber.slice(-4)}.`);
    }
}
// Subclass (Inheritance): Handles PayPal payments
class PayPalGateway extends PaymentGateway {
    constructor(email) {
        super(); // Calls the parent class constructor
        this.email = email;
    }
    // Polymorphism: Provides specific implementation for processPayment
    processPayment(amount) {
        console.log(`Processing PayPal payment of $${amount} for account ${this.email}.`);
    }
}
// Product Class: Encapsulation to manage product details
class Item {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    getName() {
        return this.name;
    }
    getPrice() {
        return this.price;
    }
    setPrice(newPrice) {
        if (newPrice > 0) {
            this.price = newPrice;
        }
        else {
            console.log('Price must be positive.');
        }
    }
}
// Order Class: Combines encapsulation, abstraction, and inheritance
class ShoppingOrder {
    constructor(paymentGateway) {
        this.items = [];
        this.paymentGateway = paymentGateway;
    }
    addItem(item) {
        this.items.push(item);
    }
    calculateTotal() {
        return this.items.reduce((total, item) => total + item.getPrice(), 0);
    }
    checkout() {
        const total = this.calculateTotal();
        console.log('Order summary:');
        this.items.forEach(item => console.log(`- ${item.getName()}: $${item.getPrice()}`));
        console.log(`Total: $${total}`);
        this.paymentGateway.processPayment(total);
        console.log(`Transaction ID: ${this.paymentGateway.getTransactionId()}`);
    }
}
// Usage Example
const item1 = new Item('Smartphone', 800);
const item2 = new Item('Headphones', 150);
const item3 = new Item('Charger', 30);
// Using CreditCardGateway
const creditCardPayment = new CreditCardGateway('9876543212345678');
const order1 = new ShoppingOrder(creditCardPayment);
order1.addItem(item1);
order1.addItem(item2);
order1.checkout();
console.log('\n');
// Using PayPalGateway
const payPalPayment = new PayPalGateway('user@domain.com');
const order2 = new ShoppingOrder(payPalPayment);
order2.addItem(item3);
order2.checkout();
// ### Concepts Demonstrated:
// #### 1. **Encapsulation**:
// - The `Item` class encapsulates the `name` and `price` properties, providing `getName`, `getPrice`, and `setPrice` methods to manage access and validation.
// - The `ShoppingOrder` class encapsulates its list of items and the payment gateway, exposing only relevant methods (`addItem`, `checkout`).
//
// #### 2. **Abstraction**:
// - The `PaymentGateway` abstract class provides a high-level blueprint with the `processPayment` method.
// - Subclasses implement `processPayment` differently, abstracting payment logic from the main application.
//
// #### 3. **Polymorphism**:
// - Both `CreditCardGateway` and `PayPalGateway` implement `processPayment` differently. The `ShoppingOrder` class can work with any `PaymentGateway` type, relying on polymorphism to determine behavior at runtime.
//
// #### 4. **Inheritance**:
// - The `CreditCardGateway` and `PayPalGateway` classes inherit from the `PaymentGateway` abstract class, reusing and extending its functionality.
// ### Output:
// Order summary:
// - Smartphone: $800
// - Headphones: $150
// Total: $950
// Processing credit card payment of $950 using card ending in ****5678.
// Transaction ID: t2g9pz
//
// Order summary:
// - Charger: $30
// Total: $30
// Processing PayPal payment of $30 for account user@domain.com.
// Transaction ID: h4j2kz
// This example uses **real-world scenarios** (items, payments, orders) to showcase all four OOP principles cohesively.
//# sourceMappingURL=index.js.map