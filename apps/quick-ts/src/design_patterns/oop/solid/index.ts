// Scenario:
// We’re building a Product Management System that supports managing product information, applying discounts, and generating reports based on the products in a catalog. We want to ensure our system is flexible and maintainable, and follows the SOLID principles.
//
//   SOLID Principles Overview:
//   Single Responsibility Principle: A class should have only one reason to change.
//   Open/Closed Principle: Software entities (classes, modules, functions) should be open for extension but closed for modification.
//                                                                                                                        Liskov Substitution Principle: Objects of a superclass should be replaceable with objects of its subclasses without affecting the functionality.
//   Interface Segregation Principle: Clients should not be forced to depend on interfaces they do not use.
//   Dependency Inversion Principle: High-level modules should not depend on low-level modules; both should depend on abstractions.

// Full Example: Product Management System

// ==========================
// 1. Single Responsibility Principle
// ==========================
class Product {
  constructor(
    public readonly id: number,
    public name: string,
    public price: number,
    public description: string
  ) {}
}

// This class has only one responsibility: managing product data (name, price, description)
class ProductRepository {
  private products: Product[] = [];

  // Add a product to the repository
  addProduct(product: Product): void {
    this.products.push(product);
  }

  // Get all products from the repository
  getAllProducts(): Product[] {
    return this.products;
  }

  // Find a product by ID
  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}

// ==========================
// 2. Open/Closed Principle
// ==========================
interface DiscountStrategy {
  applyDiscount(product: Product): void;
}

// Extending functionality for new discount types without modifying the ProductRepository class
class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  applyDiscount(product: Product): void {
    product.price -= product.price * (this.percentage / 100);
  }
}

class FixedDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  applyDiscount(product: Product): void {
    product.price -= this.amount;
  }
}

// ==========================
// 3. Liskov Substitution Principle
// ==========================
class ProductDiscount {
  private discountStrategy: DiscountStrategy;

  // Use the strategy that can be swapped without breaking functionality
  constructor(discountStrategy: DiscountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  applyDiscount(product: Product): void {
    this.discountStrategy.applyDiscount(product);
  }
}

// Any subclass of DiscountStrategy can be used here without breaking the code
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const percentageDiscount = new ProductDiscount(new PercentageDiscount(10));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fixedDiscount = new ProductDiscount(new FixedDiscount(50));

// ==========================
// 4. Interface Segregation Principle
// ==========================
interface ProductCreationService {
  createProduct(name: string, price: number, description: string): Product;
}

interface DiscountApplicationService {
  applyDiscount(product: Product): void;
}

// Here, we define smaller, focused interfaces so that classes implement only what they need
class ProductCreationServiceImpl implements ProductCreationService {
  createProduct(name: string, price: number, description: string): Product {
    const id = Math.floor(Math.random() * 1000); // Generate random ID
    return new Product(id, name, price, description);
  }
}

class DiscountApplicationServiceImpl implements DiscountApplicationService {
  private productDiscount: ProductDiscount;

  constructor(discountStrategy: DiscountStrategy) {
    this.productDiscount = new ProductDiscount(discountStrategy);
  }

  applyDiscount(product: Product): void {
    this.productDiscount.applyDiscount(product);
  }
}

// ==========================
// 5. Dependency Inversion Principle
// ==========================
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

// High-level module that depends on abstraction rather than the low-level ConsoleLogger implementation
class ProductService {
  private productRepository: ProductRepository;
  private logger: Logger;

  constructor(productRepository: ProductRepository, logger: Logger) {
    this.productRepository = productRepository;
    this.logger = logger;
  }

  createAndSaveProduct(
    name: string,
    price: number,
    description: string
  ): Product {
    const product = new Product(
      Math.floor(Math.random() * 1000),
      name,
      price,
      description
    ); // Random ID for simplicity
    this.productRepository.addProduct(product);
    this.logger.log(`Product created: ${product.name}`);
    return product;
  }

  getProducts(): Product[] {
    return this.productRepository.getAllProducts();
  }
}

// ==========================
// 6. Putting Everything Together
// ==========================
const productRepo = new ProductRepository();
const consoleLogger = new ConsoleLogger();
const productCreationService = new ProductCreationServiceImpl();

// Create a product using the creation service
const newProduct = productCreationService.createProduct(
  'Product 2',
  150,
  'Another Sample Product'
);
productRepo.addProduct(newProduct);

const productService = new ProductService(productRepo, consoleLogger);

// Create and save a product
const product = productService.createAndSaveProduct(
  'Product 1',
  100,
  'Sample Product'
);

console.log('Before Discount:', product);

// Apply a discount to the product
const discountService = new DiscountApplicationServiceImpl(
  new PercentageDiscount(20)
);
discountService.applyDiscount(product);

console.log('After Discount:', product);

// SOLID Breakdown:
//   1. Single Responsibility Principle (SRP):
// The Product class is responsible for holding product data.
//   The ProductRepository class is responsible for managing products (adding and fetching).
// The ProductCreationService and DiscountApplicationService are focused on specific tasks: product creation and applying discounts.
// 2. Open/Closed Principle (OCP):
// The ProductRepository class is closed for modification. We don't need to change this class to add new functionality like applying discounts or calculating taxes. We can extend functionality by adding new strategies like PercentageDiscount or FixedDiscount, which implement the DiscountStrategy interface.
// 3. Liskov Substitution Principle (LSP):
// ProductDiscount class allows substituting any subclass of DiscountStrategy (like PercentageDiscount or FixedDiscount) without affecting its functionality.
//   The ProductDiscount class can be passed any DiscountStrategy subclass, and the logic will still work, thus adhering to Liskov's principle.
// 4. Interface Segregation Principle (ISP):
// The interfaces ProductCreationService and DiscountApplicationService are focused and small.
//   The ProductService class only depends on the interfaces it needs. It doesn’t need to implement methods for discount application if it's not needed, adhering to ISP.
// 5. Dependency Inversion Principle (DIP):
// The ProductService depends on the Logger interface rather than a concrete class (ConsoleLogger). This makes the high-level ProductService not depend on low-level details of logging, allowing for easy substitution of logging implementations (like FileLogger or CloudLogger).

// Conclusion:
// This example demonstrates the SOLID principles in a Product Management system, making the system more modular, flexible, and maintainable. By adhering to these principles, the system is open for extension but closed for modification, follows proper abstraction layers, and keeps responsibilities well-defined.
