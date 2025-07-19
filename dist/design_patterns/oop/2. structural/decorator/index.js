"use strict";
// The Decorator Pattern is a structural design pattern used to dynamically add or modify functionality of objects at runtime, without altering their code. It is widely applicable in scenarios where behavior changes are required without modifying the original class.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkRoast = void 0;
// 2. Abstract Beverage class implementing IBeverage interface.
//    This ensures every concrete beverage must implement cost() and description().
class Beverage {
}
// 3. Concrete Beverage Implementation - DarkRoast
class DarkRoast extends Beverage {
    cost() {
        return 3.45; // Base price for DarkRoast
    }
    description() {
        return 'Dark Roast'; // Description of the beverage
    }
}
exports.DarkRoast = DarkRoast;
// 4. Concrete Beverage Implementation - LightRoast
class LightRoast extends Beverage {
    cost() {
        return 3.45; // Base price for LightRoast
    }
    description() {
        return 'Light Roast'; // Description of the beverage
    }
}
// 5. Abstract Decorator class - Implements IBeverage
//    Used as a base for adding extra behavior dynamically without modifying original classes.
class BeverageDecorator {
    constructor(beverage) {
        this.beverage = beverage; // Assign the wrapped beverage
    }
}
// 6. Concrete Decorator - Espresso
class EspressoDecorator extends BeverageDecorator {
    constructor(beverage) {
        super(beverage); // Call parent constructor with the beverage being decorated
    }
    cost() {
        return 0.5 + this.beverage.cost(); // Add espresso cost to the base beverage cost
    }
    description() {
        return `${this.beverage.description()}, Espresso`; // Add 'Espresso' to the description
    }
}
// 7. Concrete Decorator - Cream
class CreamDecorator extends BeverageDecorator {
    constructor(beverage) {
        super(beverage);
    }
    cost() {
        return 0.3 + this.beverage.cost(); // Add cream cost to the base beverage cost
    }
    description() {
        return `${this.beverage.description()}, Cream`; // Add 'Cream' to the description
    }
}
// 8. Concrete Decorator - Foam
class FoamDecorator extends BeverageDecorator {
    constructor(beverage) {
        super(beverage);
    }
    cost() {
        return 0.2 + this.beverage.cost(); // Add foam cost to the base beverage cost
    }
    description() {
        return `${this.beverage.description()}, Foam`; // Add 'Foam' to the description
    }
}
// 9. Client Code - Constructing a Beverage with multiple dynamic behaviors
const beverage = new FoamDecorator(new CreamDecorator(new EspressoDecorator(new LightRoast())));
// 10. Logging the final description and cost
console.log(beverage.description());
console.log(beverage.cost());
// 11. Explanation of the final output:
/*
Explanation of the final output:
- Base Beverage: Light Roast (cost: 3.45)
- Added Espresso (cost: 0.5)
- Added Cream (cost: 0.3)
- Added Foam (cost: 0.2)

Total Cost = 3.45 + 0.5 + 0.3 + 0.2 = 4.45
Description: "Light Roast, Espresso, Cream, Foam"
*/
//# sourceMappingURL=index.js.map