"use strict";
class FileResource {
    constructor() {
        this.open = false;
    }
    openFile() { this.open = true; console.log('File opened'); }
    closeFile() { this.open = false; console.log('File closed'); }
    doWork() { if (!this.open)
        throw new Error('File not open'); console.log('Working...'); }
    // Simulate destructor
    dispose() {
        if (this.open)
            this.closeFile();
    }
}
// Usage
const myFileResource = new FileResource();
myFileResource.openFile();
myFileResource.doWork();
myFileResource.dispose(); // Clean up
//# sourceMappingURL=resource-cleanup.js.map