
// # A function never returns (e.g. if the function body has while(true){})
// # A function always throws (e.g. in function foo() { throw new Error('Not Implemented') } the return type of foo is never)

// let foo: never = 123; // Error: Type number is not assignable to never

// Okay as the function's return type is `never`
let bar: never = (() => {
  throw new Error(`Throw my hands in the air like I just don't care`);
})(); // IIFE

// Inferred return type: void (for backward compatability when compiled to js)
function failDeclaration(message: string) {
  throw new Error(message);
}

// be explicit
function failDeclaration2(message: string): never {
  throw new Error(message);
}

// Inferred return type: never
const failExpression = function (message: string) {
  throw new Error(message);
};

// void: a function that returns nothing (explicityly or implicitly)
// never: a function that never returns (i.e. always throws like bar)
