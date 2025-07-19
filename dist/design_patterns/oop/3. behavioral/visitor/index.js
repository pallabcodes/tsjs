"use strict";
// Concrete elements
class ElementA {
    accept(visitor) {
        visitor.visitElementA(this);
    }
    operationA() {
        console.log('Element A operation');
    }
}
class ElementB {
    accept(visitor) {
        visitor.visitElementB(this);
    }
    operationB() {
        console.log('Element B operation');
    }
}
// Concrete visitor
class ConcreteVisitor {
    visitElementA(element) {
        console.log('Visiting Element A');
        element.operationA();
    }
    visitElementB(element) {
        console.log('Visiting Element B');
        element.operationB();
    }
}
// Usage
const elements = [new ElementA(), new ElementB()];
const visitor = new ConcreteVisitor();
elements.forEach(element => {
    element.accept(visitor); // Each element accepts the visitor
});
// When to use:
// Use this pattern when you want to separate an algorithm from the object structure on which it operates.
//# sourceMappingURL=index.js.map