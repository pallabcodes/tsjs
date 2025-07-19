"use strict";
// OOP: ENCAPSULATION ABSTRACTION POLYMORPHISM INHERITANCE
// Encapsulation: Keeping product details (like price) hidden inside the Product class, and controlling access through getter and setter methods.
/**
 * 1. Encapsulation
 * Definition: Encapsulation is the concept of bundling data (properties) and methods (functions) that operate on the data into a single unit, usually a class. It also involves restricting direct access to some of the object's components (data or methods) to prevent unauthorized manipulation, often by using access modifiers like private, protected, and public.
 *
 * In TypeScript, we can use private and protected access modifiers to restrict access to certain properties and methods, while providing public methods to interact with these private members.
 *
 * Real-World Example: In the context of an e-commerce platform, we can encapsulate product details (like price and name) and restrict direct manipulation of these properties to ensure data integrity.
 *
 * Encapsulation: The name and price properties are private, meaning they cannot be accessed directly from outside the class. The public methods getName, getPrice, and setPrice provide controlled access to these properties.
 * */
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    // Public methods to interact with private data
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
            console.log('Price must be a positive number.');
        }
    }
}
// Usage
const product = new Product('Laptop', 1200);
console.log(product.getName()); // Laptop
console.log(product.getPrice()); // 1200
product.setPrice(1300); // Set a new price
console.log(product.getPrice()); // 1300
// product.price = 1500; // Error: 'price' is private and cannot be accessed
// Abstraction: The PaymentProcessor class defines an abstract processPayment method, hiding the complexity of each payment method (credit card, PayPal).
/**
 * 2. Abstraction
 * Definition: Abstraction is the concept of hiding complex implementation details and exposing only the essential features of an object. It simplifies interactions with the object, making it easier to use without needing to understand its inner workings.
 *
 * In TypeScript, abstraction is often achieved through abstract classes and interfaces, where we define only the necessary methods and leave the implementation to subclasses.
 *
 * Real-World Example: In an e-commerce system, we could define a PaymentProcessor abstract class that provides a blueprint for how payment processors should behave, but leaves the actual implementation of payment processing (e.g., using credit cards, PayPal) to subclasses.
 *
 * Abstraction: The PaymentProcessor abstract class defines the processPayment method but does not provide an implementation. Subclasses like CreditCardProcessor and PayPalProcessor implement processPayment, allowing us to handle payments without worrying about how each one is processed.
 */
class PaymentProcessor {
    constructor() {
        this.transactionId = Math.random().toString(36).substring(7);
    }
    getTransactionId() {
        return this.transactionId;
    }
}
class CreditCardProcessor extends PaymentProcessor {
    constructor(cardNumber) {
        super(); // Calls the parent class constructor
        this.cardNumber = cardNumber;
    }
    // Concrete implementation of the abstract method
    processPayment(amount) {
        console.log(`Processing payment of $${amount} with card ending in ${this.cardNumber.slice(-4)}.`);
    }
}
class PayPalProcessor extends PaymentProcessor {
    constructor(email) {
        super();
        this.email = email;
    }
    processPayment(amount) {
        console.log(`Processing PayPal payment of $${amount} for account ${this.email}.`);
    }
}
// Usage
const creditCardPayment = new CreditCardProcessor('1234567812345678');
creditCardPayment.processPayment(100);
const payPalPayment = new PayPalProcessor('user@example.com');
payPalPayment.processPayment(50);
// Polymorphism: The processPayment method behaves differently depending on the actual object type (either CreditCardProcessor or PayPalProcessor).
/**
 * 3. Polymorphism
 * Definition: Polymorphism allows objects of different types to be treated as objects of a common super type. The most common use of polymorphism is when a subclass overrides a method defined in the superclass. This allows us to call the same method on objects of different classes, and the appropriate method is called depending on the object's type.
 *
 * In TypeScript, polymorphism is achieved through method overriding, where a subclass provides its own implementation of a method defined in its superclass.
 *
 * Real-World Example: In our payment processing example, we can use polymorphism to process payments using different payment methods (credit card, PayPal), but the logic to process the payment remains the same (i.e., calling processPayment on any PaymentProcessor).
 *
 * Polymorphism: Both CreditCardProcessor and PayPalProcessor override the processPayment method from PaymentProcessor. In the Order class, we can treat any type of PaymentProcessor (credit card or PayPal) uniformly and call processPayment, relying on polymorphism to handle the specific implementation.
 *
 */
// Same PaymentProcessor and subclasses as before
class Order {
    constructor(paymentProcessor) {
        this.products = [];
        this.paymentProcessor = paymentProcessor;
    }
    addProduct(product) {
        this.products.push(product);
    }
    calculateTotal() {
        return this.products.reduce((total, product) => total + product.getPrice(), 0);
    }
    checkout() {
        const total = this.calculateTotal();
        console.log('Order summary:');
        this.products.forEach(product => console.log(`- ${product.getName()}: $${product.getPrice()}`));
        console.log(`Total: $${total}`);
        this.paymentProcessor.processPayment(total); // Polymorphism: Calls processPayment based on payment type
        console.log(`Transaction ID: ${this.paymentProcessor.getTransactionId()}`);
    }
}
// Usage
const order1 = new Order(new CreditCardProcessor('1234567812345678'));
order1.addProduct(new Product('Laptop', 1200));
order1.addProduct(new Product('Mouse', 50));
order1.checkout();
const order2 = new Order(new PayPalProcessor('user@example.com'));
order2.addProduct(new Product('Keyboard', 75));
order2.checkout();
// Inheritance: The CreditCardProcessor and PayPalProcessor classes inherit common functionality from the PaymentProcessor class.
/**
 * 4. Inheritance
 * Definition: Inheritance allows a class to inherit properties and methods from another class, promoting code reuse and a hierarchical class structure.
 *
 * In TypeScript, we use the extends keyword to create a subclass that inherits from a superclass. The subclass can reuse the methods of the superclass and override them if necessary.
 *
 * Real-World Example: The CreditCardProcessor and PayPalProcessor classes inherit from the PaymentProcessor class, meaning they both share common functionality like generating a transaction ID, but they can also implement specific payment processing logic.
 *
 * Inheritance: CreditCardProcessor and PayPalProcessor inherit from PaymentProcessor, reusing its transactionId property and getTransactionId method, while adding their own specific implementation for processing payments.
 */
//# sourceMappingURL=start.js.map