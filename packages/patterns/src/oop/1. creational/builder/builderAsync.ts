// Enum-like types for Starter, Main, Dessert, and Drink
type Starter = 'Salad' | 'Soup' | 'Bruschetta' | 'Veggie Sticks' | 'Chicken Wings';
type Main = 'Grilled Chicken' | 'Pasta' | 'Veggie Stir Fry' | 'Fish' | 'Pizza';
type Dessert = 'Fruit Salad' | 'Ice Cream' | 'Chocolate Cake' | 'Vegan Pudding' | 'Cheesecake';
type Drink = 'Water' | 'Vegan Shake' | 'Soda' | 'Fruit Juice';

// Meal class (Immutable with getters)
class Meal {
  constructor(
    private readonly starter: Starter,
    private readonly main: Main,
    private readonly dessert: Dessert,
    private readonly drink: Drink
  ) { }

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

/**
 * MealBuilder interface with async support
 */
interface MealBuilder {
  setStarter(starter: Starter): this;
  setMain(main: Main): this;
  setDessert(dessert: Dessert): this;
  setDrink(drink: Drink): this;
  build(): Promise<Meal>;
}

/**
 * BaseMealBuilder with shared functionality and async operations
 */
abstract class BaseMealBuilder implements MealBuilder {
  protected starter: Starter = 'Salad';
  protected main: Main = 'Pasta';
  protected dessert: Dessert = 'Ice Cream';
  protected drink: Drink = 'Water';

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

  async build(): Promise<Meal> {
    await this.simulateAsyncWork();
    return new Meal(this.starter, this.main, this.dessert, this.drink);
  }

  protected async simulateAsyncWork(): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log('Preparing meal...');
        resolve();
      }, 1000)
    );
  }
}

/**
 * VeganMealBuilder with default vegan meal components
 */
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
  async construct(builder: MealBuilder): Promise<Meal> {
    return builder.build();
  }
}

// Usage Example
async function main() {
  const director = new Director();

  const veganMeal = await director.construct(
    new VeganMealBuilder()
      .setStarter('Bruschetta')
      .setMain('Pasta')
      .setDessert('Chocolate Cake')
      .setDrink('Fruit Juice')
  );
  console.log('Vegan Meal constructed:', {
    Starter: veganMeal.getStarter(),
    Main: veganMeal.getMain(),
    Dessert: veganMeal.getDessert(),
    Drink: veganMeal.getDrink(),
  });

  const healthyMeal = await director.construct(
    new HealthyMealBuilder()
      .setMain('Fish')
      .setDessert('Cheesecake')
  );
  console.log('Healthy Meal constructed:', {
    Starter: healthyMeal.getStarter(),
    Main: healthyMeal.getMain(),
    Dessert: healthyMeal.getDessert(),
    Drink: healthyMeal.getDrink(),
  });
}

main().catch(console.error);
