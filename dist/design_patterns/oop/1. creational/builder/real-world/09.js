"use strict";
class Meal {
    constructor(starter, main, dessert, drink) {
        this.starter = starter;
        this.main = main;
        this.dessert = dessert;
        this.drink = drink;
    }
}
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
// Usage
const veganMeal = new VeganMealBuilder()
    .setStarter('Bruschetta')
    .setMain('Pasta')
    .setDessert('Ice Cream')
    .setDrink('Fruit Juice')
    .build();
console.log(veganMeal);
//# sourceMappingURL=09.js.map