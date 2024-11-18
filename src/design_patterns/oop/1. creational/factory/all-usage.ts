// ### Factory Class Use Cases
//
// A **Factory class** is a design pattern that provides a way to create objects without specifying the exact class of object that will be created. It is used when you need to create instances of various classes that share a common interface or superclass but have different implementations based on some conditions or configuration.
//
// Here are the key scenarios where you would use a Factory class:
//
// 1. **Creating Objects Based on Configuration or Conditions**
// - Use a factory to create different types of objects based on dynamic inputs, configurations, or conditions.
//
// 2. **Encapsulating Object Creation Logic**
// - When the object creation process is complex or involves several steps, a factory can encapsulate this logic.
//
// 3. **Avoiding Direct Instantiation of Objects**
// - Use a factory when you want to hide the details of object instantiation from the user and provide a simpler interface.
//
// 4. **Creating Objects of Subclasses or Concrete Implementations**
// - When you have a common interface or abstract class, and need to instantiate one of several concrete implementations based on some criteria.
//
// 5. **Supporting Multiple Types of Objects (Product Families)**
// - Factories can be used to support the creation of multiple related objects, such as a family of objects, each part of a common theme or set of features.

// 6. **Deferred Instantiation (Lazy Loading)**
// - A factory can also help defer the creation of objects until they are actually needed, which is useful in lazy loading scenarios.

// ### Examples Based on Each Scenario

// #### 1. **Creating Objects Based on Configuration or Conditions**
// Here, we use a factory to create different types of meal plans based on a configuration setting (e.g., "vegan" or "healthy").

// Base Meal Plan Interface
interface MealPlan {
  getDetails(): string;
}

// Concrete Meal Plans
class VeganMealPlan implements MealPlan {
  getDetails() {
    return "Vegan meal plan with plant-based ingredients.";
  }
}

class HealthyMealPlan implements MealPlan {
  getDetails() {
    return "Healthy meal plan with low-fat and high-protein meals.";
  }
}

class MealPlanFactory {
  static createMealPlan(type: string): MealPlan {
    if (type === "vegan") {
      return new VeganMealPlan();
    } else if (type === "healthy") {
      return new HealthyMealPlan();
    } else {
      throw new Error("Invalid meal plan type");
    }
  }
}

// Usage example
const veganPlan = MealPlanFactory.createMealPlan("vegan");
console.log(veganPlan.getDetails()); // "Vegan meal plan with plant-based ingredients."

// #### 2. **Encapsulating Object Creation Logic**
// Here, a factory is used to encapsulate the creation of meal components (starter, main, dessert, and drink), ensuring that the logic for assembling them is centralized.

// Meal Components
class Meal {
  constructor(
    public starter: string,
    public main: string,
    public dessert: string,
    public drink: string
  ) {}
}

class MealFactory {
  static createMeal(type: string): Meal {
    if (type === "vegan") {
      return new Meal("Salad", "Veggie Stir Fry", "Vegan Pudding", "Vegan Shake");
    } else if (type === "healthy") {
      return new Meal("Fruit Salad", "Grilled Chicken", "Ice Cream", "Water");
    } else {
      throw new Error("Unknown meal type");
    }
  }
}

// Usage example
const healthyMeal = MealFactory.createMeal("healthy");
console.log(healthyMeal); // Meal { starter: 'Fruit Salad', main: 'Grilled Chicken', dessert: 'Ice Cream', drink: 'Water' }

// #### 3. **Avoiding Direct Instantiation of Objects**
// In this example, the factory abstracts the instantiation of objects, and users of the `Shape` interface don't need to know which specific shape is created.

// Shape Interface and Concrete Shapes
interface Shape {
  draw(): void;
}

class Circle implements Shape {
  draw() {
    console.log("Drawing a Circle");
  }
}

class Rectangle implements Shape {
  draw() {
    console.log("Drawing a Rectangle");
  }
}

class ShapeFactory {
  static createShape(type: string): Shape {
    if (type === "circle") {
      return new Circle();
    } else if (type === "rectangle") {
      return new Rectangle();
    } else {
      throw new Error("Invalid shape type");
    }
  }
}

// Usage example
const circle = ShapeFactory.createShape("circle");
circle.draw(); // "Drawing a Circle"

// #### 4. **Creating Objects of Subclasses or Concrete Implementations**
// In this case, the factory decides which concrete `PaymentMethod` to return based on user input or configuration.

// Payment Method Interface and Concrete Classes
interface PaymentMethod {
  processPayment(amount: number): void;
}

class CreditCardPayment implements PaymentMethod {
  processPayment(amount: number) {
    console.log(`Processing payment of $${amount} through Credit Card`);
  }
}

class PayPalPayment implements PaymentMethod {
  processPayment(amount: number) {
    console.log(`Processing payment of $${amount} through PayPal`);
  }
}

class PaymentFactory {
  static createPaymentMethod(method: string): PaymentMethod {
    if (method === "creditCard") {
      return new CreditCardPayment();
    } else if (method === "paypal") {
      return new PayPalPayment();
    } else {
      throw new Error("Invalid payment method");
    }
  }
}

// Usage example
const payment = PaymentFactory.createPaymentMethod("creditCard");
payment.processPayment(100); // "Processing payment of $100 through Credit Card"

// #### 5. **Supporting Multiple Types of Objects (Product Families)**

// The factory can create different families of objects. In this example, we create products for a premium or basic service.

// Product Interface and Concrete Products
interface ServiceProduct {
  getDetails(): string;
}

class BasicService implements ServiceProduct {
  getDetails() {
    return "Basic service plan with limited features.";
  }
}

class PremiumService implements ServiceProduct {
  getDetails() {
    return "Premium service plan with extended features and support.";
  }
}

class ServiceFactory {
  static createService(type: string): ServiceProduct {
    if (type === "basic") {
      return new BasicService();
    } else if (type === "premium") {
      return new PremiumService();
    } else {
      throw new Error("Unknown service type");
    }
  }
}

// Usage example
const premiumService = ServiceFactory.createService("premium");
console.log(premiumService.getDetails()); // "Premium service plan with extended features and support."

// #### 6. **Deferred Instantiation (Lazy Loading)**

// In this example, the factory delays the instantiation of a large object (like a database connection or complex configuration) until it's needed.

class DatabaseConnection {
  private connection: string;

  constructor() {
    console.log("Establishing database connection...");
    this.connection = "Connected to database";
  }

  getConnection() {
    return this.connection;
  }
}

class DatabaseFactory {
  private static instance: DatabaseConnection;

  static getDatabaseConnection(): DatabaseConnection {
    if (!this.instance) {
      this.instance = new DatabaseConnection(); // Instantiated only when needed
    }
    return this.instance;
  }
}

// Usage example
const db1 = DatabaseFactory.getDatabaseConnection();
console.log(db1.getConnection()); // "Connected to database"

// ### Summary:
//
// - **Creating Objects Based on Configuration or Conditions**: Used when the type of object depends on dynamic conditions or user input.
// - **Encapsulating Object Creation Logic**: Centralizes complex object creation processes in a factory to reduce complexity in other parts of the application.
// - **Avoiding Direct Instantiation**: Factory abstracts the creation of objects, so consumers don't need to know the class that is being instantiated.
// - **Creating Objects of Subclasses or Concrete Implementations**: Useful when working with a common interface and multiple concrete implementations.
// - **Supporting Multiple Types of Objects (Product Families)**: Factories can create different families of related objects, improving scalability and manageability.
// - **Deferred Instantiation (Lazy Loading)**: Factories can delay the creation of expensive or heavy objects until they are actually needed.
//
//     Each of these examples demonstrates a different real-world use case for a Factory class, ensuring that the system remains flexible and maintainable.