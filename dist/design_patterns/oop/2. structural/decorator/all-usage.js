"use strict";
// ### Where to Use the **Decorator** Pattern:
// The **Decorator** pattern is useful when you need to add functionality to an object dynamically without altering its structure. This is especially helpful in situations where:
class Car {
    drive() {
        return 'Driving the car';
    }
}
// Decorator to add logging behavior
class CarWithLogging {
    constructor(car) {
        this.car = car;
    }
    drive() {
        const message = this.car.drive();
        console.log(`Logging: ${message}`); // Adds logging behavior dynamically
        return message;
    }
    getDescription() {
        return this.car.getDescription?.() || 'Car';
    }
}
// Usage
const myCar = new Car();
const myCarWithLogging = new CarWithLogging(myCar);
console.log(myCarWithLogging.drive());
// Make base Coffee class implement a common interface
class Coffee {
}
class BasicCoffee extends Coffee {
    cost() {
        return 5;
    }
    getDescription() {
        return 'Basic Coffee';
    }
}
// Decorators
class MilkDecorator extends Coffee {
    constructor(coffee) {
        super();
        this.coffee = coffee;
    }
    cost() {
        return this.coffee.cost() + 1;
    }
    getDescription() {
        return `${this.coffee.getDescription()} + Milk`;
    }
}
class SugarDecorator extends Coffee {
    constructor(coffee) {
        super();
        this.coffee = coffee;
    }
    cost() {
        return this.coffee.cost() + 0.5;
    }
    getDescription() {
        return `${this.coffee.getDescription()} + Sugar`;
    }
}
class SyrupDecorator extends Coffee {
    constructor(coffee) {
        super();
        this.coffee = coffee;
    }
    cost() {
        return this.coffee.cost() + 1.5;
    }
    getDescription() {
        return `${this.coffee.getDescription()} + Syrup`;
    }
}
// Usage
let myCoffee = new BasicCoffee();
myCoffee = new MilkDecorator(myCoffee); // Add milk
myCoffee = new SugarDecorator(myCoffee); // Add sugar
myCoffee = new SyrupDecorator(myCoffee); // Add syrup
console.log(`Total cost: $${myCoffee.cost()}`);
class BaseNotification {
    send(_message) {
        return 'Sending base notification';
    }
}
// Decorators for different notifications
class EmailNotification {
    constructor(notification) {
        this.notification = notification;
    }
    send(message) {
        const baseMessage = this.notification.send(message);
        return `${baseMessage} via Email`;
    }
}
class SMSNotification {
    constructor(notification) {
        this.notification = notification;
    }
    send(message) {
        const baseMessage = this.notification.send(message);
        return `${baseMessage} via SMS`;
    }
}
// Usage
let notification = new BaseNotification();
notification = new EmailNotification(notification); // Add email notification
notification = new SMSNotification(notification); // Add SMS notification
console.log(notification.send('Test message'));
class BaseLogger {
    log(message) {
        console.log(message);
    }
}
// Decorators to extend functionality
class ErrorLogger {
    constructor(logger) {
        this.logger = logger;
    }
    log(message) {
        this.logger.log(`[Error]: ${message}`); // Add error log behavior
    }
}
class InfoLogger {
    constructor(logger) {
        this.logger = logger;
    }
    log(message) {
        this.logger.log(`[Info]: ${message}`); // Add info log behavior
    }
}
class EmailAlertLogger {
    constructor(logger) {
        this.logger = logger;
    }
    log(message) {
        this.logger.log(message);
        console.log(`Sending email alert: ${message}`); // Add email alert behavior
    }
}
// Usage
let logger = new BaseLogger();
logger = new ErrorLogger(logger); // Add error logging
logger = new InfoLogger(logger); // Add info logging
logger = new EmailAlertLogger(logger); // Add email alert functionality
logger.log('This is a test message');
class BaseFileSystem {
    readFile(fileName) {
        return `Reading file: ${fileName}`;
    }
    writeFile(fileName, _content) {
        console.log(`Writing content to: ${fileName}`);
    }
}
// Decorators for wrapping functionality
class EncryptionDecorator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    readFile(fileName) {
        console.log('Decrypting file content...');
        return this.fileSystem.readFile(fileName); // Decrypt before reading
    }
    writeFile(fileName, content) {
        console.log('Encrypting file content...');
        this.fileSystem.writeFile(fileName, content); // Encrypt before writing
    }
}
class LoggingDecorator {
    constructor(fileSystem) {
        this.fileSystem = fileSystem;
    }
    readFile(fileName) {
        console.log(`Logging: Reading file ${fileName}`);
        return this.fileSystem.readFile(fileName);
    }
    writeFile(fileName, content) {
        console.log(`Logging: Writing to file ${fileName}`);
        this.fileSystem.writeFile(fileName, content);
    }
}
// Usage
let fs = new BaseFileSystem();
fs = new EncryptionDecorator(fs); // Add encryption
fs = new LoggingDecorator(fs); // Add logging
console.log(fs.readFile('file.txt'));
console.log(fs.writeFile('file.txt', 'New content'));
// - **Use case**: Used in services that require wrapping existing objects (e.g., file system operations) with additional behaviors like encryption, validation, or logging.
// ### Conclusion: These examples show how the **Decorator Pattern** can be applied in a variety of real-world product-based scenarios. The decorator pattern allows for the flexible extension of an object's functionality, and by using it, we can dynamically add behavior to objects, create complex configurations, and extend functionality without changing the original code structure.
//# sourceMappingURL=all-usage.js.map