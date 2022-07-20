const obj1 = {
  languages: ['JS'],
  defColor: "blue",
  defMake: "Toyota",
  count: 0,

  // same name could be used for getter and setter but properties name should be different i.e. here count
  get countNumber() {
    return this.count;
  },

  set countNumber(value) {
    this.count += value;
  },

  get make() {
    return this.defMake;
  }
};
Object.defineProperty(obj1, "color", {
  get: function() {
    return this.defColor;
  },
  set: function(color) {
    this.defColor = color;
  }
});

obj1.color = "yellowGreen";
console.log(obj1.countNumber, obj1.defColor);

const obj2 = Object.defineProperties({  }, {
  "hobby": {
    value: "gaming",
    writable: true
  },
  "languages": {
    value: 'React',
    writable: false
  }
});

console.log(obj2.hobby, obj2.languages);


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
    return `hello`
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

