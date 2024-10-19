// Component interface
interface FileSystemComponent {
    getName(): string;
    getSize(): number; // Returns the size of the component
    print(indent: string): void; // Print the component with indentation
}

// Leaf class
class MyFile implements FileSystemComponent {  // Renamed class
    constructor(private name: string, private size: number) {}

    public getName(): string {
        return this.name;
    }

    public getSize(): number {
        return this.size;
    }

    public print(indent: string): void {
        console.log(`${indent}File: "${this.getName()}" (Size: ${this.getSize()} bytes)`);
    }
}

// Composite class
class Directory implements FileSystemComponent {
    private children: FileSystemComponent[] = [];
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public add(component: FileSystemComponent): void {
        this.children.push(component);
    }

    public remove(component: FileSystemComponent): void {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    public getName(): string {
        return this.name;
    }

    public getSize(): number {
        // Sum up the sizes of all children
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }

    public print(indent: string): void {
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
