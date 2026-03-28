'use strict';

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

// Testing iteration on various objects
console.log(isIterable({})); // false, plain object is not iterable by default
console.log(isIterable([])); // true, arrays are iterable
console.log(isIterable('string')); // true, strings are iterable

// Creating a class `Game` with iterable functionality
class Game {
  // Define the [Symbol.iterator] method to make this class iterable
  [Symbol.iterator]() {
    const players = ['Player1', 'Player2']; // Use `const` because `players` is not reassigned
    let index = 0;
    return {
      next: () => {
        if (index < players.length) {
          return { value: players[index++], done: false };
        } else {
          return { value: '', done: true }; // Ensure value is a string (empty string) when done
        }
      },
    };
  }
}

// Accessing Game prototype
console.log(Game.prototype); // { constructor: [Function: Game] } and other inherited methods

// Accessing the constructor of the class Game
console.log(Game.prototype.constructor); // [Function: Game]

// Checking prototype chain to confirm inheritance
console.log(Object.getPrototypeOf(Game.prototype) === Object.prototype); // true

// Check two levels up the prototype chain to Object's parent (should be null)
console.log(
  Object.getPrototypeOf(Object.getPrototypeOf(Game.prototype)) === null
); // true, since Object.prototype's prototype is null

// Instantiating the Game class
const gameInstance = new Game(); // Instantiates a Game class object

// Logging out the instance to show the constructor
console.log(gameInstance.constructor); // Game

// Checking iteration on Game instance (Game is iterable by default now)
console.log(isIterable(gameInstance)); // true, Game is iterable now

// Iterating over the Game instance using for..of
for (const player of gameInstance) {
  console.log(player); // Logs: Player1, Player2
}

// List of all JavaScript native built-in objects (as of 2024)
const builtInObjects = [
  'Object', 'Function', 'Boolean', 'Symbol', 'Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError',
  'Number', 'BigInt', 'Math', 'Date', 'String', 'RegExp', 'Array', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array', 'Map', 'Set', 'WeakMap', 'WeakSet', 'ArrayBuffer', 'SharedArrayBuffer', 'Atomics', 'DataView', 'JSON', 'Promise', 'Generator', 'GeneratorFunction', 'AsyncFunction', 'Reflect', 'Proxy', 'Intl', 'WebAssembly'
];

function inspectBuiltInObjects() {
  builtInObjects.forEach((name) => {
    try {
      const obj = globalThis[name]; // Access the global object dynamically

      console.log(`Inspecting: ${name}`);
      console.log(`Typeof: ${typeof obj}`);

      // Get prototype and handle cases where it might not exist
      const proto = Object.getPrototypeOf(obj) || 'No prototype';
      console.log(`Prototype:`, proto);

      console.log('---');
    } catch (error) {
      console.error(`Error inspecting ${name}:`, error);
    }
  });
}

inspectBuiltInObjects();


// Object
console.log(typeof Object); // 'function'
console.log(typeof Object.prototype); // 'object'

// needless to say, below properties/methods seems static to me , right ?

// I would like to see how this whole thing works when object having its own static methods or what , I believe below are static methods

// This is what available when Object.prototype: constructor, hasOwnProperty, isPrototypeOf, toLocalString, toString, toValueOf, __proto__, get __proto__, set __proto__,  __defineGetter__, __defineSetter__, __lookupGetter__, __lookupSetter__

// when an Object created though either new Object() or Object.create(), it is created by extending Object.prototype not Object which is why every object created has a typeof 'object'

function Game() { } // constructor function

// Below properties and methods what I get , when I do Game. and same when I do Function (so, what should i say , does Game i.e. function inherit from Function or what ?)

// I would like to see how this whole thing works when function having its own static methods or what , I believe below are static methods

// length, name, prototype, __proto__, apply, bind, call, constructor, hasOwnProperty, isPrototypeOf, propertyIsEnumerable, toString, toLocalString, valueOf(), __defineGetter__, __defineSetter__, __lookupGetter__, __lookupSetter__

console.log(typeof Game); // 'function' so off course it has call, bind and apply


// Why Math has no call, bind and apply ?

console.log(Math.max.apply(null, [1, 2, 3, 4, 5]));

const MyMath = Object.create(Object.prototype); // value must be an object or null and I know typeof Object.prototype is an 'object' so

// Add static properties to the Math object
Object.defineProperties(MyMath, {
  PI: { value: 3.141592653589793, writable: false, enumerable: true, configurable: false },
  E: { value: 2.718281828459045, writable: false, enumerable: true, configurable: false },
  // ...other constants
});

// Question: so, when {} it uses internally Object.create or new Object() ?

console.info(MyMath.E, MyMath.PI);

// Although, it doesn't give any error if done like

MyMath.PI = 10.5012313245646; // TypeError in 'use strict' mode, no effect in non-strict mode

// Add static methods to the Math object
Math.max = function (...args) {
  return args.reduce((max, num) => (num > max ? num : max), -Infinity);
};

Math.min = function (...args) {
  return args.reduce((min, num) => (num < min ? num : min), Infinity);
};

Math.pow = function (base, exponent) {
  return base ** exponent; // Example implementation
};

// More methods...
Math.sqrt = function (x) {
  if (x < 0) return NaN;
  return x ** 0.5;
};

// Freeze the Math object to prevent modification
Object.freeze(Math);

// Usage example
console.log(Math.PI); // 3.141592653589793
console.log(Math.max(1, 2, 3)); // 3
console.log(Math.sqrt(4)); // 2

// Inherits from Object.prototype: Object.create(Object.prototype) is used to establish the prototype chain.
// Static properties and methods: Math only has static properties and methods, so everything is directly defined on the object itself, not on a prototype.
// Constants are immutable: Properties like Math.PI are made immutable using Object.defineProperties with writable: false.
// Frozen object: Object.freeze(Math) ensures the Math object cannot be extended or modified.

// doubt: but since, writable set to false, it won't changed the og value so when logged

console.log(MyMath.PI); // 3.141592653589793

// Question: what would happen if used prototype chain ?

// Now, I know MyMath off course inherited from Object.prototype (so whatever properties + methods Object.prototype has MyMath of course have that)

// so, MyMath can access its parent properties + methods through __proto__ (i.e. known as prototype chain)

console.log(MyMath.__proto__); // so this is how MyMath can refer/access its parent object i.e. Object.prototype

console.info(MyMath.__proto__ === Object.prototype); // true

// Question: What is parent of Object.prototype 

console.info(Object.prototype.__proto__); // null (it supposed to be an object type) but due a bug null is type of null

// ## inheritance

const parent = {
  greet: function () {
    console.log('Hello from Parent!');
  }
};

// Create a new object with `parent` as its prototype
const child = Object.create(parent);

// The `child` object inherits from `parent`
child.greet(); // Output: "Hello from Parent!"


const base = {
  greeting: function () {
    console.log('Hello from base object');
  }
};

const subclass = {};

// Set `subclass`'s prototype to `base` using `Object.setPrototypeOf()` so now subclass.__proto__ = base
Object.setPrototypeOf(subclass, base);

programming.greeting();


// # To setup a prototype chain: Object.prototype vs Object.setPrototypeOf

// Yes, `Object.create(parent)` directly creates an object with `parent` as its prototype, while with `Object.setPrototypeOf(child, parent)`, you first create the `child` object and then explicitly set its prototype afterward.

// So, `Object.create()` saves the extra step needed with `Object.setPrototypeOf()`.


// 1. The constructor Property
// Every object and function has a constructor property pointing to the function that created it.Here's how it works:


// For Objects:
const obj = {}; // Created using Object
console.log(obj.constructor === Object); // true

// For Functions
function MyFunction() { }
console.log(MyFunction.constructor === Function); // true


// 2. Inheritance and the constructor Property

// When setting up inheritance, the constructor property of a child object can accidentally point to the parent’s constructor.This happens because of the prototype chain setup.

function Parent() { }
function Child() { }

// Child inherits from Parent
Child.prototype = Object.create(Parent.prototype);

const childInstance = new Child();

console.log(childInstance.constructor === Parent); // true (unexpected!)


// Fixing the constructor: After setting up the prototype chain, we should explicitly reset the constructor to the correct function.

Child.prototype.constructor = Child; // value should be a class or constructor function off course, so here used constructor function

console.log(childInstance.constructor === Child); // true


// 3. Cleaner Syntax for Prototype Chain Setup
// Instead of using __proto__, use Object.create() to set up the prototype chain.

const Parent = {
  greet: function () {
    return "Hello from Parent";
  },
};

const Child = Object.create(Parent); // Inherit Parent
Child.sayHi = function () {
  return "Hi from Child";
};

console.log(Child.greet()); // "Hello from Parent"
console.log(Child.sayHi()); // "Hi from Child"
console.log(Child.__proto__ === Parent); // true

// 4. Overwriting or Assigning a New Constructor
// You can overwrite a constructor by simply assigning a new function.However, this doesn’t change the prototype chain unless explicitly modified.

// Example: Overwriting the Constructor:

function OriginalConstructor() {
  this.message = "Original";
}

const instance = new OriginalConstructor();
console.log(instance.constructor === OriginalConstructor); // true

// Overwrite the constructor
OriginalConstructor = function () {
  this.message = "New Constructor";
};

const newInstance = new OriginalConstructor();
console.log(newInstance.message); // "New Constructor"

// Assigning a New Constructor(With Prototype Chain Adjustment):
// If you want a new constructor with inheritance intact:

function Parent() { }
function Child() { }

// Set up inheritance
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// Create instance
const childInstance2 = new Child();
console.log(childInstance2.constructor === Child); // true
console.log(childInstance2 instanceof Parent); // true


// ## Prototypal inheritance

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a noise.`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Inherit Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Extend Dog with new behavior
Dog.prototype.speak = function () {
  return `${this.name} barks.`;
};

const dog = new Dog("Rex", "Golden Retriever");
console.log(dog.speak()); // "Rex barks."
console.log(dog.constructor === Dog); // true
console.log(dog instanceof Animal); // true


// 1. Getters and Setters in Prototypes
// Getters and setters allow dynamic access and mutation of properties.They’re particularly useful for calculated properties or validation.

// Example with Getter and Setter in Inheritance:

function Parent() {
  this._name = "Parent";
}

Object.defineProperty(Parent.prototype, "name", {
  get() {
    return this._name;
  },
  set(value) {
    if (value) this._name = value;
  },
});

function Child() {
  Parent.call(this);
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child_ = new Child();
console.log(child_.name); // "Parent"
child_.name = "Child";
console.log(child_.name); // "Child"


// 2. Dynamic Constructors with Reflect and Proxy
// Using Reflect.construct, we can create dynamic constructors, allowing runtime adjustments.Pair this with Proxy for advanced manipulation.

// Example: Dynamic Constructor with Reflect:

function Animal(name) {
  this.name = name;
}

const DynamicAnimal = new Proxy(Animal, {
  construct(target, args) {
    console.log("Dynamic constructor invoked!");
    return Reflect.construct(target, args);
  },
});

const doggy = new DynamicAnimal("Rex");
console.log(doggy.name); // "Rex"

// Example: Dynamic Behavior with Proxy:

const DynamicAnimalWithBehavior = new Proxy(Animal, {
  construct(target, args) {
    const instance = Reflect.construct(target, args);

    // Add dynamic methods
    instance.speak = function () {
      return `${this.name} says hello dynamically!`;
    };

    return instance;
  },
});

const dynamicDog = new DynamicAnimalWithBehavior("Buddy");
console.log(dynamicDog.speak()); // "Buddy says hello dynamically!"

// 3. Using Symbol in Constructors
// Symbol can provide unique property keys that don’t conflict with inherited properties, enhancing encapsulation.

// Example: Private Fields with Symbol:

const _id = Symbol("id");

function Entity(id) {
  this[_id] = id;

  this.getId = function () {
    return this[_id];
  };
}

const entity = new Entity(42);
console.log(entity.getId()); // 42
console.log(entity._id); // undefined

// Inheritance with Symbol:
function Person(name) {
  this.name = name;
  this[_id] = Math.random(); // Unique ID
}

function Employee(name, role) {
  Person.call(this, name);
  this.role = role;
}

Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

const emp = new Employee("Alice", "Developer");
console.log(emp.name); // "Alice"
console.log(emp.role); // "Developer"
console.log(emp.getId?.()); // undefined (Symbol not exposed)


// 4. Inheritance and Overwriting Getters / Setters
// You can extend or override getters and setters in child classes.

// Example: Overriding Getters:

class Parent {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}

class Child1 extends Parent {
  get name() {
    return `Child: ${this._name}`;
  }
}

const child1 = new Child1("Johnny");
console.log(child1.name); // "Child: Johnny"
child1.name = "Tommy";
console.log(child1.name); // "Child: Tommy"


// 5. Dynamic Prototypes and Constructor Adjustment
// You can dynamically adjust constructors and prototype methods.

// Example: Adjusting Constructor at Runtime

function Shape(type) {
  this.type = type;
}

const dynamicShape = new Proxy(Shape, {
  construct(target, args) {
    const instance = Reflect.construct(target, args);

    // Add methods dynamically
    instance.describe = function () {
      return `A shape of type: ${this.type}`;
    };

    return instance;
  },
});

const square = new dynamicShape("Square");
console.log(square.describe()); // "A shape of type: Square"

// 6. Effects on Prototype Chains
// When using these dynamic approaches, the prototype chain remains intact but can be manipulated in real time.

// Example: Prototype Chain with Proxy:


const CustomPrototype = {
  greet() {
    return "Hello from CustomPrototype!";
  },
};

const customObject = Object.create(CustomPrototype);

console.log(customObject.greet()); // "Hello from CustomPrototype!"

// Add dynamic behavior
const dynamicCustomObject = new Proxy(customObject, {
  get(target, prop, receiver) {
    if (prop === "special") return "Special Value!";
    return Reflect.get(target, prop, receiver);
  },
});

console.log(dynamicCustomObject.greet()); // "Hello from CustomPrototype!"
console.log(dynamicCustomObject.special); // "Special Value!"


// 1. Dynamic Constructor
// A dynamic constructor adjusts its behavior at runtime.This can be achieved using Reflect.construct, Proxy, or a simple conditional check inside the constructor itself.

// Example: Conditional Constructor Based on Parameters

function Animal(type, age) {
  if (type === "dog") {
    this.sound = "bark";
    this.species = "dog";
  } else if (type === "cat") {
    this.sound = "meow";
    this.species = "cat";
  } else {
    this.sound = "unknown";
    this.species = "unknown";
  }
  this.age = age;
}

const doggo = new Animal("dog", 5);
console.log(doggo.sound); // "bark"
console.log(doggo.species); // "dog"

const cat = new Animal("cat", 3);
console.log(cat.sound); // "meow"
console.log(cat.species); // "cat"

const unknown = new Animal("bird", 2);
console.log(unknown.sound); // "unknown"
console.log(unknown.species); // "unknown"

// 2. Conditional Constructor with Proxy
// Using Proxy, we can dynamically create a constructor function where the behavior of object creation or method calls is altered based on certain conditions.This allows for more flexible and reusable code.

// Example: Conditional Constructor with Proxy

const AnimalProxy = new Proxy(function Animal(type, age) {
  this.type = type;
  this.age = age;
}, {
  construct(target, args) {
    const [type, age] = args;

    // Conditional logic before creating the object
    let sound = "unknown";
    let species = "unknown";

    if (type === "dog") {
      sound = "bark";
      species = "dog";
    } else if (type === "cat") {
      sound = "meow";
      species = "cat";
    }

    // Return the constructed object with dynamic behavior
    const instance = new target(type, age);
    instance.sound = sound;
    instance.species = species;

    return instance;
  }
});

const doggy_ = new AnimalProxy("dog", 5);
console.log(doggy_.sound); // "bark"
console.log(doggy_.species); // "dog"

const cat_ = new AnimalProxy("cat", 3);
console.log(cat_.sound); // "meow"
console.log(cat_.species); // "cat"

// 3. Dynamic Constructor with Reflect
// Reflect.construct allows you to programmatically invoke a constructor.It can be combined with conditions to dynamically decide what constructor to call.

// Example: Dynamic Constructor Selection

function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
  this.sound = "bark";
}

function Cat(name, breed) {
  this.name = name;
  this.breed = breed;
  this.sound = "meow";
}

function createAnimal(type, name, breed) {
  const constructor = type === "dog" ? Dog : Cat;
  return Reflect.construct(constructor, [name, breed]);
}

const dawg = createAnimal("dog", "Rex", "Labrador");
console.log(dawg.sound); // "bark"
console.log(dawg.name); // "Rex"

const catNap = createAnimal("cat", "Whiskers", "Siamese");
console.log(catNap.sound); // "meow"
console.log(catNap.name); // "Whiskers"


// 4. Dynamic Constructor with Modifications Based on Conditions
// You can modify the constructor further depending on runtime conditions.For example, based on a property passed to the constructor, you could add extra functionality or override default behaviors.

// Example: Conditional Constructor Behavior

function Vehicle(type, model, electric) {
  this.type = type;
  this.model = model;

  if (electric) {
    this.isElectric = true;
    this.charge = function () {
      console.log("Charging electric vehicle...");
    };
  } else {
    this.isElectric = false;
    this.fuel = function () {
      console.log("Filling up with gas...");
    };
  }
}

const tesla = new Vehicle("car", "Tesla Model 3", true);
tesla.charge(); // "Charging electric vehicle..."
console.log(tesla.isElectric); // true

const ford = new Vehicle("car", "Ford Mustang", false);
ford.fuel(); // "Filling up with gas..."
console.log(ford.isElectric); // false


// 5. Overriding Constructors Dynamically

// You can also dynamically override constructors.For instance, changing the behavior of a constructor mid - runtime, based on external conditions, could be done using Proxy, Reflect, or direct manipulation.

// Example: Changing Constructor Behavior Dynamically

function Person(name) {
  this.name = name;
}

const DynamicConstructor = new Proxy(Person, {
  construct(target, args) {
    const instance = Reflect.construct(target, args);
    instance.greet = function () {
      return `Hello, ${this.name}! Welcome to dynamic world.`;
    };
    return instance;
  },
});

const person = new DynamicConstructor("Alice");
console.log(person.greet()); // "Hello, Alice! Welcome to dynamic world."