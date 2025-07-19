"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeganBurgerStore = exports.CheeseBurgerStore = exports.BurgerStore = exports.DeluxeVeganBurger = exports.VeganBurger = exports.DeluxeCheeseBurger = exports.CheeseBurger = exports.Burger = exports.BurgerType = void 0;
// Add enum at the top
var BurgerType;
(function (BurgerType) {
    BurgerType["REGULAR"] = "regular";
    BurgerType["DELUXE"] = "deluxe";
})(BurgerType || (exports.BurgerType = BurgerType = {}));
// Burger.ts
class Burger {
    constructor() {
        this.toppings = [];
    }
    prepare() {
        console.log(`Preparing ${this.name} with ${this.bread} and ${this.sauce}`);
    }
    cook() {
        console.log(`Cooking ${this.name}...`);
    }
    serve() {
        console.log(`Serving ${this.name} with toppings: ${this.toppings.join(', ')}`);
    }
    getName() {
        return this.name;
    }
}
exports.Burger = Burger;
class CheeseBurger extends Burger {
    constructor() {
        super();
        this.name = 'Cheese Burger';
        this.bread = 'Brioche Bun';
        this.sauce = 'Ketchup';
        this.toppings = ['Cheese', 'Lettuce', 'Tomato'];
    }
}
exports.CheeseBurger = CheeseBurger;
class DeluxeCheeseBurger extends Burger {
    constructor() {
        super();
        this.name = 'Deluxe Cheese Burger';
        this.bread = 'Sesame Bun';
        this.sauce = 'BBQ Sauce';
        this.toppings = ['Cheese', 'Bacon', 'Pickles', 'Lettuce'];
    }
}
exports.DeluxeCheeseBurger = DeluxeCheeseBurger;
class VeganBurger extends Burger {
    constructor() {
        super();
        this.name = 'Vegan Burger';
        this.bread = 'Whole Wheat Bun';
        this.sauce = 'Vegan Mayo';
        this.toppings = ['Lettuce', 'Tomato', 'Onion'];
    }
}
exports.VeganBurger = VeganBurger;
class DeluxeVeganBurger extends Burger {
    constructor() {
        super();
        this.name = 'Deluxe Vegan Burger';
        this.bread = 'Gluten-Free Bun';
        this.sauce = 'Avocado Sauce';
        this.toppings = ['Lettuce', 'Grilled Veggies', 'Guacamole'];
    }
}
exports.DeluxeVeganBurger = DeluxeVeganBurger;
// BurgerStore.ts – Abstract Factory
class BurgerStore {
    orderBurger(type) {
        const burger = this.createBurger(type);
        burger.prepare();
        burger.cook();
        burger.serve();
        return burger;
    }
}
exports.BurgerStore = BurgerStore;
class CheeseBurgerStore extends BurgerStore {
    createBurger(type) {
        switch (type) {
            case BurgerType.DELUXE:
                return new DeluxeCheeseBurger();
            case BurgerType.REGULAR:
                return new CheeseBurger();
            default:
                throw new Error(`Invalid burger type: ${type}`);
        }
    }
}
exports.CheeseBurgerStore = CheeseBurgerStore;
class VeganBurgerStore extends BurgerStore {
    createBurger(type) {
        switch (type) {
            case BurgerType.DELUXE:
                return new DeluxeVeganBurger();
            case BurgerType.REGULAR:
                return new VeganBurger();
            default:
                throw new Error(`Invalid burger type: ${type}`);
        }
    }
}
exports.VeganBurgerStore = VeganBurgerStore;
const cheeseBurgerStore = new CheeseBurgerStore();
const veganBurgerStore = new VeganBurgerStore();
console.log('Ordering a regular Cheese Burger:');
cheeseBurgerStore.orderBurger(BurgerType.REGULAR);
console.log('\nOrdering a Deluxe Vegan Burger:');
veganBurgerStore.orderBurger(BurgerType.DELUXE);
//# sourceMappingURL=index.js.map