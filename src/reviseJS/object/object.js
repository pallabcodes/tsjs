const personPrototype = {
  greet() {
    console.log(`hello, my name is ${this.name}!`);
  }
}

function Person(name) {
  this.name = name;
}

Person.prototype = personPrototype;
Person.prototype.constructor = Person;



const person = {
  greet() {
    console.log(`Hello`);
  }
}
const john = Object.create(person);
console.log(john.greet());


// cloning [copying data from within source to target] : prioritizes the right side latest value

console.log(Object.assign({  }, { a: 1, b: 2 })); // { a: 1, b: 2 }
console.log(Object.assign({a: 1, b: 2}, {a: -1, b: 1} )); // { a: -1, b: 1 }


// copying the symbol-typed properties
const o1 = { a: 1 };
const o2 = { [Symbol("foo")]: 2 };

const obj = Object.assign({}, o1, o2);
console.log(obj, Object.getOwnPropertySymbols(obj));

// accessors

let map = {
  foo: 1,
  get bar() {
    return 2;
  }
};

let copy = Object.assign({}, map);
console.log(copy); // { foo: 'bar', bar: 2 }

function assigned(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // By default, Object.assign copies enumerable Symbols, too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}

copy = assigned({}, map);
console.log(copy); // { foo:1, get bar() { return 2 } }

