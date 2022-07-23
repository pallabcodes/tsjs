// ## hoisting

// ## IIFE (Immediately Invoked Function Expression)
const counter = ((value: number): Function => {
  let n: number = value;
  console.log(`initial value here is `, n);
  return (): void => {
    n += 1;
    console.log(n);
  };
})(0);

counter();
counter();

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


// Iterative vs Declarative Programming::
let array: Array<number> = [1, 2];

// Here, as seen step by step told to program what to do i.e. imperative programming

for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}

// just import from users; then what to do [not necessarily step by step mentioned unlike above loop]
// basically here told what to do, now how to do unlike the loop where told what to do and how to do exactly?
// import * from users;
// <div></div>


// These are some functional programming paradigms::

// ## 1. Pure Functions : Given the same input it returns the same output [idempotent function]
console.log(Math.abs(-1)); // given the same input i.e. here -1; it'll always return same output i.e. 1
console.log(Math.abs(0)); // 1

Math.abs(Math.abs(Math.abs(-1))); // still return the 1 value as the given input is basically same
Math.abs(Math.abs(Math.abs(Math.abs(1)))); // still return the 1 value as the given input is basically same

// SIDE EFFECTS: When interacting with anything literally outside the function that would change the data within function

// HOF: A function that takes function as argument or return a function or do both

// 2. Avoid mutability side effects : may copy but do not change the external values
const ages = [12, 22, 44, 45];
const newAges = ages.map(function(age) {
  if (age === 12) {
    return 20;
  } else {
    return age;
  }
});

const obj = Object.freeze({ change: "Locked" }); // the `freeze' enforces immutability
// obj.change = 0;
// delete obj.change;
// obj.addProp = "adding";

// any computation done within function should use its local variables and functional arguments
// copy external variable if needed from global state or variables

// ## Don't iterate since it alter the variable's value use something like map


function recurse(start: number = 1, end: number = 10): number | undefined {
  if (start === end) {
    console.log(start, end);
    return;
  } else {
    console.log(start);
    return recurse(start, end);
  }
}

recurse(1, 10); // 1, 2, 3, 4, 5, 6,7, 8, 9, 10

// ## decorator function : manual implementation [ adds new capabilities to an existing function]
let sum = (...args: any[]) => {
  // left to right move
  return args.reduce((acc: number, num: number): number => acc + num, 0);
};

console.log(sum(1, 2, 4, 5));

const callCounter = (fn: Function) => {
  let count = 0;
  return (...args: any[]) => {
    console.log(`sum has been called ${count += 1} times`);
    return fn(...args);
  };
};

sum = callCounter(sum); // this expects a function on which extra abilities need to be added
sum(1, 2, 4, 5); // now the arguments given

let rectangleArea = (length: number, width: number): unknown => {
  return length * width;
};

const countParams = (fn: Function) => {
  return (...params: any) => {
    if (params.length !== fn.length) {
      throw new Error(`Wrong number of parameters for ${fn.name}`);
    }
    return fn(...params);
  };
};

const requiredIntegers = (fn: Function) => {
  return (...params: any) => {
    params.forEach((param: any) => {
      if (!Number.isInteger(param)) {
        throw new TypeError(`Params for ${fn.name} must be integers`);
      }
    });
    return fn(...params);
  };
};

rectangleArea = countParams(rectangleArea);
rectangleArea = requiredIntegers(rectangleArea);

console.log(rectangleArea(20, 40));
console.log(rectangleArea(10, 5));

let requestData = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error: any) {
    console.log(error);
  }
};

const dataResponseTime = (fn: Function) => {
  return async (url: string) => {
    console.time("fn");
    const data = await fn(url);
    console.timeEnd("fn");
    return data;
  };
};

const testFn = async (): Promise<void> => {
  requestData = dataResponseTime(requestData);
  const data = await requestData("https://jsonplaceholder.typicode.com/posts");
  console.log(data);
};

testFn();


// ## currying: takes a function that receives more tha one parameter & breaks it to a series of unary (one parameter) fn
// thus, curried function only takes a single parameter at a time

const buildSandwich = (ingredient1: any) => {
  return (ingredient2: any) => {
    return (ingredient3: any) => {
      return `${ingredient1} ${ingredient2} ${ingredient3}`;
    };
  };
};

const sandwich = buildSandwich("Bacon")("Lettuce")("Tomato");
console.log(sandwich);

const buildSammy = (singed1: string) => (singed2: string) => (singed3: string) => `${singed1} ${singed2} ${singed3}`;
const sammy = buildSammy("turkey")("cheese")("bread");

// partial currying
const turkey = buildSammy(`turkey`);
const buyTurkeySammySandwich = turkey("cheese")("bread");

const multiply = (x: number, y: number) => x * y;
const curriedMultiply = (x: number) => (y: number) => x * y;

const multiplyBy2 = curriedMultiply(2);
const multiplyBy4 = curriedMultiply(4);

console.log(multiplyBy2(6));
console.log(multiplyBy2(7));

const updateElemText = (id: string) => (element: unknown) => document.querySelector(`#${id}`);
const updateHeaderText = updateElemText("header");
console.log(updateHeaderText("hello john"));

// maintaining a specific order
const addCustomer = (fn: Function) => (...args: any[]) => {
  console.log("registering customer");
  return fn(...args);
};

const processOrder = (fn: Function) => (...args: any[]) => {
  console.log(`processing order is #${args[0]}`);
  return fn(...args);
};

let completeOrder = (...args: any[]) => {
  console.log(`Order no #${[...args].toString()} has done`);
};

completeOrder = (processOrder(completeOrder));
console.log(completeOrder);
completeOrder = (addCustomer(completeOrder));
completeOrder(1000);

// https://dev.to/pegahsafaie/real-world-example-of-compose-function-and-currying-3ofl
// https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983

// function addCustomer1(...args: any[]) {
//   return function processOrder(...args: any[]) {
//     return function completeOrder(...args: any[]) {
//     };
//   };
// }


const curried = (fn: Function) => {
  const curried: (...args: any[]) => (any) = (...args: any[]) => {
      // the no. of parameters is = fn.length while as no. of the arguments
    if (fn.length !== args.length) {
      return curried.bind(null, ...args);
    }
    return fn(...args);
  };
  return curried;
};

const total = (x: number, y: number, z: number) => x + y + z;
const curriedTotal = curried(total);

console.log(curriedTotal(10)(11)(15));


// ## compose-pipe

const add2 = (x: number) => x + 2;
const subtract1 = (x: number) => x - 1;
const multiplyBy5 = (x: number) => x * 5;
console.log((add2(4)));

// reduceRight: move from right to left
const compose = (...fns: Array<Function>) => (value: any) => fns.reduceRight((prev, fn) => fn(prev), value);
// so first add2(4) = 6 : subtract1(6) - 1 = 5; multiplyBy5(5) * 4 = 20
const compResult = compose(multiplyBy5, subtract1, add2)(4);

// pipe do the same but from left to the right using reduce method
const pipe = (...fns: Array<Function>) => (value: any) => fns.reduce((prev, fn) => fn(prev), value);
const pipeResult = pipe(add2, subtract1, multiplyBy5)(5);
const pipeResult2 = pipe(add2, subtract1, multiplyBy5)(7);
console.log(pipeResult, pipeResult2);


const divideBy = (divisor: any, n: any) => n / divisor;
const piped = pipe(add2, subtract1, multiplyBy5, (x: any) => divideBy(2, x))(5);
console.log(piped);

// alternative
const divBy = (divisor: number) => (num: number) => num / divisor;
const divideBy2 = divBy(2);  // partially applied
const piped2 = pipe(add2, subtract1, multiplyBy5, divideBy2)(5);
console.log(piped2);

const lorem = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";
const splitOnSpace = (string: string): string[] => string.split(" ");
const count = (arr: any[]): number => arr.length;

const wordCount = pipe(splitOnSpace, count);
console.log(wordCount(lorem));

const ss = "go lang"
console.log(wordCount(ss));

const pal1 = `taco cat`;
const pal2 = `UFO tofu`;

const split = (str: string): string[] => str.split('');
const join = (arr: string[]): string => arr.join('');
const toLower = (str: string): string => str.toLowerCase();
const reverse = (arr: string[]): string[] => arr.reverse();

const fwd = pipe(splitOnSpace, join, toLower);
const rev = pipe(fwd, split, reverse, join);

console.log(fwd(pal1) === rev(pal1));
console.log(fwd(pal2) === rev(pal2));

// # clone / copy functions within a pipe or compose function
const scoreObj = { home: 0, away: 0 };
const shallowClone = (obj: typeof scoreObj) => Array.isArray(obj) ? [...obj] : { ...obj };

const incrementHome = (obj: typeof scoreObj) => {
  obj.home += 1;
  return obj;
};

const homeScore = pipe(shallowClone, incrementHome);

console.log(homeScore(scoreObj));
console.log(scoreObj, homeScore(scoreObj) === scoreObj);

let incrementHomeB = (cloneFn: Function): Function => (obj: typeof scoreObj): typeof scoreObj => {
  const newObj = cloneFn(obj);
  newObj.home += 1; // mutation
  return newObj;
};

// @ts-ignore
incrementHomeB = incrementHomeB(shallowClone);

const homeScoreB = pipe(incrementHomeB);
console.log(homeScoreB(scoreObj), scoreObj);

const incrementHomez = (obj: typeof scoreObj, cloneFn: Function) => {
  const newObj = cloneFn(obj);
  newObj.home += 1;
  return newObj;
};

const homeScorez = pipe(
  (x: any) => incrementHomez(x, shallowClone)
);

console.log(homeScorez(scoreObj), scoreObj);


// ## function composition : allows to take two/more functions and turn them into one function that does exactly what the two function (or more) do

function add50<T extends number>(num: T) {
  return num + 50;
}

function add30(num: number) {
  return num + 30;
}

function add20(num: number) {
  return num + 20;
}

function add10(num: number) {
  return num + 10;
}

function add100(num: number) {
  return num + 100;
}

// these two can be composed to =>
function composed(num: number) {
  return add10(add100(num)); // moving last/right to first/left
}

function add50Composed(num: number) {
  return add10(add10(add10(add10(add10(num)))));
}

function add30Composed(num: number) {
  return add10(add10(add10(num)));
}

function add20Composed(num: number) {
  return add10(add10(num));
}

composed(1); // returns 111

// ## composition vs inheritance

class Pizza {
  public size: string;
  public crust: string;
  public sauce: string;
  public toppings: any[];

  constructor(size: string = "small", crust: string = "standard", sauce: string = "tomato") {
    this.size = size;
    this.crust = crust;
    this.sauce = sauce;
    this.toppings = [];
  }

  prepare() {
    console.log(`preparing now`);
  }

  toss() {
    console.log(`tossing`);
  }

  bake() {
    console.log(`baking`);
  }
}

class Salad {
  private size: string;
  private dressing: string;

  constructor(size: string, dressing: string) {
    this.size = size;
    this.dressing = dressing;
  }

  prepare() {
    console.log(`preparing now`);
  }

  toss() {
    console.log(`tossing`);
  }

  bake() {
    console.log(`baking`);
  }
}

class StuffedCrustPizza extends Pizza {
  stuff() {
    console.log(`stuffing crust`);
  }
}

class ButterCrustPizza extends Pizza {
  butter() {
    console.log(`buttering crust`);
  }
}

class StuffedButterCrustPizza extends Pizza {
  stuff() {
    console.log(`stuffing crust`);
  }

  butter() {
    console.log(`buttering crust`);
  }
}

const myPizza = new StuffedButterCrustPizza();

const prepare = () => ({ prepare: () => console.log(`Preparing`) });
const bake = () => ({ bake: () => console.log(`Baking`) });
const toss = () => ({ toss: () => console.log(`Tossing`) });
const ready = () => ({ ready: () => console.log(`Ready`) });
const stuff = () => ({ stuff: () => console.log(`Stuffing crust`) });
const butter = () => ({ butter: () => console.log(`Buttering crust`) });

type TFood = ReturnType<typeof createPizza>;

const createPizza = (size: string, crust: string, sauce: string) => {
  const pizza = {
    size,
    crust,
    sauce,
    toppings: []
  };
  return {
    ...pizza,
    ...prepare(),
    ...bake(),
    ...ready()
  };
};

const createSalad = (size: string, dressing: string) => {
  return {
    size, dressing,
    ...prepare(),
    ...toss(),
    ...ready()
  };
};
const createStuffedButteredCrustPizza = (pizza: Record<string, any>) => {
  return {
    ...pizza,
    ...stuff(),
    ...butter()
  };
};


const anotherPizza = createPizza("small", "thin", "original");
const stuffedButterCrustedPizza = createStuffedButteredCrustPizza(anotherPizza);

const johnsPizza = createStuffedButteredCrustPizza(createPizza("medium", "thin", "original"));
const johnSalad = createSalad("side", "ranch");

// @ts-ignore
johnsPizza.bake();
johnsPizza.stuff();

johnSalad.prepare();
johnSalad.ready();

console.log(johnsPizza);
console.log(johnSalad);


// const shallowPizzaClone = (fn: Function) => {
//   return (obj: Record<string, any>, array: Array<any>) => {
//     const newObj = { ...obj };
//     return fn(newObj, array);
//   };
// };
const shallowPizzaClone = (fn: Function) => (obj: Record<string, any>, array: Array<any>) => fn({ ...obj }, array);

let addToppings = (pizza: Record<string, any>, toppings: string | Array<string>) => {
  pizza.toppings = [...pizza.toppings, ...toppings];
  return pizza;
};

// @ts-ignore
addToppings = shallowPizzaClone(addToppings);

const timsPizza = createPizza("small", "thick", "og");
const timsPizzaWithToppings = addToppings(timsPizza, ["olives", "mozzarella"]);

console.log(JSON.stringify(timsPizza));
console.log(JSON.stringify(timsPizzaWithToppings));


