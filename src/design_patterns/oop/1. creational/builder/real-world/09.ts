class Meal {
    constructor(
        public starter: string,
        public main: string,
        public dessert: string,
        public drink: string
    ) {}
}

interface MealBuilder {
    setStarter(starter: string): this;
    setMain(main: string): this;
    setDessert(dessert: string): this;
    setDrink(drink: string): this;
    build(): Meal;
}

class VeganMealBuilder implements MealBuilder {
    private starter: string = "Salad";
    private main: string = "Veggie Stir Fry";
    private dessert: string = "Vegan Pudding";
    private drink: string = "Vegan Shake";

    setStarter(starter: string): this {
        this.starter = starter;
        return this;
    }
    setMain(main: string): this {
        this.main = main;
        return this;
    }
    setDessert(dessert: string): this {
        this.dessert = dessert;
        return this;
    }
    setDrink(drink: string): this {
        this.drink = drink;
        return this;
    }
    build(): Meal {
        return new Meal(this.starter, this.main, this.dessert, this.drink);
    }
}

// Usage
const veganMeal = new VeganMealBuilder()
    .setStarter("Bruschetta")
    .setMain("Pasta")
    .setDessert("Ice Cream")
    .setDrink("Fruit Juice")
    .build();

console.log(veganMeal);
