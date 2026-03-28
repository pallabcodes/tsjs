/**
 * Real-World Product-Based Flyweight Pattern in TypeScript
 * In a product-based real-world scenario, let's say we are building a product catalog for an e-commerce platform. Each product in the catalog has attributes like:
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Product name
 * Category
 * Price
 * Description
 * Stock information
 * */

/**
 * Here, we'll have:
 *
 * A ProductFlyweightFactory that manages the shared product data.
 * A ProductFlyweight that holds the shared and non-shared states.
 * A ProductCatalog to manage the entire catalog, which will make use of the Flyweight pattern for managing large numbers of similar products.
 * */

// Product Flyweight Class - This will hold the shared data (intrinsic state)
class ProductFlyweight {
  private category: string;
  private description: string;
  private price: number;

  constructor(category: string, description: string, price: number) {
    this.category = category;
    this.description = description;
    this.price = price;
  }

  getCategory(): string {
    return this.category;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }
}

// Product Class - This will hold both shared (intrinsic) and unique (extrinsic) data
class Product {
  private id: string;
  private name: string;
  private stock: number;
  private flyweight: ProductFlyweight;

  constructor(
    id: string,
    name: string,
    stock: number,
    flyweight: ProductFlyweight
  ) {
    this.id = id;
    this.name = name;
    this.stock = stock;
    this.flyweight = flyweight;
  }

  // Getter method for 'id' to allow access to the private 'id' property
  getId(): string {
    return this.id;
  }

  getDetails(): string {
    return `Product ID: ${this.getId()}, Name: ${
      this.name
    }, Category: ${this.flyweight.getCategory()}, Description: ${this.flyweight.getDescription()}, Price: $${this.flyweight.getPrice()}, Stock: ${
      this.stock
    }`;
  }

  getStock(): number {
    return this.stock;
  }

  setStock(stock: number): void {
    this.stock = stock;
  }

  getFlyweight(): ProductFlyweight {
    return this.flyweight;
  }
}

// Flyweight Factory - Manages sharing of common product data
class ProductFlyweightFactory {
  private flyweights: Map<string, ProductFlyweight> = new Map();

  getFlyweight(
    category: string,
    description: string,
    price: number
  ): ProductFlyweight {
    const key = `${category}-${description}-${price}`;
    if (!this.flyweights.has(key)) {
      console.log(`Creating new Flyweight for ${category}`);
      const flyweight = new ProductFlyweight(category, description, price);
      this.flyweights.set(key, flyweight);
    } else {
      console.log(`Reusing existing Flyweight for ${category}`);
    }
    return this.flyweights.get(key)!;
  }

  // Optional: Method to remove flyweights from memory if no longer needed (for cleanup)
  removeFlyweight(category: string, description: string, price: number): void {
    const key = `${category}-${description}-${price}`;
    this.flyweights.delete(key);
  }

  // Method to get all the existing flyweights
  getAllFlyweights(): ProductFlyweight[] {
    return Array.from(this.flyweights.values());
  }
}

// Product Catalog - Manages products in the catalog and uses the Flyweight pattern
class ProductCatalog {
  private products: Product[] = [];
  private flyweightFactory: ProductFlyweightFactory =
    new ProductFlyweightFactory();

  addProduct(
    id: string,
    name: string,
    category: string,
    description: string,
    price: number,
    stock: number
  ): void {
    const flyweight = this.flyweightFactory.getFlyweight(
      category,
      description,
      price
    );
    const product = new Product(id, name, stock, flyweight);
    this.products.push(product);
  }

  getProductDetails(id: string): string | undefined {
    const product = this.products.find(p => p.getId() === id);
    return product ? product.getDetails() : undefined;
  }

  getProductStock(id: string): number | undefined {
    const product = this.products.find(p => p.getId() === id);
    return product ? product.getStock() : undefined;
  }

  updateProductStock(id: string, stock: number): void {
    const product = this.products.find(p => p.getId() === id);
    if (product) {
      product.setStock(stock);
    }
  }

  getFlyweights(): ProductFlyweight[] {
    return this.flyweightFactory.getAllFlyweights();
  }
}

// Example Usage

const catalog = new ProductCatalog();

// Add products to catalog with shared Flyweight data
catalog.addProduct(
  '001',
  'Laptop',
  'Electronics',
  'A high-performance laptop',
  1000,
  50
);
catalog.addProduct(
  '002',
  'Smartphone',
  'Electronics',
  'A latest model smartphone',
  800,
  30
);
catalog.addProduct(
  '003',
  'Bluetooth Headphones',
  'Accessories',
  'Noise-canceling headphones',
  200,
  100
);

// Get product details
console.log(catalog.getProductDetails('001'));
console.log(catalog.getProductDetails('002'));
console.log(catalog.getProductDetails('003'));

// Update product stock
catalog.updateProductStock('001', 45);
console.log('Updated stock for Laptop:', catalog.getProductStock('001'));

// Get shared flyweights
console.log('Flyweights in use:');
const flyweights = catalog.getFlyweights();
flyweights.forEach(fw => {
  console.log(
    `Category: ${fw.getCategory()}, Description: ${fw.getDescription()}, Price: $${fw.getPrice()}`
  );
});

// Simulate cleanup (optional)
catalog['flyweightFactory'].removeFlyweight(
  'Electronics',
  'A high-performance laptop',
  1000
);

/**
 * Key Features in the Code:
 * Flyweight Class:
 *
 * The ProductFlyweight class holds the shared (intrinsic) data of the product, such as category, description, and price.
 * These attributes are common across many product instances, so we only store them once, regardless of the number of products that share the same values.
 * Product Class:
 *
 * The Product class represents a product with a unique id, name, and stock. The shared data (such as category, description, and price) is stored in the ProductFlyweight instance, which is passed during product creation.
 * This class encapsulates the non-shared (extrinsic) data like stock.
 * Flyweight Factory:
 *
 * The ProductFlyweightFactory manages the creation and reuse of ProductFlyweight instances. It ensures that flyweight objects are shared rather than duplicated for identical attribute sets.
 * The getFlyweight method checks if a flyweight already exists for a combination of category, description, and price and reuses it if possible.
 * The factory can also remove flyweights from memory for cleanup if no longer needed.
 * Product Catalog:
 *
 * The ProductCatalog class manages the collection of products. It uses the ProductFlyweightFactory to ensure that products with shared attributes do not hold duplicate data.
 * The catalog can add products, retrieve product details, update product stock, and retrieve all flyweights currently in use.
 * Flyweight Reuse:
 *
 * When adding products like Laptop, Smartphone, and Headphones, the flyweight data (like category, description, and price) is shared between all products that have the same attributes. This reduces memory usage in the system.
 * Real-World Application Scenarios:
 * E-commerce Platforms:
 *
 * In an e-commerce platform, thousands of products may have similar attributes, such as price ranges or product categories. Instead of storing the same data for each product, we can use the Flyweight pattern to reduce memory usage and improve performance.
 * Gaming:
 *
 * In a game, entities like weapons, enemies, or objects may have common properties (e.g., damage, type, color). These can be shared via the Flyweight pattern to reduce memory overhead when dealing with large numbers of similar objects.
 * UI Components:
 *
 * If you have many UI components that share similar layouts, styles, or behaviors (like buttons, forms), you can use the Flyweight pattern to share the common elements and minimize memory consumption.
 * Document or Report Generation:
 *
 * If you're generating many similar reports or documents with shared templates or metadata (e.g., titles, headers), you can use Flyweight to reuse the template data and avoid duplication.
 *
 * */

/**
 * Creating new Flyweight for Electronics
 * Creating new Flyweight for Electronics
 * Creating new Flyweight for Accessories
 * Product ID: 001, Name: Laptop, Category: Electronics, Description: A high-performance laptop, Price: $1000, Stock: 50
 * Product ID: 002, Name: Smartphone, Category: Electronics, Description: A latest model smartphone, Price: $800, Stock: 30
 * Product ID: 003, Name: Bluetooth Headphones, Category: Accessories, Description: Noise-canceling headphones, Price: $200, Stock: 100
 * Updated stock for Laptop: 45

 * Flyweights in use:
 * Category: Electronics, Description: A high-performance laptop, Price: $1000
 * Category: Electronics, Description: A latest model smartphone, Price: $800
 * Category: Accessories, Description: Noise-canceling headphones, Price: $200
 *
 * */
