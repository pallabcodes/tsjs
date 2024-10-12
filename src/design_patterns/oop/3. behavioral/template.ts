// Abstract class defining the template method
abstract class AbstractClass {
  // Template method
  templateMethod(): void {
    this.stepOne();
    this.stepTwo();
    this.stepThree();
  }

  protected abstract stepOne(): void; // Abstract step
  protected abstract stepTwo(): void; // Abstract step

  protected stepThree(): void {
    console.log('Step Three: Common implementation');
  }
}

// Concrete class implementing the abstract steps
class ConcreteClass extends AbstractClass {
  protected stepOne(): void {
    console.log('Step One: Implementation for Concrete Class');
  }

  protected stepTwo(): void {
    console.log('Step Two: Implementation for Concrete Class');
  }
}

// Usage
const concrete = new ConcreteClass();
concrete.templateMethod();
// Output:
// Step One: Implementation for Concrete Class
// Step Two: Implementation for Concrete Class
// Step Three: Common implementation

// When to use:
// Use this pattern when you want to define the skeleton of an algorithm in a base class, allowing subclasses to redefine certain steps without changing the algorithm's structure.
