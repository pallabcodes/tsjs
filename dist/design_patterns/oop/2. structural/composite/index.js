"use strict";
// Leaf class
class MyFile {
    // Renamed class
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
    getName() {
        return this.name;
    }
    getSize() {
        return this.size;
    }
    print(indent) {
        console.log(`${indent}File: "${this.getName()}" (Size: ${this.getSize()} bytes)`);
    }
}
// Composite class
class Directory {
    constructor(name) {
        this.children = [];
        this.name = name;
    }
    add(component) {
        this.children.push(component);
    }
    remove(component) {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    getName() {
        return this.name;
    }
    getSize() {
        // Sum up the sizes of all children
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }
    print(indent) {
        console.log(`${indent}Directory: "${this.getName()}"`);
        console.log(`${indent}Total Size: ${this.getSize()} bytes`);
        this.children.forEach((child, index) => {
            const childIndent = indent + (index === this.children.length - 1 ? '    ' : '│   ');
            child.print(childIndent);
        });
    }
}
// Client code
const main = () => {
    // Create files
    const file1 = new MyFile('file1.txt', 100);
    const file2 = new MyFile('file2.txt', 200);
    const file3 = new MyFile('image.png', 300);
    // Create directories
    const dir1 = new Directory('Documents');
    dir1.add(file1);
    dir1.add(file2);
    const dir2 = new Directory('Pictures');
    dir2.add(file3);
    const rootDir = new Directory('Root');
    rootDir.add(dir1);
    rootDir.add(dir2);
    // Print the file system structure
    rootDir.print('');
};
// Run the main function
main();
// Directory: "Root"
// Total Size: 600 bytes
// │   Directory: "Documents"
// │   Total Size: 300 bytes
// │   File: "file1.txt" (Size: 100 bytes)
// │   File: "file2.txt" (Size: 200 bytes)
//     Directory: "Pictures"
//     Total Size: 300 bytes
//     File: "image.png" (Size: 300 bytes)
//# sourceMappingURL=index.js.map