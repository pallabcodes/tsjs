const Starter = {
  SALAD: 'Salad',
  SOUP: 'Soup',
  BRUSCHETTA: 'Bruschetta',
  VEGGIE_STICKS: 'Veggie Sticks',
  CHICKEN_WINGS: 'Chicken Wings',
};

// Main course options
const Main = {
  GRILLED_CHICKEN: 'Grilled Chicken',
  PASTA: 'Pasta',
  VEGGIE_STIR_FRY: 'Veggie Stir Fry',
  FISH: 'Fish',
  PIZZA: 'Pizza',
};

// Dessert options
const Dessert = {
  FRUIT_SALAD: 'Fruit Salad',
  ICE_CREAM: 'Ice Cream',
  CHOCOLATE_CAKE: 'Chocolate Cake',
  VEGAN_PUDDING: 'Vegan Pudding',
  CHEESECAKE: 'Cheesecake',
};

// Drink options
const Drink = {
  WATER: 'Water',
  VEGAN_SHAKE: 'Vegan Shake',
  SODA: 'Soda',
  FRUIT_JUICE: 'Fruit Juice',
};

// Meal class to manage meal components
class Meal {
  constructor() {
    this.starter = null;
    this.main = null;
    this.dessert = null;
    this.drink = null;
  }

  // getter
  getStarter() {
    return this.starter;
  }

  // getter
  getMain() {
    return this.main;
  }

  // getter
  getDessert() {
    return this.dessert;
  }

  // getter
  getDrink() {
    return this.drink;
  }

  // getter
  setStarter(starter) {
    this.starter = starter;
  }

  // getter
  setMain(main) {
    this.main = main;
  }

  // getter
  setDessert(dessert) {
    this.dessert = dessert;
  }

  // getter
  setDrink(drink) {
    this.drink = drink;
  }
}

// Vegan meal builder class
class VeganMealBuilder {
  constructor() {
    this.meal = new Meal();
  }

  addStarter() {
    this.meal.setStarter(Starter.SALAD);
  }

  addMainCourse() {
    this.meal.setMain(Main.VEGGIE_STIR_FRY);
  }

  addDessert() {
    this.meal.setDessert(Dessert.VEGAN_PUDDING);
  }

  addDrink() {
    this.meal.setDrink(Drink.VEGAN_SHAKE);
  }

  build() {
    return this.meal;
  }
}

// Healthy meal builder
class HealthyMealBuilder {
  constructor() {
    this.meal = new Meal();
  }

  addStarter() {
    this.meal.setStarter(Starter.SALAD);
  }

  addMainCourse() {
    this.meal.setMain(Main.GRILLED_CHICKEN);
  }

  addDessert() {
    this.meal.setDessert(Dessert.FRUIT_SALAD);
  }

  addDrink() {
    this.meal.setDrink(Drink.WATER);
  }

  build() {
    return this.meal;
  }
}

// Director to construct meals
class Director {
  constructVeganMeal(builder) {
    builder.addStarter();
    builder.addMainCourse();
    builder.addDessert();
    builder.addDrink();
  }

  constructHealthyMeal(builder) {
    builder.addStarter();
    builder.addMainCourse();
    builder.addDessert();
    builder.addDrink();
  }
}

// Usage
const director = new Director();

const veganBuilder = new VeganMealBuilder();
director.constructVeganMeal(veganBuilder);
const veganMeal = veganBuilder.build();
console.log('Vegan Meal constructed:');
console.log('Starter: ' + veganMeal.getStarter());
console.log('Main: ' + veganMeal.getMain());
console.log('Dessert: ' + veganMeal.getDessert());
console.log('Drink: ' + veganMeal.getDrink());

// Constructing a healthy meal
const healthyBuilder = new HealthyMealBuilder();
director.constructHealthyMeal(healthyBuilder);
const healthyMeal = healthyBuilder.build();
console.log('Healthy Meal constructed:');
console.log('Starter: ' + healthyMeal.getStarter());
console.log('Main: ' + healthyMeal.getMain());
console.log('Dessert: ' + healthyMeal.getDessert());
console.log('Drink: ' + healthyMeal.getDrink());
