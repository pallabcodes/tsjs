// Visitor interface
interface Visitor {
  visitElementA(element: ElementA): void;
  visitElementB(element: ElementB): void;
}

// Element interface
interface Element {
  accept(visitor: Visitor): void;
}

// Concrete elements
class ElementA implements Element {
  accept(visitor: Visitor): void {
    visitor.visitElementA(this);
  }

  operationA(): void {
    console.log('Element A operation');
  }
}

class ElementB implements Element {
  accept(visitor: Visitor): void {
    visitor.visitElementB(this);
  }

  operationB(): void {
    console.log('Element B operation');
  }
}

// Concrete visitor
class ConcreteVisitor implements Visitor {
  visitElementA(element: ElementA): void {
    console.log('Visiting Element A');
    element.operationA();
  }

  visitElementB(element: ElementB): void {
    console.log('Visiting Element B');
    element.operationB();
  }
}

// Usage
const elements: Element[] = [new ElementA(), new ElementB()];
const visitor = new ConcreteVisitor();

elements.forEach(element => {
  element.accept(visitor); // Each element accepts the visitor
});

// When to use:
// Use this pattern when you want to separate an algorithm from the object structure on which it operates.
