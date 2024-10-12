enum Starter {
  SALAD = 'Salad',
  SOUP = 'Soup',
  BRUSCHETTA = 'Bruschetta',
  VEGGIE_STICKS = 'Veggie Sticks',
  CHICKEN_WINGS = 'Chicken Wings',
}

enum Main {
  GRILLED_CHICKEN = 'Grilled Chicken',
  PASTA = 'Pasta',
  VEGGIE_STIR_FRY = 'Veggie Stir Fry',
  FISH = 'Fish',
  PIZZA = 'Pizza',
}

enum Dessert {
  FRUIT_SALAD = 'Fruit Salad',
  ICE_CREAM = 'Ice Cream',
  CHOCOLATE_CAKE = 'Chocolate Cake',
  VEGAN_PUDDING = 'Vegan Pudding',
  CHEESECAKE = 'Cheesecake',
}

enum Drink {
  WATER = 'Water',
  VEGAN_SHAKE = 'Vegan Shake',
  SODA = 'Soda',
  FRUIT_JUICE = 'Fruit Juice',
}

// Meal class to manage meal components
class Meal {
  private starter: Starter | null = null;
  private main: Main | null = null;
  private dessert: Dessert | null = null;
  private drink: Drink | null = null;

  public getStarter(): Starter | null {
    return this.starter;
  }

  public getMain(): Main | null {
    return this.main;
  }

  public getDessert(): Dessert | null {
    return this.dessert;
  }

  public getDrink(): Drink | null {
    return this.drink;
  }

  public setStarter(starter: Starter): void {
    this.starter = starter;
  }

  public setMain(main: Main): void {
    this.main = main;
  }

  public setDessert(dessert: Dessert): void {
    this.dessert = dessert;
  }

  public setDrink(drink: Drink): void {
    this.drink = drink;
  }
}

// Vegan meal builder
class VeganMealBuilder {
  private meal: Meal = new Meal();

  public addStarter(): void {
    this.meal.setStarter(Starter.SALAD);
  }

  public addMainCourse(): void {
    this.meal.setMain(Main.VEGGIE_STIR_FRY);
  }

  public addDessert(): void {
    this.meal.setDessert(Dessert.VEGAN_PUDDING);
  }

  public addDrink(): void {
    this.meal.setDrink(Drink.VEGAN_SHAKE);
  }

  public build(): Meal {
    return this.meal;
  }
}

// Healthy meal builder
class HealthyMealBuilder {
  private meal: Meal = new Meal();

  public addStarter(): void {
    this.meal.setStarter(Starter.SALAD);
  }

  public addMainCourse(): void {
    this.meal.setMain(Main.GRILLED_CHICKEN);
  }

  public addDessert(): void {
    this.meal.setDessert(Dessert.FRUIT_SALAD);
  }

  public addDrink(): void {
    this.meal.setDrink(Drink.WATER);
  }

  public build(): Meal {
    return this.meal;
  }
}

// Director to construct meals
class Director {
  public constructVeganMeal(builder: VeganMealBuilder): void {
    builder.addStarter();
    builder.addMainCourse();
    builder.addDessert();
    builder.addDrink();
  }

  public constructHealthyMeal(builder: HealthyMealBuilder): void {
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
