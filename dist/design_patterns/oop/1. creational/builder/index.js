"use strict";
// Meal class (Immutable with getters)
class Meal {
    // shorthand (so instead of assigning attributes then assigning within constructor) to create these properties with given arguments
    constructor(starter, main, dessert, drink) {
        this.starter = starter;
        this.main = main;
        this.dessert = dessert;
        this.drink = drink;
    }
    getStarter() {
        return this.starter;
    }
    getMain() {
        return this.main;
    }
    getDessert() {
        return this.dessert;
    }
    getDrink() {
        return this.drink;
    }
}
// Vegan meal builder (implements MealBuilder interface)
class VeganMealBuilder {
    constructor() {
        this.starter = 'Salad';
        this.main = 'Veggie Stir Fry';
        this.dessert = 'Vegan Pudding';
        this.drink = 'Vegan Shake';
    }
    setStarter(starter) {
        this.starter = starter;
        return this;
    }
    setMain(main) {
        this.main = main;
        return this;
    }
    setDessert(dessert) {
        this.dessert = dessert;
        return this;
    }
    setDrink(drink) {
        this.drink = drink;
        return this;
    }
    build() {
        return new Meal(this.starter, this.main, this.dessert, this.drink);
    }
}
// Healthy meal builder (implements MealBuilder interface)
class HealthyMealBuilder {
    constructor() {
        this.starter = 'Salad';
        this.main = 'Grilled Chicken';
        this.dessert = 'Fruit Salad';
        this.drink = 'Water';
    }
    setStarter(starter) {
        this.starter = starter;
        return this;
    }
    setMain(main) {
        this.main = main;
        return this;
    }
    setDessert(dessert) {
        this.dessert = dessert;
        return this;
    }
    setDrink(drink) {
        this.drink = drink;
        return this;
    }
    build() {
        return new Meal(this.starter, this.main, this.dessert, this.drink);
    }
}
// Director to construct meals
class Director {
    constructMeal(builder) {
        return builder.build();
    }
}
// Usage Example
const director = new Director();
// Vegan meal
const veganMeal = director.constructMeal(new VeganMealBuilder()
    .setStarter('Bruschetta')
    .setMain('Pasta')
    .setDessert('Ice Cream')
    .setDrink('Fruit Juice'));
console.log('Vegan Meal constructed:');
console.log(`Starter: ${veganMeal.getStarter()}`);
console.log(`Main: ${veganMeal.getMain()}`);
console.log(`Dessert: ${veganMeal.getDessert()}`);
console.log(`Drink: ${veganMeal.getDrink()}`);
// Healthy meal
const healthyMeal = director.constructMeal(new HealthyMealBuilder()
    .setStarter('Salad')
    .setMain('Grilled Chicken')
    .setDessert('Fruit Salad')
    .setDrink('Water'));
console.log('Healthy Meal constructed:');
console.log(`Starter: ${healthyMeal.getStarter()}`);
console.log(`Main: ${healthyMeal.getMain()}`);
console.log(`Dessert: ${healthyMeal.getDessert()}`);
console.log(`Drink: ${healthyMeal.getDrink()}`);
//# sourceMappingURL=index.js.map