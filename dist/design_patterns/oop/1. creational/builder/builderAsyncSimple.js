"use strict";
// builder pattern
// an immutable class i.e. Meal 
class Meal {
    constructor(starter) {
        this.starter = starter;
    }
    getStarter() { return this.starter; }
    ;
}
// an abstract class to contain the common fields/attributes and implementations/methods
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
    async build() {
        await this.simulateAsyncWork(); // simulating the delay of a network request
        return new Meal(this.starter);
    }
    async simulateAsyncWork() {
        return new Promise((resolve) => setTimeout(() => {
            console.log('Preparing meal....');
            resolve();
        }, 1000));
    }
}
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
class Director {
    async construct(builder) {
        return builder.build();
    }
}
// usage
async function main() {
    const veganMeal = new VeganMealBuilder();
    const director = new Director();
    const veggie = await director.construct(veganMeal);
    console.log(veggie.getStarter());
    console.log('Vegan Meal constructed:', {
        Starter: veggie.getStarter()
    });
}
main().catch(console.error);
//# sourceMappingURL=builderAsyncSimple.js.map