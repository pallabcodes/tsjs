// The **Visitor Pattern** is a behavioral design pattern that allows you to add further operations to objects without modifying them. It decouples the operations from the objects they operate on, enabling flexibility in extending functionalities while adhering to the **Open/Closed Principle**.
//
// A single example can illustrate the core power of the **Visitor Pattern**, but it's essential to ensure it covers multiple scenarios, such as:
//
// 1. **Complex hierarchies of objects** that may require different operations.
// 2. **Extensibility** by adding new operations without changing the existing object structure.
// 3. **Real-world scenarios** where the pattern shines, such as:
// - Processing a **Document Tree (PDF, Word)**.
// - Managing operations in a **File System**.
// - Extending business rules in **financial systems** or **gaming engines**.
//
//
// ### Comprehensive Real-World Example: Tax Calculation for Different Products
// This example will cover:
//   - **Complex Object Structures**: Different products, like books, electronics, and groceries.
// - **Extensibility**: Adding new operations (e.g., discounts, inventory checks) without changing the product classes.
// - **Multiple Visitors**: Each visitor represents a distinct operation, such as tax calculation, discount application, or inventory updates.


// #### 1. **Object Structure**: The Visitable Elements

  interface Visitable {
    accept(visitor: Visitor): void;
}

class Book implements Visitable {
    constructor(public readonly title: string, public readonly price: number) {}

    accept(visitor: Visitor): void {
        visitor.visitBook(this);
    }
}

class Electronic implements Visitable {
    constructor(public readonly brand: string, public readonly price: number) {}

    accept(visitor: Visitor): void {
        visitor.visitElectronic(this);
    }
}

class Grocery implements Visitable {
    constructor(public readonly name: string, public readonly weight: number, public readonly pricePerKg: number) {}

    accept(visitor: Visitor): void {
        visitor.visitGrocery(this);
    }
}

// #### 2. **Visitor Interface and Concrete Visitors**
interface Visitor {
    visitBook(book: Book): void;
    visitElectronic(electronic: Electronic): void;
    visitGrocery(grocery: Grocery): void;
}

// Concrete Visitor: Tax Calculation
class TaxVisitor implements Visitor {
    visitBook(book: Book): void {
        console.log(`Book "${book.title}": Tax = $${(book.price * 0.1).toFixed(2)}`);
    }

    visitElectronic(electronic: Electronic): void {
        console.log(`Electronic "${electronic.brand}": Tax = $${(electronic.price * 0.15).toFixed(2)}`);
    }

    visitGrocery(grocery: Grocery): void {
        console.log(`Grocery "${grocery.name}": Tax = $${(grocery.weight * grocery.pricePerKg * 0.05).toFixed(2)}`);
    }
}

// Concrete Visitor: Discount Calculation
class DiscountVisitor implements Visitor {
    visitBook(book: Book): void {
        console.log(`Book "${book.title}": Discount = $${(book.price * 0.05).toFixed(2)}`);
    }

    visitElectronic(electronic: Electronic): void {
        console.log(`Electronic "${electronic.brand}": Discount = $${(electronic.price * 0.1).toFixed(2)}`);
    }

    visitGrocery(grocery: Grocery): void {
        console.log(`Grocery "${grocery.name}": Discount = $${(grocery.weight * grocery.pricePerKg * 0.02).toFixed(2)}`);
    }
}

// #### 3. **Client Code**
// The client interacts with the object structure and applies visitors as needed.

// Collection of visitable elements
const products: Visitable[] = [
    new Book("Design Patterns", 50),
    new Electronic("Smartphone", 1000),
    new Grocery("Apples", 2, 3) // 2kg at $3/kg
];

// Applying TaxVisitor
console.log("Calculating Taxes:");
const taxVisitor = new TaxVisitor();
products.forEach((product) => product.accept(taxVisitor));

console.log("\nCalculating Discounts:");
const discountVisitor = new DiscountVisitor();
products.forEach((product) => product.accept(discountVisitor));

// ### Output:

// Calculating Taxes:
// Book "Design Patterns": Tax = $5.00
// Electronic "Smartphone": Tax = $150.00
// Grocery "Apples": Tax = $0.30

// Calculating Discounts:
// Book "Design Patterns": Discount = $2.50
// Electronic "Smartphone": Discount = $100.00
// Grocery "Apples": Discount = $0.12


// ### Breakdown of Real-World Features:
//   1. **Complex Object Structures**:
// - Different product types (`Book`, `Electronic`, `Grocery`) with varied attributes and behaviors.
// - The `Visitable` interface unifies the structure, allowing seamless operations via `accept()`.

// 2. **Extensibility**:
// - Adding a new operation, such as `InventoryCheckVisitor`, does not require changes to the product classes.
// - For example:
class InventoryCheckVisitor implements Visitor {
         visitBook(book: Book): void {
             console.log(`Checking inventory for Book "${book.title}"`);
         }

         visitElectronic(electronic: Electronic): void {
             console.log(`Checking inventory for Electronic "${electronic.brand}"`);
         }

         visitGrocery(grocery: Grocery): void {
             console.log(`Checking inventory for Grocery "${grocery.name}"`);
         }
     }

// 3. **Multiple Visitors**:
// - Tax and discount calculations are handled independently.
// - You can apply any number of visitors dynamically without modifying the objects themselves.
//
// 4. **Fluent Interface and Open/Closed Principle**:
// - The system is open for adding new visitors but closed for modifications to existing classes.
//
// ---
//
// ### Is This Example Comprehensive?
//   Yes, this example illustrates the **full power** of the **Visitor Pattern** with **product-based standards**:
// - It handles **complex hierarchies** with varying attributes.
// - It supports **extensible operations**.
// - It demonstrates **real-world use cases** like tax and discount calculations.
// - It showcases **scalability** by allowing additional visitors, such as inventory checks or reporting mechanisms.
//
// ---
//
// ### Additional Scenarios for Exploration:
// If you want to extend your understanding, consider implementing:
//   1. **File System Operations**:
// - Visitors to calculate file sizes, list directories, or check permissions.
// 2. **Gaming Engines**:
// - Visitors for applying power-ups, scoring rules, or damage calculations.
//
//   This example is sufficient for a foundational understanding of the **Visitor Pattern** in **real-world product-based scenarios**. Still, you can always add domain-specific extensions depending on your field (e.g., financial systems, content management).