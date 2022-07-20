// unlike normal function arrow function has no context of this thus it takes from its parent scope

// arrow vs normal fn: https://medium.com/@mohelsadany/arrow-functions-in-javascript-how-is-it-different-9654bde33d6a


// Let's create a controller to manage the value of some counter when a button is pressed
function ButtonController() {
  // initialise the count value
  // here "this" is the ButtonController instance
  this.countValue = 0;

  // create an arrow function to increase out counter
  // within the arrow function "this" refers to the same "this" as above
  const increaseCount = () => {
    this.countValue += 1;
  };

  // As an example, this would be how we would have to do the same thing, without arrow functions

  // we capture the parent "this" within some variable
  var _this = this;

  function decreaseCount() {
    // _this is now available in the scope of decreaseCount
    _this.countValue -= 1;
  }

  return {
    increaseCount,
    decreaseCount,
    get countValue() {
      return this.countValue;
    }
  };
}

const controllerInstance = ButtonController();

// And we could bind this method to the on click event of a button
controllerInstance.increaseCount();



// # bind
let pokemon = {
  firstName: "bulbasur",
  surName: "leader",
  getPokemonName: function() {
    return `${this.firstName} ${this.surName}`;
  }
};

function pokemonName(value, ...foods) {
  return `${this.getPokemonName()} i choose you as my ${value} pokemon ${foods} `;
};


// this used within pokemonName point to which object? That should be Pokemon
// let bulbasur = pokemonName.bind(pokemon)(`starter`, ` vegetarian`, ' loving', ' protective');
// console.log(bulbasur);


pokemon = {
  firstName: "bayleef",
  surName: "loving",
  getPokemonName: function() {
    return `${this.firstName} ${this.surName}`;
  }
};

// first argument is this value then function's argument separately
let bayleef = pokemonName.call(pokemon, `grass`, "vegetables");
// first argument is this value then function's argument within array
let bayleefi = pokemonName.apply(pokemon, [`soft grass`, "vegetables"]);

console.log(bayleef);
console.log(bayleefi);

// how to call a function with different context?

function Car(type, fuelType) {
  this.type = type;
  this.fuelType = fuelType;
}

function setBrand(brand) {
  Car.call(this, "convertible", "petrol");
  // Car.apply(this, ["convertible", "petrol"]);
  this.brand = brand;
  console.log(`Car details = `, this);
}

function definePrice(price) {
  Car.call(this, "convertible", "diesel");
  // Car.apply(this, ["convertible", "diesel"]);
  this.price = price;
  console.log(`Car details = `, this);
}

const newBrand = new setBrand("Brand1");
const newCarPrice = new definePrice(100000);

const newEntity = (obj) => console.log(obj);

function mountEntity() {
  this.entity = newEntity;
  console.log(`Entity ${this.entity} is mounted on ${this}`);
}

mountEntity.call();

// # how to use apply with arguments keyword ?
function addUp() {
  console.log(arguments);
  //Using arguments to capture the arbitrary number of inputs
  const args = Array.from(arguments);
  this.x = args.reduce((prev, curr) => prev + curr, 0);
  console.log("this.x = ", this.x);
}

function driverFunc() {
  const obj = {
    inps: [1, 2, 3, 4, 5, 6]
  };
  addUp.apply(obj, obj.inps);
}

driverFunc();
