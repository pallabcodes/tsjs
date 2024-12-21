// builder pattern

type Starter = 'Salad' | 'Soup' | 'Bruschetta' | 'Veggie Sticks' | 'Chicken Wings';
type Main = 'Grilled Chicken' | 'Pasta' | 'Veggie Stir Fry' | 'Fish' | 'Pizza';
type Dessert = 'Fruit Salad' | 'Ice Cream' | 'Chocolate Cake' | 'Vegan Pudding' | 'Cheesecake';
type Drink = 'Water' | 'Vegan Shake' | 'Soda' | 'Fruit Juice';

// an immutable class i.e. Meal 

class Meal {
    constructor(private readonly starter: Starter) { }
    getStarter(): Starter { return this.starter };
}

// implementations / methods (now since TS doesn't have officially struct so an interface can have the fields too)

interface WhatAreTheCommonMethodsAndAttributes {

    // wherever this interface gonna be used, it should return an object which must have this method (other addtional fields and methods doesn't matter)
    setStarter(starter: Starter): this;
    build(): Promise<Meal>;

}

// an abstract class to contain the common fields/attributes and implementations/methods

abstract class BaseMealBuilder implements WhatAreTheCommonMethodsAndAttributes {
    protected starter: Starter = 'Salad';
    protected main: Main = 'Pasta';
    protected dessert: Dessert = 'Ice Cream';
    protected drink: Drink = 'Water';

    setStarter(starter: Starter): this {
        this.starter = starter;
        return this;
    }

    async build(): Promise<Meal> {
        await this.simulateAsyncWork(); // simulating the delay of a network request
        return new Meal(this.starter);
    }

    protected async simulateAsyncWork(): Promise<void> {
        return new Promise((resolve) =>
            setTimeout(() => {
                console.log('Preparing meal....');
                resolve();
            }, 1000)
        );
    }
}

class VeganMealBuilder extends BaseMealBuilder {
    // override needed since base case has initilized values for each of these fields below otherwise override wouldn't be needed
    constructor(
        public override starter: Starter = 'Veggie Sticks',
        public override main: Main = 'Veggie Stir Fry',
        public override dessert: Dessert = 'Vegan Pudding',
        public override drink: Drink = 'Vegan Shake'
    ) {
        super();
    }
}

class Director {
    async construct(builder: WhatAreTheCommonMethodsAndAttributes): Promise<Meal> {
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