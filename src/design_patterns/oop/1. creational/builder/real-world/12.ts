// use: Fluent Interface for Customization

class Product {
  constructor(
    public title: string,
    public price: number,
    public stock: boolean
  ) {}
}

interface ProductBuilder {
  setTitle(title: string): this;
  setPrice(price: number): this;
  setStock(stock: boolean): this;
  build(): Product;
}

class SimpleProductBuilder implements ProductBuilder {
  private title = 'Default Product';
  private price = 100;
  private stock = true;

  setTitle(title: string): this {
    this.title = title;
    return this;
  }
  setPrice(price: number): this {
    this.price = price;
    return this;
  }
  setStock(stock: boolean): this {
    this.stock = stock;
    return this;
  }
  build(): Product {
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
