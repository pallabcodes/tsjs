"use strict";
// Restaurant order
class Order {
    constructor(dish, drink, dessert) {
        this.dish = dish;
        this.drink = drink;
        this.dessert = dessert;
    }
}
class SimpleOrderBuilder {
    constructor() {
        this.dish = 'Pizza';
        this.drink = 'Water';
        this.dessert = 'Ice Cream';
    }
    setDish(dish) {
        this.dish = dish;
        return this;
    }
    setDrink(drink) {
        this.drink = drink;
        return this;
    }
    setDessert(dessert) {
        this.dessert = dessert;
        return this;
    }
    build() {
        return new Order(this.dish, this.drink, this.dessert);
    }
}
// Usage
const order = new SimpleOrderBuilder()
    .setDish('Pasta')
    .setDrink('Wine')
    .setDessert('Tiramisu')
    .build();
console.log(order);
//# sourceMappingURL=15.js.map