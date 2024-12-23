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

console.log(Reflect.apply(Array.prototype.reverse, [1, 2, 3, 4, 5], []));

console.log(Math.max.apply(null, [1, 2, 3, 4, 5]));


