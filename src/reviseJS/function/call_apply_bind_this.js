// # bind
let pokemon = {
  firstName: "bulbasur",
  surName: "leader",
  getPokemonName: function() {
    return `${this.firstName} ${this.surName}`;
  }
};

function pokemonName (value, ...foods) {
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

function Car(type, fuelType){
  this.type = type;
  this.fuelType = fuelType;
}

function setBrand(brand){
  Car.call(this, "convertible", "petrol");
  // Car.apply(this, ["convertible", "petrol"]);
  this.brand = brand;
  console.log(`Car details = `, this);
}

function definePrice(price){
  Car.call(this, "convertible", "diesel");
  // Car.apply(this, ["convertible", "diesel"]);
  this.price = price;
  console.log(`Car details = `, this);
}

const newBrand = new setBrand('Brand1');
const newCarPrice = new definePrice(100000);

const newEntity = (obj) => console.log(obj);

function mountEntity() {
  this.entity = newEntity;
  console.log(`Entity ${this.entity} is mounted on ${this}`);
}

mountEntity.call();

// # how to use apply with arguments keyword ?
function addUp(){
  console.log(arguments);
  //Using arguments to capture the arbitrary number of inputs
  const args = Array.from(arguments);
  this.x = args.reduce((prev, curr) => prev + curr, 0);
  console.log("this.x = ", this.x);
}

function driverFunc(){
  const obj = {
    inps: [1,2,3,4,5,6]
  }
  addUp.apply(obj, obj.inps);
}

driverFunc();
