"use strict";
// ### Hybrid Decorator + Composite Pattern Use Cases
class Leaf {
    operation() {
        console.log('Leaf operation');
    }
}
class Composite {
    constructor() {
        this.children = [];
    }
    add(child) {
        this.children.push(child);
    }
    operation() {
        console.log('Composite operation');
        this.children.forEach(child => child.operation());
    }
}
class Decorator {
    constructor(component) {
        this.component = component;
    }
    operation() {
        console.log('Decorator operation');
        this.component.operation();
    }
}
// Usage example
const leaf = new Leaf();
const composite = new Composite();
composite.add(leaf);
const decoratedComposite = new Decorator(composite);
composite.operation(); // Composite operation -> Leaf operation
decoratedComposite.operation(); // Decorator operation -> Composite operation -> Leaf operation
//# sourceMappingURL=all-usage.js.map