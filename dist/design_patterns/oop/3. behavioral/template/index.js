"use strict";
// Abstract class defining the template method
class AbstractClass {
    // Template method
    templateMethod() {
        this.stepOne();
        this.stepTwo();
        this.stepThree();
    }
    stepThree() {
        console.log('Step Three: Common implementation');
    }
}
// Concrete class implementing the abstract steps
class ConcreteClass extends AbstractClass {
    stepOne() {
        console.log('Step One: Implementation for Concrete Class');
    }
    stepTwo() {
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
//# sourceMappingURL=index.js.map