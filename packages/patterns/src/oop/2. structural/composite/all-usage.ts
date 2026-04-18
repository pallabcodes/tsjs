// ### Composite Pattern Use Cases
//
// The **Composite Pattern** is useful when:
//
// 1. **Tree Structures**: Represent part-whole hierarchies (e.g., file systems, organizational charts).
// 2. **Uniform Operations**: Treat individual objects and object collections uniformly.
// 3. **Recursive Composition**: Allow objects to be nested arbitrarily.
// 4. **Simplifying Client Code**: Abstract operations on a complex structure into a simple interface.
// 5. **Dynamic Modification**: Dynamically add or remove parts of a composition.
// 6. **Leaf and Composite Management**: Manage leaf nodes and composites under the same abstraction.

// #### 1. **Tree Structures**
interface Component {
  render(): string;
}

class Leaf implements Component {
  constructor(private name: string) {}

  render(): string {
    return this.name;
  }
}

class Composite implements Component {
  public children: Component[] = [];

  constructor(private name: string) {}

  add(child: Component): void {
    this.children.push(child);
  }

  remove(child: Component): void {
    this.children = this.children.filter(c => c !== child);
  }

  render(): string {
    return `${this.name}(${this.children
      .map(child => child.render())
      .join(', ')})`;
  }
}

// Usage example
const root = new Composite('root');
const branch1 = new Composite('branch1');
const branch2 = new Composite('branch2');
const leaf1 = new Leaf('leaf1');
const leaf2 = new Leaf('leaf2');

root.add(branch1);
root.add(branch2);
branch1.add(leaf1);
branch2.add(leaf2);

console.log(root.render()); // root(branch1(leaf1), branch2(leaf2))

// #### 2. **Uniform Operations**
abstract class Graphic {
  abstract draw(): void;
}

class Circle extends Graphic {
  draw(): void {
    console.log('Drawing a Circle');
  }
}

class Rectangle extends Graphic {
  draw(): void {
    console.log('Drawing a Rectangle');
  }
}

class GraphicComposite extends Graphic {
  private graphics: Graphic[] = [];

  add(graphic: Graphic): void {
    this.graphics.push(graphic);
  }

  draw(): void {
    for (const graphic of this.graphics) {
      graphic.draw();
    }
  }
}

// Usage example
const graphicGroup = new GraphicComposite();
graphicGroup.add(new Circle());
graphicGroup.add(new Rectangle());
graphicGroup.draw();
// Output:
// Drawing a Circle
// Drawing a Rectangle

// #### 3. **Recursive Composition**
class Folder implements Component {
  private contents: Component[] = [];

  constructor(private folderName: string) {}

  add(component: Component): void {
    this.contents.push(component);
  }

  render(): string {
    return `${this.folderName}/{${this.contents
      .map(c => c.render())
      .join(', ')}}`;
  }
}

// Usage example
const rootFolder = new Folder('Root');
const subFolder = new Folder('SubFolder');
const file = new Leaf('File.txt');

rootFolder.add(subFolder);
subFolder.add(file);

console.log(rootFolder.render()); // Root/{SubFolder/{File.txt}}

// #### 4. **Simplifying Client Code**
interface Employee {
  getDetails(): string;
}

class Developer implements Employee {
  constructor(private name: string, private role: string) {}

  getDetails(): string {
    return `${this.name} (${this.role})`;
  }
}

class Manager implements Employee {
  private employees: Employee[] = [];

  constructor(private name: string) {}

  addEmployee(employee: Employee): void {
    this.employees.push(employee);
  }

  getDetails(): string {
    const employeeDetails = this.employees
      .map(e => e.getDetails())
      .join('\n  ');
    return `${this.name} (Manager):\n  ${employeeDetails}`;
  }
}

// Usage example
const dev1 = new Developer('Alice', 'Frontend Developer');
const dev2 = new Developer('Bob', 'Backend Developer');
const manager = new Manager('Charlie');
manager.addEmployee(dev1);
manager.addEmployee(dev2);
console.log(manager.getDetails());
// Output:
// Charlie (Manager):
//   Alice (Frontend Developer)
//   Bob (Backend Developer)

// #### 5. **Dynamic Modification**
class DynamicComposite extends Composite {
  clear(): void {
    this.children = [];
  }
}

// Usage example
const dynamicRoot = new DynamicComposite('DynamicRoot');
dynamicRoot.add(new Leaf('DynamicLeaf'));
dynamicRoot.clear();
console.log(dynamicRoot.render()); // DynamicRoot()

// #### 6. **Leaf and Composite Management**
class MenuItem implements Component {
  constructor(private name: string) {}

  render(): string {
    return this.name;
  }
}

class Menu implements Component {
  private items: Component[] = [];

  add(item: Component): void {
    this.items.push(item);
  }

  render(): string {
    return `Menu: [${this.items.map(item => item.render()).join(', ')}]`;
  }
}

// Usage example
const menu = new Menu();
menu.add(new MenuItem('File'));
menu.add(new MenuItem('Edit'));
console.log(menu.render()); // Menu: [File, Edit]
