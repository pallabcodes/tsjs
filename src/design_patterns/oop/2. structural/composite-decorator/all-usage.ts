// ### Hybrid Decorator + Composite Pattern Use Cases

// The **Decorator Pattern** allows additional behavior to be added to an object dynamically without altering its structure.
// The **Composite Pattern** allows individual objects and compositions of objects to be treated uniformly.
// Combining both patterns is useful when you need to build a tree-like structure of objects that can be dynamically enhanced with additional behavior.

interface Component {
  operation(): void;
}

class Leaf implements Component {
  operation() {
    console.log('Leaf operation');
  }
}

class Composite implements Component {
  private children: Component[] = [];

  add(child: Component) {
    this.children.push(child);
  }

  operation() {
    console.log('Composite operation');
    this.children.forEach(child => child.operation());
  }
}

class Decorator implements Component {
  constructor(private component: Component) {}

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
