type Starter =
  | 'Salad'
  | 'Soup'
  | 'Bruschetta'
  | 'Veggie Sticks'
  | 'Chicken Wings';
type Main = 'Grilled Chicken' | 'Pasta' | 'Veggie Stir Fry' | 'Fish' | 'Pizza';
type Dessert =
  | 'Fruit Salad'
  | 'Ice Cream'
  | 'Chocolate Cake'
  | 'Vegan Pudding'
  | 'Cheesecake';
type Drink = 'Water' | 'Vegan Shake' | 'Soda' | 'Fruit Juice';

// Meal class (Immutable with getters)
class Meal {
  constructor(
    public readonly starter: Starter,
    public readonly main: Main,
    public readonly dessert: Dessert,
    public readonly drink: Drink
  ) {}

  getStarter(): Starter {
    return this.starter;
  }

  getMain(): Main {
    return this.main;
  }

  getDessert(): Dessert {
    return this.dessert;
  }

  getDrink(): Drink {
    return this.drink;
  }
}

// MealBuilder interface with async support
interface MealBuilder {
  setStarter(starter: Starter): this;
  setMain(main: Main): this;
  setDessert(dessert: Dessert): this;
  setDrink(drink: Drink): this;
  build(): Promise<Meal>; // make build async to handle async operations like fetching ingredients
}

// Vegan meal builder (implements MealBuilder interface)
class VeganMealBuilder implements MealBuilder {
  private starter: Starter = 'Salad';
  private main: Main = 'Veggie Stir Fry';
  private dessert: Dessert = 'Vegan Pudding';
  private drink: Drink = 'Vegan Shake';

  setStarter(starter: Starter): this {
    this.starter = starter;
    return this;
  }

  setMain(main: Main): this {
    this.main = main;
    return this;
  }

  setDessert(dessert: Dessert): this {
    this.dessert = dessert;
    return this;
  }

  setDrink(drink: Drink): this {
    this.drink = drink;
    return this;
  }

  // Async build to simulate fetching ingredients or preparation delay
  async build(): Promise<Meal> {
    // Simulating async task like ingredient fetching
    await this.simulateAsyncWork();
    return new Meal(this.starter, this.main, this.dessert, this.drink);
  }

  private async simulateAsyncWork() {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        console.log(
          'Async task completed (fetching ingredients or preparation delay)'
        );
        resolve();
      }, 1000)
    );
  }
}

// Healthy meal builder (implements MealBuilder interface)
class HealthyMealBuilder implements MealBuilder {
  private starter: Starter = 'Salad';
  private main: Main = 'Grilled Chicken';
  private dessert: Dessert = 'Fruit Salad';
  private drink: Drink = 'Water';

  setStarter(starter: Starter): this {
    this.starter = starter;
    return this;
  }

  setMain(main: Main): this {
    this.main = main;
    return this;
  }

  setDessert(dessert: Dessert): this {
    this.dessert = dessert;
    return this;
  }

  setDrink(drink: Drink): this {
    this.drink = drink;
    return this;
  }

  // Async build to simulate fetching ingredients or preparation delay
  async build(): Promise<Meal> {
    // Simulating async task like ingredient fetching
    await this.simulateAsyncWork();
    return new Meal(this.starter, this.main, this.dessert, this.drink);
  }

  private async simulateAsyncWork() {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        console.log(
          'Async task completed (fetching ingredients or preparation delay)'
        );
        resolve();
      }, 1000)
    );
  }
}

// Director class to construct meals
class Director {
  async constructMeal(builder: MealBuilder): Promise<Meal> {
    return builder.build(); // handles async build
  }
}

// Usage Example
const director = new Director();

async function main() {
  // Vegan meal
  const veganMeal = await director.constructMeal(
    new VeganMealBuilder()
      .setStarter('Bruschetta')
      .setMain('Pasta')
      .setDessert('Ice Cream')
      .setDrink('Fruit Juice')
  );
  console.log('Vegan Meal constructed:');
  console.log(`Starter: ${veganMeal.getStarter()}`);
  console.log(`Main: ${veganMeal.getMain()}`);
  console.log(`Dessert: ${veganMeal.getDessert()}`);
  console.log(`Drink: ${veganMeal.getDrink()}`);

  // Healthy meal
  const healthyMeal = await director.constructMeal(
    new HealthyMealBuilder()
      .setStarter('Salad')
      .setMain('Grilled Chicken')
      .setDessert('Fruit Salad')
      .setDrink('Water')
  );
  console.log('Healthy Meal constructed:');
  console.log(`Starter: ${healthyMeal.getStarter()}`);
  console.log(`Main: ${healthyMeal.getMain()}`);
  console.log(`Dessert: ${healthyMeal.getDessert()}`);
  console.log(`Drink: ${healthyMeal.getDrink()}`);
}

main().catch(err => console.error(err));
