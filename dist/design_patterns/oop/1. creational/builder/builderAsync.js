"use strict";
// Meal class (Immutable with getters)
class Meal {
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
/**
 * BaseMealBuilder with shared functionality and async operations
 */
class BaseMealBuilder {
    constructor() {
        this.starter = 'Salad';
        this.main = 'Pasta';
        this.dessert = 'Ice Cream';
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
    async build() {
        await this.simulateAsyncWork();
        return new Meal(this.starter, this.main, this.dessert, this.drink);
    }
    async simulateAsyncWork() {
        return new Promise((resolve) => setTimeout(() => {
            console.log('Preparing meal...');
            resolve();
        }, 1000));
    }
}
/**
 * VeganMealBuilder with default vegan meal components
 */
class VeganMealBuilder extends BaseMealBuilder {
    // override needed since base case has initilized values for each of these fields below otherwise override wouldn't be needed
    constructor(starter = 'Veggie Sticks', main = 'Veggie Stir Fry', dessert = 'Vegan Pudding', drink = 'Vegan Shake') {
        super();
        this.starter = starter;
        this.main = main;
        this.dessert = dessert;
        this.drink = drink;
    }
}
/**
 * HealthyMealBuilder with default healthy meal components
 */
class HealthyMealBuilder extends BaseMealBuilder {
    constructor() {
        super();
        this.starter = 'Salad';
        this.main = 'Grilled Chicken';
        this.dessert = 'Fruit Salad';
        this.drink = 'Water';
    }
}
/**
 * Director class to construct meals
 */
class Director {
    async construct(builder) {
        return builder.build();
    }
}
// Usage Example
async function main() {
    const director = new Director();
    const veganMeal = await director.construct(new VeganMealBuilder()
        .setStarter('Bruschetta')
        .setMain('Pasta')
        .setDessert('Chocolate Cake')
        .setDrink('Fruit Juice'));
    console.log('Vegan Meal constructed:', {
        Starter: veganMeal.getStarter(),
        Main: veganMeal.getMain(),
        Dessert: veganMeal.getDessert(),
        Drink: veganMeal.getDrink(),
    });
    const healthyMeal = await director.construct(new HealthyMealBuilder()
        .setMain('Fish')
        .setDessert('Cheesecake'));
    console.log('Healthy Meal constructed:', {
        Starter: healthyMeal.getStarter(),
        Main: healthyMeal.getMain(),
        Dessert: healthyMeal.getDessert(),
        Drink: healthyMeal.getDrink(),
    });
}
main().catch(console.error);
//# sourceMappingURL=builderAsync.js.map