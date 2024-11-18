// use: Fluent API/Method Chaining

class Product {
  constructor(
    public name: string,
    public price: number,
    public category: string,
    public inStock: boolean
  ) {}
}

interface ProductBuilder {
  setName(name: string): this;
  setPrice(price: number): this;
  setCategory(category: string): this;
  setInStock(inStock: boolean): this;
  build(): Product;
}

class ElectronicsProductBuilder implements ProductBuilder {
  private name = 'Default Product';
  private price = 100;
  private category = 'Electronics';
  private inStock = true;

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setPrice(price: number): this {
    this.price = price;
    return this;
  }

  setCategory(category: string): this {
    this.category = category;
    return this;
  }

  setInStock(inStock: boolean): this {
    this.inStock = inStock;
    return this;
  }

  build(): Product {
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
