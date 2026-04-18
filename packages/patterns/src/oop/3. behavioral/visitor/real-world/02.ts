// Here’s a real-world example of the **Visitor Pattern** applied to file system operations. This example demonstrates multiple visitors to:
//
// 1. Calculate the total size of files.
// 2. List directory contents.
// 3. Check file or directory permissions.

// ### File System Operations with the Visitor Pattern
//
// #### 1. **Visitable Interface and Elements**
interface Visitable {
  accept(visitor: Visitor): void;
}

class File implements Visitable {
  constructor(
    public readonly name: string,
    public readonly size: number, // in KB
    public readonly permissions: string // e.g., "read-only", "read-write"
  ) {}

  accept(visitor: Visitor): void {
    visitor.visitFile(this);
  }
}

class Directory implements Visitable {
  constructor(
    public readonly name: string,
    public readonly children: Visitable[] = [], // Can contain files or subdirectories
    public readonly permissions: string
  ) {}

  accept(visitor: Visitor): void {
    visitor.visitDirectory(this);
  }
}

// #### 2. **Visitor Interface and Concrete Visitors**
interface Visitor {
  visitFile(file: File): void;
  visitDirectory(directory: Directory): void;
}

// Concrete Visitor: Calculate Total Size
class SizeCalculatorVisitor implements Visitor {
  private totalSize = 0;

  visitFile(file: File): void {
    this.totalSize += file.size;
  }

  visitDirectory(directory: Directory): void {
    directory.children.forEach(child => child.accept(this));
  }

  getTotalSize(): number {
    return this.totalSize; // Return size in KB
  }
}

// Concrete Visitor: List Directory Contents
class DirectoryListerVisitor implements Visitor {
  private listing: string[] = [];

  visitFile(file: File): void {
    this.listing.push(`File: ${file.name}`);
  }

  visitDirectory(directory: Directory): void {
    this.listing.push(`Directory: ${directory.name}`);
    directory.children.forEach(child => child.accept(this));
  }

  getListing(): string[] {
    return this.listing;
  }
}

// Concrete Visitor: Permission Checker
class PermissionCheckerVisitor implements Visitor {
  private issues: string[] = [];

  visitFile(file: File): void {
    if (file.permissions !== 'read-write') {
      this.issues.push(
        `File "${file.name}" has insufficient permissions: ${file.permissions}`
      );
    }
  }

  visitDirectory(directory: Directory): void {
    if (directory.permissions !== 'read-write') {
      this.issues.push(
        `Directory "${directory.name}" has insufficient permissions: ${directory.permissions}`
      );
    }
    directory.children.forEach(child => child.accept(this));
  }

  getIssues(): string[] {
    return this.issues;
  }
}

// #### 3. **Client Code**
// The client interacts with the file system objects and applies different visitors.

// Creating the file system structure
const root = new Directory(
  'root',
  [
    new File('file1.txt', 120, 'read-write'),
    new File('file2.txt', 200, 'read-only'),
    new Directory(
      'subdir1',
      [
        new File('file3.txt', 80, 'read-write'),
        new Directory(
          'subdir2',
          [new File('file4.txt', 300, 'read-only')],
          'read-only'
        ),
      ],
      'read-write'
    ),
  ],
  'read-write'
);

// 1. Calculate total size
const sizeCalculator = new SizeCalculatorVisitor();
root.accept(sizeCalculator);
console.log(`Total size: ${sizeCalculator.getTotalSize()} KB`);

// 2. List directory contents
const lister = new DirectoryListerVisitor();
root.accept(lister);
console.log('Directory Listing:');
console.log(lister.getListing().join('\n'));

// 3. Check permissions
const permissionChecker = new PermissionCheckerVisitor();
root.accept(permissionChecker);
console.log('Permission Issues:');
console.log(permissionChecker.getIssues().join('\n'));

// ### Output
// Total size: 700 KB
// Directory Listing:
// Directory: root
// File: file1.txt
// File: file2.txt
// Directory: subdir1
// File: file3.txt
// Directory: subdir2
// File: file4.txt
// Permission Issues:
// File "file2.txt" has insufficient permissions: read-only
// File "file4.txt" has insufficient permissions: read-only
// Directory "subdir2" has insufficient permissions: read-only

// ### Explanation of Real-World Features:
//
//   1. **Complex Object Structures**:
// - The file system contains both files and directories, with directories potentially containing nested files or subdirectories.
// - `Visitable` ensures that operations can be performed uniformly across different elements.
//
// 2. **Multiple Visitors**:
// - `SizeCalculatorVisitor` accumulates the sizes of files and directories.
// - `DirectoryListerVisitor` lists the entire structure, including nested files and directories.
// - `PermissionCheckerVisitor` validates permissions and identifies issues.
//
// 3. **Extensibility**:
// - You can easily add new visitors, such as a **BackupVisitor** to create backups of files or a **SearchVisitor** to find files by name, without modifying the `File` or `Directory` classes.
//
// 4. **Fluent Interface and Open/Closed Principle**:
// - The pattern is extensible for new operations without altering the core file system classes.
//
// ---
//
//   This example provides a **real-world, production-grade use case** of the **Visitor Pattern**. It demonstrates its full power in managing complex, hierarchical object structures in a scalable and extensible way.
