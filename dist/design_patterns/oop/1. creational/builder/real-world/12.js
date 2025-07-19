"use strict";
// use: Fluent Interface for Customization
class Product {
    constructor(title, price, stock) {
        this.title = title;
        this.price = price;
        this.stock = stock;
    }
}
class SimpleProductBuilder {
    constructor() {
        this.title = 'Default Product';
        this.price = 100;
        this.stock = true;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setPrice(price) {
        this.price = price;
        return this;
    }
    setStock(stock) {
        this.stock = stock;
        return this;
    }
    build() {
        return new Product(this.title, this.price, this.stock);
    }
}
// Usage
const product = new SimpleProductBuilder()
    .setTitle('Smartphone')
    .setPrice(699)
    .setStock(true)
    .build();
console.log(product);
//# sourceMappingURL=12.js.map