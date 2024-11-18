// The **Prototype Design Pattern** is useful when you need to create new objects by cloning an existing object rather than creating new ones from scratch. It's especially helpful when:
//
// 1. **Performance Concerns**: When object creation is costly (e.g., time or resources), cloning is faster.
// 2. **Avoiding Repetitive Object Creation**: When the objects share similar attributes but differ in a few fields, cloning can reduce redundant code.
// 3. **Complex Object Creation**: For objects that require extensive setup, cloning simplifies the process.
// 4. **State Sharing**: When several objects need to share a common state, cloning an existing object with that state helps maintain consistency.
//
// ### Scenarios for Using the Prototype Pattern:
//     1. **Cloning Objects with Shared State**
// 2. **Creating Complex Configurations with Similar Components**
// 3. **Prototype Caching for Expensive Objects**
// 4. **Customizable Object Creation**
//
// ### Example: Using Prototype Pattern in Real-World Product-Based Standards
//
// Let’s demonstrate the Prototype Pattern in the context of an **Order System**. In this system, orders are placed with specific configurations, and you can create new orders by cloning a prototype order.


// ### Scenario 1: Cloning Objects with Shared State
//
// In this case, you might need to clone an order configuration where the customer can choose certain customizations while retaining some base properties that are common to many orders (like product, payment method, and delivery details).
//
// ### Code Example:

interface OrderPrototype {
    clone(): OrderPrototype;
    getDetails(): string;
}

class Order implements OrderPrototype {
    constructor(
        private product: string,
        private quantity: number,
        private paymentMethod: string,
        private deliveryMethod: string
    ) {}

    // Method to clone an order
    clone(): OrderPrototype {
        return new Order(this.product, this.quantity, this.paymentMethod, this.deliveryMethod);
    }

    // Method to show the order details
    getDetails(): string {
        return `Product: ${this.product}, Quantity: ${this.quantity}, Payment: ${this.paymentMethod}, Delivery: ${this.deliveryMethod}`;
    }
}

class OrderManager {
    private prototypeOrder: OrderPrototype;

    constructor() {
        // Initialize with a default order configuration
        this.prototypeOrder = new Order("Laptop", 1, "Credit Card", "Standard Shipping");
    }

    // Method to create a new order by cloning the prototype
    createOrder(quantity: number, paymentMethod: string, deliveryMethod: string): OrderPrototype {
        const newOrder = this.prototypeOrder.clone() as Order;
        newOrder['quantity'] = quantity;
        newOrder['paymentMethod'] = paymentMethod;
        newOrder['deliveryMethod'] = deliveryMethod;
        return newOrder;
    }
}

// Usage
const orderManager = new OrderManager();
const order1 = orderManager.createOrder(2, "PayPal", "Express Shipping");
console.log(order1.getDetails());

const order2 = orderManager.createOrder(3, "Credit Card", "Standard Shipping");
console.log(order2.getDetails());

// ### Explanation:
// 1. **Prototype Interface**: `OrderPrototype` defines the `clone` method, which is used to create copies of objects.
// 2. **Concrete Prototype**: The `Order` class implements the `clone` method, and it contains the base order properties.
// 3. **OrderManager**: This class maintains the prototype order and can create new orders by cloning and modifying the prototype.
//
// ### Scenario 2: Creating Complex Configurations with Similar Components

// Suppose you have a **product configuration system** where products have similar base configurations but different details based on the customer's choices. The Prototype pattern allows for cloning a product configuration prototype and then customizing it.
//
// ### Code Example:

interface ProductPrototype {
    clone(): ProductPrototype;
    getDetails(): string;
}

class Product implements ProductPrototype {
    constructor(
        private name: string,
        private color: string,
        private size: string,
        private accessories: string[]
    ) {}

    // Clone method to clone the base product
    clone(): ProductPrototype {
        return new Product(this.name, this.color, this.size, [...this.accessories]);
    }

    // Method to get product details
    getDetails(): string {
        return `Product: ${this.name}, Color: ${this.color}, Size: ${this.size}, Accessories: ${this.accessories.join(", ")}`;
    }
}

class ProductConfigurator {
    private prototypeProduct: ProductPrototype;

    constructor() {
        // Set up a default base product configuration
        this.prototypeProduct = new Product("Smartphone", "Black", "Medium", ["Case", "Screen Protector"]);
    }

    // Customize and clone the product
    createProduct(color: string, size: string, accessories: string[]): ProductPrototype {
        const newProduct = this.prototypeProduct.clone() as Product;
        newProduct['color'] = color;
        newProduct['size'] = size;
        newProduct['accessories'] = accessories;
        return newProduct;
    }
}

// Usage
const configurator = new ProductConfigurator();
const product1 = configurator.createProduct("Red", "Large", ["Charger", "Earphones"]);
console.log(product1.getDetails());

const product2 = configurator.createProduct("Blue", "Small", ["Charger"]);
console.log(product2.getDetails());

// ### Explanation:
// 1. **ProductPrototype Interface**: Defines the `clone` method for cloning product configurations.
// 2. **Concrete Product**: `Product` implements the `clone` method and defines a set of customizable properties.
// 3. **ProductConfigurator**: The prototype configuration for the product is cloned and customized according to user preferences.
// ### Scenario 3: Prototype Caching for Expensive Objects
// For applications with expensive or complex objects (like report generation, charting, or document rendering), cloning the prototype instead of recreating the entire object from scratch can improve performance.

// ### Code Example:

interface ReportPrototype {
    clone(): ReportPrototype;
    generate(): string;
}

class ReportTemplate implements ReportPrototype {
    constructor(private content: string) {}

    // Clone method to clone a report object
    clone(): ReportPrototype {
        return new ReportTemplate(this.content);
    }

    // Method to generate report content (simulated with a delay for performance)
    generate(): string {
        return `Report Content: ${this.content}`;
    }
}

class ReportManager {
    private prototypeReport: ReportPrototype;

    constructor() {
        // Initialize with a default report template
        this.prototypeReport = new ReportTemplate("Default Report Content");
    }

    // Method to generate a new report by cloning the prototype
    generateReport(content: string): ReportPrototype {
        const newReport = this.prototypeReport.clone() as ReportTemplate;
        newReport['content'] = content;
        return newReport;
    }
}

// Usage
const reportManager = new ReportManager();
const report1 = reportManager.generateReport("Financial Report for Q1");
console.log(report1.generate());

const report2 = reportManager.generateReport("Employee Performance Report");
console.log(report2.generate());

// ### Explanation:
// 1. **ReportPrototype Interface**: Defines the `clone` method for creating copies of report objects.
// 2. **Concrete ReportTemplate**: The `ReportTemplate` class implements the `clone` method to duplicate report templates.
// 3. **ReportManager**: Caches the prototype report and generates new reports by cloning and customizing the prototype, improving performance.

// ### Scenario 4: Customizable Object Creation

// In a **Game World**, you might have character profiles that can be cloned, with slight modifications based on the player's choices.

// ### Code Example:

interface CharacterPrototype {
    clone(): CharacterPrototype;
    getStats(): string;
}

class Character implements CharacterPrototype {
    constructor(
        private name: string,
        private level: number,
        private health: number,
        private attack: number
    ) {}

    // Clone method to clone the character
    clone(): CharacterPrototype {
        return new Character(this.name, this.level, this.health, this.attack);
    }

    // Method to get character stats
    getStats(): string {
        return `Name: ${this.name}, Level: ${this.level}, Health: ${this.health}, Attack: ${this.attack}`;
    }
}

class CharacterCreator {
    private prototypeCharacter: CharacterPrototype;

    constructor() {
        // Initialize with a default character template
        this.prototypeCharacter = new Character("Warrior", 1, 100, 10);
    }

    // Create new character by cloning and modifying the prototype
    createCharacter(level: number, health: number, attack: number): CharacterPrototype {
        const newCharacter = this.prototypeCharacter.clone() as Character;
        newCharacter['level'] = level;
        newCharacter['health'] = health;
        newCharacter['attack'] = attack;
        return newCharacter;
    }
}

// Usage
const creator = new CharacterCreator();
const character1 = creator.createCharacter(5, 150, 20);
console.log(character1.getStats());

const character2 = creator.createCharacter(10, 200, 30);
console.log(character2.getStats());

// ### Explanation:
// 1. **CharacterPrototype Interface**: Defines the `clone` method to copy character objects.
// 2. **Concrete Character**: The `Character` class implements the `clone` method for duplicating characters.
// 3. **CharacterCreator**: Uses the prototype pattern to create new characters by cloning and customizing the base character template.
//
// ---
//
// ### Summary:
//
// - **Scenario 1**: Cloning objects with shared state (Order System).
// - **Scenario 2**: Creating complex configurations with similar components (Product Configuration).
// - **Scenario 3**: Prototype caching for expensive objects (Report Generation).
// - **Scenario 4**: Customizable object creation (Game Characters).
