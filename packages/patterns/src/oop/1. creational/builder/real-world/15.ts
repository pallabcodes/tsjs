// Restaurant order

class Order {
  constructor(
    public dish: string,
    public drink: string,
    public dessert: string
  ) {}
}

interface OrderBuilder {
  setDish(dish: string): this;
  setDrink(drink: string): this;
  setDessert(dessert: string): this;
  build(): Order;
}

class SimpleOrderBuilder implements OrderBuilder {
  private dish = 'Pizza';
  private drink = 'Water';
  private dessert = 'Ice Cream';

  setDish(dish: string): this {
    this.dish = dish;
    return this;
  }
  setDrink(drink: string): this {
    this.drink = drink;
    return this;
  }
  setDessert(dessert: string): this {
    this.dessert = dessert;
    return this;
  }
  build(): Order {
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
