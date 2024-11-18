// The Decorator Pattern is a structural design pattern used to dynamically add or modify functionality of objects at runtime, without altering their code. It is widely applicable in scenarios where behavior changes are required without modifying the original class.

/**
 * The Decorator Pattern is a structural design pattern that allows you to dynamically add behaviors or functionalities to objects at runtime without modifying their code. It is particularly useful when you need to adhere to the Open/Closed Principle—open for extension but closed for modification.
 * The following single example aims to illustrate the full potential of the Decorator Pattern in a real-world scenario while adhering to product-based standards. However, I'll evaluate whether it covers the full power of the pattern and provide recommendations for extensions.
 * */

/*
* ## The pattern's full power shines in real-world scenarios such as:
* Extending functionality dynamically.
* Avoiding subclass explosion (too many subclasses for every combination of behaviors).
* Flexibility in applying or removing responsibilities.
* Maintaining open/closed principle (open for extension, closed for modification).
* Composing behaviors through layering.
*
*
* */

// 1. Interface for Beverage - ensures all beverages have `cost()` and `description()`
interface IBeverage {
  cost(): number; // Returns the total cost of the beverage
  description(): string; // Describes the beverage with any added features
}

// 2. Abstract Beverage class implementing IBeverage interface.
//    This ensures every concrete beverage must implement cost() and description().
abstract class Beverage implements IBeverage {
  abstract cost(): number;
  abstract description(): string;
}

// 3. Concrete Beverage Implementation - DarkRoast
class DarkRoast extends Beverage {
  cost(): number {
    return 3.45; // Base price for DarkRoast
  }

  description(): string {
    return 'Dark Roast'; // Description of the beverage
  }
}

// 4. Concrete Beverage Implementation - LightRoast
class LightRoast extends Beverage {
  cost(): number {
    return 3.45; // Base price for LightRoast
  }

  description(): string {
    return 'Light Roast'; // Description of the beverage
  }
}

// 5. Abstract Decorator class - Implements IBeverage
//    Used as a base for adding extra behavior dynamically without modifying original classes.
abstract class BeverageDecorator implements IBeverage {
  // Store the decorated beverage using `readonly` to prevent re-assignment.
  protected readonly beverage: IBeverage;

  constructor(beverage: IBeverage) {
    this.beverage = beverage; // Assign the wrapped beverage
  }

  // Force child decorators to implement these methods.
  abstract cost(): number;
  abstract description(): string;
}

// 6. Concrete Decorator - Espresso
class EspressoDecorator extends BeverageDecorator {
  constructor(beverage: IBeverage) {
    super(beverage); // Call parent constructor with the beverage being decorated
  }

  cost(): number {
    return 0.5 + this.beverage.cost(); // Add espresso cost to the base beverage cost
  }

  description(): string {
    return `${this.beverage.description()}, Espresso`; // Add 'Espresso' to the description
  }
}

// 7. Concrete Decorator - Cream
class CreamDecorator extends BeverageDecorator {
  constructor(beverage: IBeverage) {
    super(beverage);
  }

  cost(): number {
    return 0.3 + this.beverage.cost(); // Add cream cost to the base beverage cost
  }

  description(): string {
    return `${this.beverage.description()}, Cream`; // Add 'Cream' to the description
  }
}

// 8. Concrete Decorator - Foam
class FoamDecorator extends BeverageDecorator {
  constructor(beverage: IBeverage) {
    super(beverage);
  }

  cost(): number {
    return 0.2 + this.beverage.cost(); // Add foam cost to the base beverage cost
  }

  description(): string {
    return `${this.beverage.description()}, Foam`; // Add 'Foam' to the description
  }
}

// Client Code - Constructing a Beverage with multiple dynamic behaviors

const beverage: IBeverage = new FoamDecorator(
  new CreamDecorator(new EspressoDecorator(new LightRoast()))
); // works like compose in "functional programming" i.e. through "reduce" so here it starts from rightmost i.e. LightRoast

/**
 * works like "compose" i.e., implemented with "reduce" meaning towards left, so starts from right-most
 * 1.
 * const baseBeverage = new LightRoast();
 * console.log(baseBeverage.description()); // Output: "Light Roast"
 * console.log(baseBeverage.cost()); // Output: 3.45
 * -------------------------------------------------------------------
 * 2.
 * const espressoBeverage = new EspressoDecorator(baseBeverage);
 * console.log(espressoBeverage.description()); // Output: "Light Roast, Espresso"
 * console.log(espressoBeverage.cost()); // Output: 3.45 + 0.5 = 3.95
 * -------------------------------------------------------------------
 * 3.
 * const creamBeverage = new CreamDecorator(espressoBeverage);
 * console.log(creamBeverage.description()); // Output: "Light Roast, Espresso, Cream"
 * console.log(creamBeverage.cost()); // Output: 3.95 + 0.3 = 4.25
 * -------------------------------------------------------------------
 * 4.
 * const finalBeverage = new FoamDecorator(creamBeverage);
 * console.log(finalBeverage.description()); // Output: "Light Roast, Espresso, Cream, Foam"
 * console.log(finalBeverage.cost()); // Output: 4.25 + 0.2 = 4.45
 */

// 10. Logging the final description and cost

console.log(beverage.description()); // Output: Light Roast, Espresso, Cream, Foam
console.log(beverage.cost()); // Output: 4.45

/*
Explanation of the final output:
- Base Beverage: Light Roast (cost: 3.45)
- Added Espresso (cost: 0.5)
- Added Cream (cost: 0.3)
- Added Foam (cost: 0.2)

Total Cost = 3.45 + 0.5 + 0.3 + 0.2 = 4.45
Description: "Light Roast, Espresso, Cream, Foam"
*/
