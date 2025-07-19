"use strict";
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
class Leaf {
    constructor(name) {
        this.name = name;
    }
    render() {
        return this.name;
    }
}
class Composite {
    constructor(name) {
        this.name = name;
        this.children = [];
    }
    add(child) {
        this.children.push(child);
    }
    remove(child) {
        this.children = this.children.filter(c => c !== child);
    }
    render() {
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
class Graphic {
}
class Circle extends Graphic {
    draw() {
        console.log('Drawing a Circle');
    }
}
class Rectangle extends Graphic {
    draw() {
        console.log('Drawing a Rectangle');
    }
}
class GraphicComposite extends Graphic {
    constructor() {
        super(...arguments);
        this.graphics = [];
    }
    add(graphic) {
        this.graphics.push(graphic);
    }
    draw() {
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
class Folder {
    constructor(folderName) {
        this.folderName = folderName;
        this.contents = [];
    }
    add(component) {
        this.contents.push(component);
    }
    render() {
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
class Developer {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }
    getDetails() {
        return `${this.name} (${this.role})`;
    }
}
class Manager {
    constructor(name) {
        this.name = name;
        this.employees = [];
    }
    addEmployee(employee) {
        this.employees.push(employee);
    }
    getDetails() {
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
    clear() {
        this.children = [];
    }
}
// Usage example
const dynamicRoot = new DynamicComposite('DynamicRoot');
dynamicRoot.add(new Leaf('DynamicLeaf'));
dynamicRoot.clear();
console.log(dynamicRoot.render()); // DynamicRoot()
// #### 6. **Leaf and Composite Management**
class MenuItem {
    constructor(name) {
        this.name = name;
    }
    render() {
        return this.name;
    }
}
class Menu {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    render() {
        return `Menu: [${this.items.map(item => item.render()).join(', ')}]`;
    }
}
// Usage example
const menu = new Menu();
menu.add(new MenuItem('File'));
menu.add(new MenuItem('Edit'));
console.log(menu.render()); // Menu: [File, Edit]
//# sourceMappingURL=all-usage.js.map