// callback is a function that's given as an argument to a function
// A callback is a function that is passed as an argument to another function that executes the callback based on the result. They are basically functions that are executed only after a result is produced. Callbacks are an important part of asynchronous JavaScript.
function auth(response = {}, cb) {
  // return cb(response, 1);
  cb(response, 1);
}

// noinspection JSVoidFunctionReturnValueUsed
const authenticated = auth({ title: "FIFA" }, (str, n) => {
  // do something
  console.log(str, n);
});

console.log(authenticated);

let stocks = {
  fruits: ["strawberry", "grapes", `apple`, `banana`, "mango"],
  liquid: ["water", "ice"],
  holder: ["cone", "cup"],
  toppings: ["chocolate", "peanuts"],
};

// event when setTimeout(() => {}, 0)/setTimeout(() => {}, 0) it sill goes to the event loop
// whereas if two setTimeout has same timeout delay then whichever comes first when running code line by line

let order = (fruitName, productionCB) => {
  setTimeout(() => {
    console.log(`${stocks.fruits[fruitName]} selected`);
    productionCB();
  }, 2000);
};

let production = () => {
  // so basically within the callback function calling another function & within that calling another fn so on so forth
  setTimeout(() => {
    console.log(`production has been started`);

    setTimeout(() => {
      console.log(`The fruit has been chopped`);

      setTimeout(() => {
        console.log(`${stocks.liquid[0]} and ${stocks.liquid[1]} has added`);
        setTimeout(() => {
          console.log(`the machine has started`);
          setTimeout(() => {
            console.log(`ice cream placed on ${stocks.holder[0]}`);

            setTimeout(() => {
              console.log(`${stocks.toppings[0]} has added as toppings`);
              setTimeout(() => {
                console.log(`served the ice cream`);
              }, 2000);
            }, 3000);
          }, 2000);
        }, 1000);
      }, 1000);
    }, 2000);
  }, 0);
};

order(1, production);

function game(name, cb) {
  return () => {};
}

function whatGame() {}

function playGame() {
  whatGame();
}

function three() {
  console.log(`three`);
}

function two() {
  three();
  console.log(`two`);
}

function one() {
  two();
  console.log(`one`);
}

one();
// one() -> two() -> three()
// console.log(`three`);
// console.log(`two`);
// console.log(`one`);

// why callback? how promise uses callback? https://jsitor.com/43VqpA3_n

// Promise.all return the error response from of whichever promise rejected
// Promise.allSettled() returns an array [{value: {}, status: "fullfilled", status: "rejected", value: {}}]

// #

function someFnFromElseWhere(callback) {
  callback(); // it does whatever it needs to do
  // return undefind (implicit)
}

function takeEvery(pattern, saga, ...args) {
  return someFnFromElseWhere(function* () {
    // do something
    console.log("generator")
  });
}

takeEvery(1, 1, [1]);