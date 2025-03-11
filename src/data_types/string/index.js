'use strict';

console.info(Function.prototype); // ƒ () { [native code] }

console.info(Object.prototype); // {.....}

console.log(typeof String); // 'function'

// String, i.e., function, inherits from Function.prototype

// N.B: Every function (here String) has its own 'prototype' and __proto__. The __proto__ links String with its parent, i.e., Function.prototype.

// Since both are functions, they each have their own prototype. However, both will also have their own methods and properties.
// console.info(String.prototype === Function.prototype); // This would be false as String.prototype is not the same as Function.prototype.

// If needed to validate whether String (i.e., a function) correctly inherits or links with its parent (i.e., Function.prototype):

// @ts-expect-error whatever
console.info(String.__proto__ === Function.prototype); // true

// Example 1: Using substr
console.log(String.prototype.substr.apply('greetings', [0, 2])); // "gr"

// Example 2: Using toString
console.log(String.prototype.toString.apply('java', [])); // "java"


// `String` is a constructor function, so it should be called with `new` and not directly with `call`, `apply`, or `bind`.

// `String` is a constructor function, so it's callable when used with `new` or directly as a type conversion (e.g., String("hello")).
// `call` and `apply` are available because `String` inherits from `Function.prototype`, but you can't directly invoke `String` as a normal function.
// `String.call` and `String.apply` work for method invocations on String's prototype, but `String` itself is not callable like a regular function.

// Examples:

// 1. String as a constructor function (converts to a string)
console.log(String("hello")); // "hello"

// 2. String.call works, invoking the constructor function with null context
console.log(String.call(null, "hello")); // "hello"

// 3. String.apply works as well, similar to String.call
console.log(String.apply(null, ["hello"])); // "hello"

// 4. Direct String.apply with invalid parameters will not work as expected
// Example: This will not work as expected
// console.log(String.apply("hello", [])); // TypeError: String is not a function


console.log(typeof String); // "function" - String is a function
console.log(String.prototype); // Shows the prototype object for String instances
console.log(typeof String.apply); // "undefined" - String itself doesn't have the apply method
console.log(typeof Function.prototype.apply); // "function" - apply exists on Function.prototype


// Example 1: Using substr
String.prototype.substr.apply("greetings", [0, 2]); // "gr"

// Example 2: Using toString (empty array since toString method doesn't expect any argument)
String.prototype.toString.apply("java", []); // "java"
