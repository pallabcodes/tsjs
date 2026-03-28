// ### Factory Class Use Cases
//
// A **Factory class** is a design pattern that provides a way to create objects without specifying the exact class of object that will be created. It is used when you need to create instances of various classes that share a common interface or superclass but have different implementations based on some conditions or configuration.
//
// Key scenarios where you would use a Factory class:
//
// 1. **Creating Objects Based on Configuration or Conditions**: Create different types of objects based on dynamic inputs or conditions.
// 2. **Encapsulating Object Creation Logic**: Simplify complex object creation logic by centralizing it in a factory.
// 3. **Avoiding Direct Instantiation of Objects**: Hide the object instantiation details from the user.
// 4. **Creating Objects of Subclasses or Concrete Implementations**: Instantiate different concrete classes based on some criteria.
// 5. **Supporting Multiple Types of Objects (Product Families)**: Support the creation of multiple related objects that belong to a common theme.
// 6. **Deferred Instantiation (Lazy Loading)**: Delay object creation until it’s actually needed.

// #### 1. **Creating Objects Based on Configuration or Conditions**
interface MealPlan {
  getDetails(): string;
}

class VeganMealPlan implements MealPlan {
  getDetails() {
    return 'Vegan meal plan with plant-based ingredients.';
  }
}

class HealthyMealPlan implements MealPlan {
  getDetails() {
    return 'Healthy meal plan with low-fat and high-protein meals.';
  }
}

class MealPlanFactory {
  static createMealPlan(type: 'vegan' | 'healthy'): MealPlan {
    switch (type) {
      case 'vegan':
        return new VeganMealPlan();
      case 'healthy':
        return new HealthyMealPlan();
      default:
        throw new Error('Invalid meal plan type');
    }
  }
}

// Usage example
console.log(MealPlanFactory.createMealPlan('vegan').getDetails()); // Vegan meal plan with plant-based ingredients.

// #### 2. **Encapsulating Object Creation Logic**
class Meal {
  constructor(
    public starter: string,
    public main: string,
    public dessert: string,
    public drink: string
  ) {}
}

class MealFactory {
  static createMeal(type: 'vegan' | 'healthy'): Meal {
    switch (type) {
      case 'vegan':
        return new Meal(
          'Salad',
          'Veggie Stir Fry',
          'Vegan Pudding',
          'Vegan Shake'
        );
      case 'healthy':
        return new Meal('Fruit Salad', 'Grilled Chicken', 'Ice Cream', 'Water');
      default:
        throw new Error('Unknown meal type');
    }
  }
}

// Usage example
const healthyMeal = MealFactory.createMeal('healthy');
console.log(healthyMeal); // Meal { starter: 'Fruit Salad', main: 'Grilled Chicken', dessert: 'Ice Cream', drink: 'Water' }

// #### 3. **Avoiding Direct Instantiation of Objects**
interface Shape {
  draw(): void;
}

class Circle implements Shape {
  draw() {
    console.log('Drawing a Circle');
  }
}

class Rectangle implements Shape {
  draw() {
    console.log('Drawing a Rectangle');
  }
}

class ShapeFactory {
  static createShape(type: 'circle' | 'rectangle'): Shape {
    switch (type) {
      case 'circle':
        return new Circle();
      case 'rectangle':
        return new Rectangle();
      default:
        throw new Error('Invalid shape type');
    }
  }
}

// Usage example
const circle = ShapeFactory.createShape('circle');
circle.draw(); // Drawing a Circle

// #### 4. **Creating Objects of Subclasses or Concrete Implementations**
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
  static createPaymentMethod(method: 'creditCard' | 'paypal'): PaymentMethod {
    switch (method) {
      case 'creditCard':
        return new CreditCardPayment();
      case 'paypal':
        return new PayPalPayment();
      default:
        throw new Error('Invalid payment method');
    }
  }
}

// Usage example
const payment = PaymentFactory.createPaymentMethod('creditCard');
payment.processPayment(100); // Processing payment of $100 through Credit Card

// #### 5. **Supporting Multiple Types of Objects (Product Families)**
interface ServiceProduct {
  getDetails(): string;
}

class BasicService implements ServiceProduct {
  getDetails() {
    return 'Basic service plan with limited features.';
  }
}

class PremiumService implements ServiceProduct {
  getDetails() {
    return 'Premium service plan with extended features and support.';
  }
}

class ServiceFactory {
  static createService(type: 'basic' | 'premium'): ServiceProduct {
    switch (type) {
      case 'basic':
        return new BasicService();
      case 'premium':
        return new PremiumService();
      default:
        throw new Error('Unknown service type');
    }
  }
}

// Usage example
const premiumService = ServiceFactory.createService('premium');
console.log(premiumService.getDetails()); // Premium service plan with extended features and support.

/* 
  #### 6. **Deferred Instantiation (Lazy Loading)**
  The factory ensures that objects like database connections are instantiated only when they are actually needed.
*/
class DatabaseConnection {
  private readonly connection: string;

  constructor() {
    console.log('Establishing database connection...');
    this.connection = 'Connected to database';
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
console.log(db1.getConnection()); // Connected to database

// ### Additional Scenario: **Abstracting Object Creation for Future Extensions**
// A scenario where a factory helps create objects without the need for the user to care about future extensions or additional subclasses.

interface Transport {
  move(): void;
}

class Car implements Transport {
  move() {
    console.log('Driving a Car');
  }
}

class Bike implements Transport {
  move() {
    console.log('Riding a Bike');
  }
}

class TransportFactory {
  static createTransport(type: 'car' | 'bike'): Transport {
    switch (type) {
      case 'car':
        return new Car();
      case 'bike':
        return new Bike();
      default:
        throw new Error('Unknown transport type');
    }
  }
}

// Usage example
const transport = TransportFactory.createTransport('car');
transport.move(); // Driving a Car

// 7. Abstracting Object Creation for Future Extensions

// A factory can abstract the process of object creation in such a way that new types of objects can be added in the future without altering the existing code. This is particularly useful when the system might evolve and require new classes or objects in the future.

// Animal Interface and Concrete Classes
interface Animal {
  makeSound(): void;
}

class Dog implements Animal {
  makeSound() {
    console.log('Bark');
  }
}

class Cat implements Animal {
  makeSound() {
    console.log('Meow');
  }
}

// Animal Factory
class AnimalFactory {
  static createAnimal(type: string): Animal {
    if (type === 'dog') {
      return new Dog();
    } else if (type === 'cat') {
      return new Cat();
    } else {
      throw new Error('Unknown animal type');
    }
  }
}

// Usage example
const dog = AnimalFactory.createAnimal('dog');
dog.makeSound(); // "Bark"

// Future extension: Adding a new animal class (without changing existing code)
export class Bird implements Animal {
  makeSound() {
    console.log('Tweet');
  }
}

// New Animal type can now be created using the same factory
const bird = AnimalFactory.createAnimal('bird');
bird.makeSound(); // "Tweet"
