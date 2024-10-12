// Burger.ts
export abstract class Burger {
  protected name: string;
  protected bread: string;
  protected sauce: string;
  protected toppings: string[];

  constructor() {
    this.toppings = [];
  }

  prepare(): void {
    console.log(`Preparing ${this.name} with ${this.bread} and ${this.sauce}`);
  }

  cook(): void {
    console.log(`Cooking ${this.name}...`);
  }

  serve(): void {
    console.log(`Serving ${this.name} with toppings: ${this.toppings.join(", ")}`);
  }

  getName(): string {
    return this.name;
  }
}

export class CheeseBurger extends Burger {
  constructor() {
    super();
    this.name = "Cheese Burger";
    this.bread = "Brioche Bun";
    this.sauce = "Ketchup";
    this.toppings = ["Cheese", "Lettuce", "Tomato"];
  }
}


export class DeluxeCheeseBurger extends Burger {
  constructor() {
    super();
    this.name = "Deluxe Cheese Burger";
    this.bread = "Sesame Bun";
    this.sauce = "BBQ Sauce";
    this.toppings = ["Cheese", "Bacon", "Pickles", "Lettuce"];
  }
}

export class VeganBurger extends Burger {
  constructor() {
    super();
    this.name = "Vegan Burger";
    this.bread = "Whole Wheat Bun";
    this.sauce = "Vegan Mayo";
    this.toppings = ["Lettuce", "Tomato", "Onion"];
  }
}

export class DeluxeVeganBurger extends Burger {
  constructor() {
    super();
    this.name = "Deluxe Vegan Burger";
    this.bread = "Gluten-Free Bun";
    this.sauce = "Avocado Sauce";
    this.toppings = ["Lettuce", "Grilled Veggies", "Guacamole"];
  }
}

// BurgerStore.ts – Abstract Factory
export abstract class BurgerStore {
  // Factory Method to be overridden by subclasses
  protected abstract createBurger(type: string): Burger;

  orderBurger(type: string): Burger {
    const burger = this.createBurger(type);
    burger.prepare();
    burger.cook();
    burger.serve();
    return burger;
  }
}

export class CheeseBurgerStore extends BurgerStore {
  protected createBurger(type: string): Burger {
    if (type === "deluxe") {
      return new DeluxeCheeseBurger();
    } else {
      return new CheeseBurger();
    }
  }
}

export class VeganBurgerStore extends BurgerStore {
  protected createBurger(type: string): Burger {
    if (type === "deluxe") {
      return new DeluxeVeganBurger();
    } else {
      return new VeganBurger();
    }
  }
}

const cheeseBurgerStore = new CheeseBurgerStore();
const veganBurgerStore = new VeganBurgerStore();

console.log("Ordering a regular Cheese Burger:");
cheeseBurgerStore.orderBurger("regular");

console.log("\nOrdering a Deluxe Vegan Burger:");
veganBurgerStore.orderBurger("deluxe");