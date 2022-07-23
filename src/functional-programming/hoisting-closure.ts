// ## hoisting
console.log(x);
var x = "hoisting";
console.log(x);

// console.log(fn());
const fn = () => "hoisting concept"
console.log(fn());

console.log(learn());

function learn () {
  return "this is the hoisting";
}
console.log(learn());

// ## closure

// ## closure : lexical scope decide how a variable should be looked up from a fn/nested fn
// nested/inner function have access to its parent function i.e. lexical scoping i.e. part of the closure but not what closure is

// closure is a function that has access to its parent scope, even after the parent fn has popped of from stack
// closure is created during function declaration not during when fn is being executed i.e. function invocation

let global_value = 1;

const parentFn = () => {
  let value = 2;
  return (): void => {
    console.log(`global`, (global_value += 5));
    console.log(`local`, (value += 1));
  };
};

const result = parentFn(); // function innerFn () {....}
console.log(result);
result();
result();
result();
result();
console.log(global_value);



