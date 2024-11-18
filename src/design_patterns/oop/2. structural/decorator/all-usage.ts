// ### Where to Use the **Decorator** Pattern:
// The **Decorator** pattern is useful when you need to add functionality to an object dynamically without altering its structure. This is especially helpful in situations where:

// 1. **Adding Behavior to Objects Dynamically**: When you want to add behavior to a single object instance, but not the entire class.
// 2. **Complex Object Configuration**: When different combinations of behaviors are needed across multiple instances of objects.
// 3. **Enhancing Object Behavior**: You need to enhance an object's functionality without modifying the object itself.
// 4. **Extending Functionality**: When you want to add new functionality to an object without using inheritance or subclassing.
// 5. **Wrapping Existing Objects**: When you need to wrap existing objects with additional functionality.

// ### Example Scenarios with Decorator Pattern:
// #### 1. **Adding Behavior to Objects Dynamically**
// - **Scenario**: A logging system where you dynamically add logging functionality to various objects.

// Base Component (Product)
interface ICar {
  drive(): string;
  getDescription?(): string;
}

class Car implements ICar {
  drive(): string {
    return 'Driving the car';
  }
}

// Decorator to add logging behavior
class CarWithLogging implements ICar {
  private car: ICar;

  constructor(car: ICar) {
    this.car = car;
  }

  drive(): string {
    const message = this.car.drive();
    console.log(`Logging: ${message}`); // Adds logging behavior dynamically
    return message;
  }

  getDescription(): string {
    return this.car.getDescription?.() || 'Car';
  }
}

// Usage
const myCar = new Car();
const myCarWithLogging = new CarWithLogging(myCar);

console.log(myCarWithLogging.drive());
// - **Use cases**: This is useful in real-world products where logging, validation, or authentication can be added to services dynamically.

// #### 2. **Complex Object Configuration**
// - **Scenario**: A `Coffee` class where decorators dynamically add different types of milk, sugar, or syrups.

// Add description to base interface
interface ICoffee {
  cost(): number;
  getDescription(): string;
}

// Make base Coffee class implement a common interface
abstract class Coffee implements ICoffee {
  abstract cost(): number;
  abstract getDescription(): string;
}

class BasicCoffee extends Coffee {
  cost(): number {
    return 5;
  }

  getDescription(): string {
    return 'Basic Coffee';
  }
}

// Decorators
class MilkDecorator extends Coffee {
  private coffee: Coffee;

  constructor(coffee: Coffee) {
    super();
    this.coffee = coffee;
  }

  cost(): number {
    return this.coffee.cost() + 1;
  }

  getDescription(): string {
    return `${this.coffee.getDescription()} + Milk`;
  }
}

class SugarDecorator extends Coffee {
  private coffee: Coffee;

  constructor(coffee: Coffee) {
    super();
    this.coffee = coffee;
  }

  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  getDescription(): string {
    return `${this.coffee.getDescription()} + Sugar`;
  }
}

class SyrupDecorator extends Coffee {
  private coffee: Coffee;

  constructor(coffee: Coffee) {
    super();
    this.coffee = coffee;
  }

  cost(): number {
    return this.coffee.cost() + 1.5;
  }

  getDescription(): string {
    return `${this.coffee.getDescription()} + Syrup`;
  }
}

// Usage
let myCoffee = new BasicCoffee();
myCoffee = new MilkDecorator(myCoffee); // Add milk
myCoffee = new SugarDecorator(myCoffee); // Add sugar
myCoffee = new SyrupDecorator(myCoffee); // Add syrup

console.log(`Total cost: $${myCoffee.cost()}`);
// - **Use case**: Common in e-commerce apps, food delivery, or configuration-based products where different options can be applied to a base product.

// #### 3. **Enhancing Object Behavior**
// - **Scenario**: A notification system where different types of notifications (SMS, Email) enhance the base notification.

// Base Notification
interface INotification {
  send(message: string): string;
}

class BaseNotification implements INotification {
  send(_message: string): string {
    return 'Sending base notification';
  }
}

// Decorators for different notifications
class EmailNotification implements INotification {
  private notification: INotification;

  constructor(notification: INotification) {
    this.notification = notification;
  }

  send(message: string): string {
    const baseMessage = this.notification.send(message);
    return `${baseMessage} via Email`;
  }
}

class SMSNotification implements INotification {
  private notification: INotification;

  constructor(notification: INotification) {
    this.notification = notification;
  }

  send(message: string): string {
    const baseMessage = this.notification.send(message);
    return `${baseMessage} via SMS`;
  }
}

// Usage
let notification = new BaseNotification();
notification = new EmailNotification(notification); // Add email notification
notification = new SMSNotification(notification); // Add SMS notification

console.log(notification.send('Test message'));

// - **Use case**: Used in communication tools, messaging platforms, or notification systems where different modes of communication are layered onto a base notification.

// #### 4. **Extending Functionality**
// - **Scenario**: A logging system where various methods can dynamically add functionality like email alerts or logging levels (error, info, debug).

// Base Logger
interface ILogger {
  log(message: string): void;
}

class BaseLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}

// Decorators to extend functionality
class ErrorLogger implements ILogger {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  log(message: string): void {
    this.logger.log(`[Error]: ${message}`); // Add error log behavior
  }
}

class InfoLogger implements ILogger {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  log(message: string): void {
    this.logger.log(`[Info]: ${message}`); // Add info log behavior
  }
}

class EmailAlertLogger implements ILogger {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  log(message: string): void {
    this.logger.log(message);
    console.log(`Sending email alert: ${message}`); // Add email alert behavior
  }
}

// Usage
let logger: ILogger = new BaseLogger();
logger = new ErrorLogger(logger); // Add error logging
logger = new InfoLogger(logger); // Add info logging
logger = new EmailAlertLogger(logger); // Add email alert functionality

logger.log('This is a test message');
// - **Use case**: Logging systems, where different log levels (error, info, etc.) or external integrations (email notifications, file logging) are added dynamically.

// #### 5. **Wrapping Existing Objects**
// - **Scenario**: A file system service where we wrap the base file system functionality with encryption, logging, or validation.

// Base FileSystem service
interface IFileSystem {
  readFile(fileName: string): string;
  writeFile(fileName: string, content: string): void;
}

class BaseFileSystem implements IFileSystem {
  readFile(fileName: string): string {
    return `Reading file: ${fileName}`;
  }

  writeFile(fileName: string, _content: string): void {
    console.log(`Writing content to: ${fileName}`);
  }
}

// Decorators for wrapping functionality
class EncryptionDecorator implements IFileSystem {
  private fileSystem: IFileSystem;

  constructor(fileSystem: IFileSystem) {
    this.fileSystem = fileSystem;
  }

  readFile(fileName: string): string {
    console.log('Decrypting file content...');
    return this.fileSystem.readFile(fileName); // Decrypt before reading
  }

  writeFile(fileName: string, content: string): void {
    console.log('Encrypting file content...');
    this.fileSystem.writeFile(fileName, content); // Encrypt before writing
  }
}

class LoggingDecorator implements IFileSystem {
  private fileSystem: IFileSystem;

  constructor(fileSystem: IFileSystem) {
    this.fileSystem = fileSystem;
  }

  readFile(fileName: string): string {
    console.log(`Logging: Reading file ${fileName}`);
    return this.fileSystem.readFile(fileName);
  }

  writeFile(fileName: string, content: string): void {
    console.log(`Logging: Writing to file ${fileName}`);
    this.fileSystem.writeFile(fileName, content);
  }
}

// Usage
let fs: IFileSystem = new BaseFileSystem();
fs = new EncryptionDecorator(fs); // Add encryption
fs = new LoggingDecorator(fs); // Add logging

console.log(fs.readFile('file.txt'));
console.log(fs.writeFile('file.txt', 'New content'));

// - **Use case**: Used in services that require wrapping existing objects (e.g., file system operations) with additional behaviors like encryption, validation, or logging.

// ### Conclusion: These examples show how the **Decorator Pattern** can be applied in a variety of real-world product-based scenarios. The decorator pattern allows for the flexible extension of an object's functionality, and by using it, we can dynamically add behavior to objects, create complex configurations, and extend functionality without changing the original code structure.
