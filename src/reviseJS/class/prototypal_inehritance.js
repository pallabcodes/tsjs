// __proto has to be either object or null

// .__proto__ vs prototype : https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript

// ## Both prototype and __proto__ property available on these :

// "prototype property" is available to "Function/Constructor Function" e.g. function findById() {} / function Games () {}
// class itself not its instance i.e. class Games {} & every other built in object e.g. Object, Array, String, Number, Boolean, Map, Set

const person = {
  hobby: "Gaming"
};

const musician = {
  plays: true
};

// console.log(person.hobby);
// console.log(musician.hobby);

// musician.__proto__ = person;

// use getPrototypeOf & setPrototypeOf methods rather than __proto__
Object.setPrototypeOf(musician, person); // first argument: who needs? 2nd argument: from whom?

console.log(Object.getPrototypeOf(musician));
// console.log(Object.getPrototypeOf(musician) === musician.__proto__);

const guitarist = {
  strings: 6,
  __proto__: musician
};
console.log(guitarist, guitarist.strings);
console.log(guitarist["hobby"], guitarist["plays"]);

const vehicle = {
  seats: `silk`,
  doors: 4,
  get seatMaterial() {
    return this.seats;
  },
  set seatMaterial(material) {
    this.seats = material;
  }
};

// prototypal inheritance
const luxuryVehicle = { model: "Ferrari" };
Object.setPrototypeOf(luxuryVehicle, vehicle);
luxuryVehicle.seatMaterial = "leather";

console.log(luxuryVehicle);
console.log(luxuryVehicle.doors);
console.log(vehicle);
console.log(luxuryVehicle);
console.log(luxuryVehicle.valueOf());


// constructors
function Animal(species) {
  this.species = species;
  this.eats = true;
}

Animal.prototype.walks = function() {
  return `A ${this.species} is walking`;
};

const Bear = new Animal("bear");

console.log(Bear.species);
console.log(Bear.walks());

// This prototype property is where inheritable props and methods are
console.log(Bear.__proto__);
console.log(Object.getPrototypeOf(Bear) === Bear.__proto__, Bear.__proto__ === Animal.prototype);
console.log(Animal.prototype);
console.log(Bear);

// first, it'll look for within its properties then its own prototype i.e. o.__proto__ still not found o.__proto.__proto__ = Object's prototype
// o.__proto__ = own prototype ; o.__proto__.__proto = Object's prototype and o.__proto__.__proto.__proto__ = null

/*
o.__proto__
    {g: 1, f: 5}
    prototype : Object {
  __defineGetter__: function __defineGetter__()
  __defineSetter__: function __defineSetter__()
  lookupGetter__: function __lookupGetter__()
  lookupSetter__: function __lookupSetter__()
  proto__: Object {
    defineGetter__: function __defineGetter__()
    __defineSetter__: function __defineSetter__()
    __lookupGetter__: function __lookupGetter__()
    __lookupSetter__: function __lookupSetter__()
    __proto__: null
    constructor: function Object()
    hasOwnProperty: function hasOwnProperty()
    isPrototypeOf: function isPrototypeOf()
    propertyIsEnumerable: function propertyIsEnumerable()
    toLocaleString: function toLocaleString()
    toString: function toString()
    valueOf: function valueOf()
  <get __proto__()>: function __proto__()
  <set __proto__()>: function __proto__()
}
constructor: function Object()
hasOwnProperty: function hasOwnProperty()
isPrototypeOf: function isPrototypeOf()
propertyIsEnumerable: function propertyIsEnumerable()
toLocaleString: function toLocaleString()
toString: function toString()
valueOf: function valueOf()
<get __proto__()>: function __proto__()
<set __proto__()>: function __proto__()
}
*/


const oo = {
  a: 1,
  b: 2,
  __proto__: { g: 10, f: 5 }
};

console.log(oo, oo.__proto__.prototype);
console.log(oo["f"], oo["g"]);

const o = {
  a: 1,
  b: 2,
  // __proto__ sets the [[Prototype]]. It's specified here as another object literal.
  __proto__: {
    b: 3,
    c: 4,
    __proto__: {
      d: 5
    }
  }
};

// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> { d: 5 } ---> Object.prototype ---> null

console.log(o.d); // 5

const parent = {
  value: 2,
  method() {
    return this.value + 2;
  }
};

console.log(parent.method());

const child = {
  __proto__: parent
};
console.log(child.method(), child.value);
// child = {}
// child.__proto__ =  {
//   __proto: { value: 2, method: fn }
//   <prototype>: Object
// }

// now as known if value property exist within itself it will use that and won't look further so now this.value means child.value i.e. 10
child.value = 10;
console.log(child.method());

// child = { value : 10 }
// child.__proto__ =  {
//   __proto: { value: 2, method: fn }
//   <prototype>: Object
// }

// constructors
function Box(value) {
  this.value = value;
}

// so now any box made from Box constructor will have this "getValue method"
Box.prototype.getValue = function () {
  return this.value
}
const box1 = new Box(1);
const box2 = new Box(2)

// whatever Box's prototype ; is same available to box1/box2 ? yes
console.log(Box.prototype.isPrototypeOf(box1));
console.log(Box.prototype.isPrototypeOf(box2));


const boxes = [ new Box(1), new Box(2) ]
console.log(boxes);

// every instance made from constructor function will have constructor's prototype,

// const bx = {
//   constructor: {
//     arguments: null,
//     name: "Box",
//     length: 1,
//     prototype: {  },
//     <prototype>: Function
//   },
//   getValue: function () {},
//   <prototype>: Object
// }

console.log(Object.getPrototypeOf(new Box()) === Box.prototype);
console.log(box2.__proto__.constructor.prototype);


// function Foo() {}
// function Bar() {}
//
// Bar.prototype = Object.create(Foo.prototype);
//
// const bar = new Bar();
//
// // whatever `Bar` has is same available to bar? yes
// console.log(Bar.prototype.isPrototypeOf(bar));
// // whatever `Foo` has is same available to bar ? yes referring to line 195
// console.log(Foo.prototype.isPrototypeOf(bar));





