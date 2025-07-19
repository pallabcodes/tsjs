"use strict";
// use: Fluent API/Method Chaining
class Product {
    constructor(name, price, category, inStock) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.inStock = inStock;
    }
}
class ElectronicsProductBuilder {
    constructor() {
        this.name = 'Default Product';
        this.price = 100;
        this.category = 'Electronics';
        this.inStock = true;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setPrice(price) {
        this.price = price;
        return this;
    }
    setCategory(category) {
        this.category = category;
        return this;
    }
    setInStock(inStock) {
        this.inStock = inStock;
        return this;
    }
    build() {
        return new Product(this.name, this.price, this.category, this.inStock);
    }
}
// Usage
const laptop = new ElectronicsProductBuilder()
    .setName('Gaming Laptop')
    .setPrice(1500)
    .setCategory('Gaming')
    .setInStock(true)
    .build();
console.log(laptop);
//# sourceMappingURL=07.js.map