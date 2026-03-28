// READ: Reflect is nothing but another way to READ, INSERT, ACCESS, DELETE an object (nothing more, nothing less) which is done below

const person = { name: 'john', age: 10 };

// N.B: just like it can access to property then it should be able to access methods and symbols from this person object too
console.log(Reflect.get(person, 'name')); // 'john'

// N.B: similarly, key could be string/symbol and value could whatever off course
Reflect.set(person, 'name', 'Anna');

console.log(Reflect.get(person, 'name'));

console.log(Reflect.has(person, 'name'));

Reflect.deleteProperty(person, 'age');

console.log(person);

// First argument: Array.prototype.reverse, which is the method that reverses an array.
// Second argument: The array[1, 2, 3, 4, 5] is passed as the context(this) for the reverse method.
// Third argument: An empty array[] is passed because the reverse method doesn't take any arguments.

// ## Reflect.apply()

// method, thisArg, parameters

console.log(Reflect.apply(Array.prototype.reverse, [1, 2, 3, 4, 5], []));
console.info(Reflect.apply(Math.floor, undefined, [1.75])); // 1;
console.info(Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111])); // "hello"
console.info(Reflect.apply("".charAt, "ponies", [3])); // "i"

// ## Reflect.construct()

class Person {
  constructor(name) {
    console.info(new.target); // Logs the function i.e. being called or rather everything about this class (i.e. just a constructor function underneaths) accessible from new.target
    this.name = name;
  }
}

function createPerson() {
  Reflect.construct(Person, ['James'], createPerson);  // Changing new.target
}

createPerson();

// This is how to instantiate a typical class
const person1 = new Person("Alice");
console.log(person1.name); // Output: Alice

// Does same with Reflect.construct(class/function to instantiate, arguments within array) so yeah it is same as new Person('John');

const person2 = Reflect.construct(Person, ["John"]);
console.log(person2.name); // Output: Bob



function Person(name) {
  this.name = name;
  console.log("Person constructor", new.target.name);
}

function Employee(name, position) {
  Person.call(this, name);  // Call the Person constructor with the name argument
  this.position = position;  // Set the position property for Employee
}

const employee = Reflect.construct(Person, ["Alice", "Manager"], Employee);
console.log(employee);  // Employee { name: 'Alice', position: 'Manager' }

function People(name) {
  this.name = name;
  console.log("Person constructor", new.target.name);  // new.target refers to the constructor being called
}

function Employee(name, position) {
  Person.call(this, name);  // Call the Person constructor with the name argument
  this.position = position;  // Set the position property for Employee
}

// Reflect.construct() mimics composition (what inheritance does for oop) by passing arguments from one constructor
// to another and applying properties accordingly. The third argument allows dynamic control over
// the constructor used as `new.target`, avoiding issues with `this` context by using explicit calls 
// (like `call`, `apply`, or `bind`) within the constructor functions.


Reflect.construct(Person, ["Alice"], Employee);  // Employee is passed as new.target

// 1. Dynamic Constructor Invocation

// Reflect.construct() allows you to call constructors dynamically with different parameters at runtime.This is especially useful in situations where you're not sure at compile time which constructor you want to use.

// For example, in a factory pattern or a dynamic class instantiation scenario, you can decide the class to instantiate dynamically.

// Example: Creating Instances Based on a Condition
// Imagine a scenario where you're developing a framework that needs to create objects of different classes dynamically based on some condition. Using Reflect.construct() can help you achieve this flexibility:

class Admin {
  constructor(name) {
    this.name = name;
    this.role = "admin";
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.role = "user";
  }
}

// Dynamically choose which class to instantiate based on input
function createInstance(type, name) {
  let targetClass;
  if (type === "admin") {
    targetClass = Admin;
  } else if (type === "user") {
    targetClass = User;
  } else {
    throw new Error("Unknown type");
  }

  // Dynamically create an instance of the chosen class
  return Reflect.construct(targetClass, [name]);
}

const adminInstance = createInstance("admin", "Alice");
console.log(adminInstance); // Admin { name: 'Alice', role: 'admin' }

const userInstance = createInstance("user", "Bob");
console.log(userInstance); // User { name: 'Bob', role: 'user' }

// Here, Reflect.construct() allows us to dynamically create instances of either the Admin or User class based on the type argument.Without Reflect.construct(), you'd have to use new Admin() or new User() directly.

// This is particularly useful in frameworks, libraries, or utilities where the specific class to instantiate might not be known ahead of time, and you want a dynamic, flexible solution.


// 2. Proxies and Advanced Metaprogramming

// Reflect.construct() becomes extremely useful in proxies and advanced meta-programming scenarios where you want to intercept class construction and possibly delegate or modify the behavior.

//   Example: Using Proxies with Reflect.construct()
// A proxy can intercept the creation of objects and modify the behavior during instantiation.In such a scenario, Reflect.construct() lets you handle how the constructor is called.

const handler = {
  construct(target, args) {
    console.log("Creating a new instance with arguments:", args);
    // Pass control to the original constructor using Reflect.construct
    const instance = Reflect.construct(target, args);
    instance.createdAt = new Date();
    return instance;
  }
};

class Person {
  constructor(name) {
    this.name = name;
  }
}

const ProxyPerson = new Proxy(Person, handler);

const jenny = new ProxyPerson("Jenny");
console.log(jenny); // Person { name: 'Alice', createdAt: [current date] }

// In this case, the proxy intercepts the construction of Person objects, adding a createdAt property without modifying the Person class itself. This would be much more complex without Reflect.construct().

// 3. More Control Over Constructor Invocation
// Reflect.construct() gives you fine - grained control over how constructors are invoked, especially with the ability to specify new.target.This is useful in factory functions or in scenarios where you want to handle object creation in a more controlled and flexible manner.

// Example: Factory Functions with Custom Behavior

class Animal {
  constructor(name) {
    this.name = name;
    this.type = "Animal";
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
    this.type = "Dog";
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    this.type = "Cat";
  }
}

function animalFactory(type, name) {
  const constructor = type === "dog" ? Dog : Cat;

  // Dynamically call the correct constructor and create the instance
  return Reflect.construct(constructor, [name]);
}

const dog = animalFactory("dog", "Buddy");
console.log(dog); // Dog { name: 'Buddy', type: 'Dog' }

const cat = animalFactory("cat", "Mittens");
console.log(cat); // Cat { name: 'Mittens', type: 'Cat' }

// Here, animalFactory is a function that dynamically picks which class (either Dog or Cat) to instantiate based on the type argument.Reflect.construct() allows for dynamic and flexible object creation.

// 4. Function Constructors(Dynamic Class - Like Behavior)
// Reflect.construct() can also be used with function constructors to simulate class-like behavior dynamically.This can be useful if you are working with code that doesn’t use ES6 class syntax or if you're trying to create classes from functions dynamically at runtime.

function Animal(name) {
  this.name = name;
}

function createInstance(func, args) {
  return Reflect.construct(func, args);
}

const doggy = createInstance(Animal, ["Rex"]);
console.log(dog); // Animal { name: 'Rex' }

// Conclusion: When Should You Use Reflect.construct() ?
//   While it's true that Reflect.construct() might not seem revolutionary in simple cases, its real value emerges in scenarios like:

// Dynamic class creation (e.g., factories, frameworks, libraries).
// Proxies and metaprogramming(where you need to intercept constructor calls).
// Flexible control over instantiation when you want to control how objects are created and what constructor is used(e.g., using new.target).

// For everyday use, new is usually sufficient, but Reflect.construct() shines in more complex, flexible, and dynamic programming patterns.


// Logging Behavior 1: Console log
function ConsoleLogger() {
  this.log = (message) => {
    console.log(`Console Log: ${message}`);
  };
}

// Logging Behavior 2: File log (simulated by logging to a file variable)
function FileLogger() {
  this.log = (message) => {
    // Simulate writing to a file
    console.log(`File Log (simulated): ${message}`);
  };
}

// Logging Behavior 3: Remote Server log (simulated)
function RemoteServerLogger() {
  this.log = (message) => {
    // Simulate sending to a remote server
    console.log(`Remote Server Log (simulated): ${message}`);
  };
}

// Middleware 1: Logger
function Logger(req, res, next) {
  console.log(`${req.method} request made to: ${req.url}`);
  next();
}

// Middleware 2: Authentication Check
function AuthMiddleware(req, res, next) {
  if (!req.headers['authorization']) {
    return res.status(401).send('Unauthorized');
  }
  next();
}

// Middleware 3: Error Handling
function ErrorHandler(err, req, res, next) {
  console.error(err.message);
  res.status(500).send('Something went wrong!');
}

// Function to compose middlewares dynamically
function composeMiddlewares(...middlewares) {
  return (req, res, next) => {
    let index = 0;

    function runMiddleware() {
      if (index < middlewares.length) {
        middlewares[index++](req, res, runMiddleware);
      } else {
        next();
      }
    }

    runMiddleware();
  };
}

// Example usage: Composing the middlewares for a route
const myRouteHandler = composeMiddlewares(Logger, AuthMiddleware, ErrorHandler);

// Simulating a request with the composed middlewares
const req = { method: 'GET', url: '/home', headers: {} }; // No Authorization header
const res = { status: (status) => { console.log(`Response Status: ${status}`); }, send: console.log };

// Applying the composed middlewares
myRouteHandler(req, res, () => console.log('Request successfully handled.'));


// Behavior 1: Base class with common properties and methods
function Base(name) {
  this.name = name;
  this.greet = function () {
    console.log(`Hello, ${this.name}!`);
  };
}

// Behavior 2: Adds extra functionality for a manager
function Manager(position) {
  this.position = position;
  this.manage = function () {
    console.log(`${this.name} is managing as a ${this.position}.`);
  };
}

// Function to dynamically create an Employee by combining Base and Manager behaviors
function createEmployee(name, position) {
  // Step 1: Create an instance of Base with the provided name
  const baseInstance = Reflect.construct(Base, [name]);

  // Step 2: Create an instance of Manager with the provided position
  const managerInstance = Reflect.construct(Manager, [position]);

  // Step 3: Combine the properties and methods of both instances into a new object
  Object.assign(baseInstance, managerInstance);

  return baseInstance; // Return the combined instance
}

// Create an Employee dynamically with both Base and Manager behaviors
const employee1 = createEmployee("Alice", "CEO");

// Call methods from both behaviors
employee1.greet();   // From Base: Greets the employee
employee1.manage();  // From Manager: Manages as the given position


// Real - World Example: Dependency Injection with Logging and Caching
// Let's create another readable example where we combine multiple behaviors (logging and caching) into a service dynamically:

// Behavior 1: Logging functionality
function Logger() {
  this.log = function (message) {
    console.log(`Log: ${message}`);
  };
}

// Behavior 2: Caching functionality
function Cacher() {
  this.cache = {}; // A simple object to store cached data
  this.getFromCache = function (key) {
    return this.cache[key];
  };
  this.addToCache = function (key, value) {
    this.cache[key] = value;
  };
}

// Service class with basic functionality
function Service(name) {
  this.name = name;
  this.fetchData = function () {
    console.log(`Fetching data for ${this.name}`);
  };
}

// Function to create a service with dynamic behaviors
function createService(name) {
  // Step 1: Create instances of Logger and Cacher behaviors
  const logger = Reflect.construct(Logger, []);
  const cacher = Reflect.construct(Cacher, []);

  // Step 2: Create a new Service instance
  const service = Reflect.construct(Service, [name]);

  // Step 3: Combine behaviors into the service object
  Object.assign(service, logger, cacher);

  return service; // Return the composed service
}

// Create a service dynamically with logging and caching behaviors
const myService = createService('MyService');

// Call methods from all behaviors
myService.fetchData();  // From Service: Fetch data
myService.log('This is a log message'); // From Logger: Log a message
myService.addToCache('key1', 'value1');  // From Cacher: Add to cache
console.log(myService.getFromCache('key1'));  // From Cacher: Get from cache


// Function to dynamically create a logger that can log to multiple destinations
function createLogger() {
  // Step 1: Create different logger behaviors
  const consoleLogger = Reflect.construct(ConsoleLogger, []);
  const fileLogger = Reflect.construct(FileLogger, []);
  const remoteServerLogger = Reflect.construct(RemoteServerLogger, []);

  // Step 2: Combine them into one object
  const logger = {
    logToConsole: consoleLogger.log,
    logToFile: fileLogger.log,
    logToRemote: remoteServerLogger.log
  };

  return logger;
}

// Create a logger that can log to multiple destinations
const myLogger = createLogger();

// Logging to console, file, and remote server
myLogger.logToConsole('This is a console log.');
myLogger.logToFile('This is a file log.');
myLogger.logToRemote('This is a remote server log.');


// 3. Dynamic Behavior Composition in a Payment System
// Imagine a payment system where users can choose between different payment methods(e.g., credit card, PayPal, and cryptocurrency).You can dynamically compose payment methods based on the user's choice.

// Payment Behavior 1: Credit Card Payment
function CreditCardPayment() {
  this.processPayment = (amount) => {
    console.log(`Processing credit card payment of $${amount}`);
  };
}

// Payment Behavior 2: PayPal Payment
function PayPalPayment() {
  this.processPayment = (amount) => {
    console.log(`Processing PayPal payment of $${amount}`);
  };
}

// Payment Behavior 3: Cryptocurrency Payment
function CryptoPayment() {
  this.processPayment = (amount) => {
    console.log(`Processing cryptocurrency payment of $${amount}`);
  };
}

// Function to create a payment processor based on the selected method
function createPaymentProcessor(method) {
  let paymentProcessor;

  if (method === 'credit_card') {
    paymentProcessor = Reflect.construct(CreditCardPayment, []);
  } else if (method === 'paypal') {
    paymentProcessor = Reflect.construct(PayPalPayment, []);
  } else if (method === 'crypto') {
    paymentProcessor = Reflect.construct(CryptoPayment, []);
  }

  return paymentProcessor;
}

// Example usage
const paymentMethod = 'paypal'; // User selects PayPal
const paymentProcessor = createPaymentProcessor(paymentMethod);

// Process the payment using the selected method
paymentProcessor.processPayment(100);


// ## Reflect.defineProperty()

const exampleMap = {};

console.info(Reflect.defineProperty(exampleMap, 'adventure', { value: 'begins' }));

console.info(Reflect.getOwnPropertyDescriptor(exampleMap)); //  { value: 'begins', writable: true, enumerable: true, configurable: true }
console.info(Reflect.getOwnPropertyDescriptor(exampleMap).value); // 'begins'

console.info(Reflect.getPrototypeOf(exampleMap)); // {} i.e. Object.prototype


// New objects are extensible.
const empty = {};
Reflect.isExtensible(empty); // true

// ...but that can be changed.
Reflect.preventExtensions(empty);
Reflect.isExtensible(empty); // false

// Sealed objects are by definition non-extensible.
const sealed = Object.seal({});
Reflect.isExtensible(sealed); // false

// Frozen objects are also by definition non-extensible.
const frozen = Object.freeze({});
Reflect.isExtensible(frozen); // false

Reflect.setPrototypeOf({}, Object.prototype); // true

// It can change an object's [[Prototype]] to null.
Reflect.setPrototypeOf({}, null); // true

// Returns false if target is not extensible.
Reflect.setPrototypeOf(Object.freeze({}), null); // false

// Returns false if it cause a prototype chain cycle.
const target = {};
const proto = Object.create(target);
Reflect.setPrototypeOf(target, proto); // false
