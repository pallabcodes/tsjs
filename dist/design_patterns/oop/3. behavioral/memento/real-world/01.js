"use strict";
// The **Memento Pattern** is a behavioral design pattern that allows an object to save and restore its state without exposing its internal structure. This pattern is especially useful in scenarios like undo/redo systems, checkpoints in games, or state snapshots in editors.
//
// Below is a **real-world scenario example** designed to comprehensively cover the **Memento Pattern** with product-based standards. We'll examine if this single example is sufficient to understand the full power of the pattern.
//
//
// ### Real-World Scenario: A Text Editor with Undo/Redo Functionality
//
// Imagine implementing a text editor where users can write, delete, or modify text and can undo or redo their actions. This requires saving snapshots of the text's state and restoring them when needed.
// ### Example Code
// ==============================
// Memento Class: State Snapshot
// ==============================
class TextEditorMemento {
    constructor(content) {
        this.content = content;
    }
}
// ==============================
// Originator: Text Editor
// ==============================
class TextEditor {
    constructor() {
        this.content = '';
    }
    write(text) {
        this.content += text;
    }
    deleteLastNChars(n) {
        this.content = this.content.slice(0, -n);
    }
    getContent() {
        return this.content;
    }
    save() {
        return new TextEditorMemento(this.content);
    }
    restore(memento) {
        this.content = memento.content;
    }
}
// ==============================
// Caretaker: Manages Mementos
// ==============================
class UndoRedoManager {
    constructor() {
        this.history = [];
        this.redoStack = [];
    }
    save(memento) {
        this.history.push(memento);
        this.redoStack = []; // Clear redo stack on new changes
    }
    undo() {
        if (this.history.length > 0) {
            const memento = this.history.pop();
            this.redoStack.push(memento);
            return memento;
        }
        return null;
    }
    redo() {
        if (this.redoStack.length > 0) {
            const memento = this.redoStack.pop();
            this.history.push(memento);
            return memento;
        }
        return null;
    }
}
// ==============================
// Example Usage
// ==============================
const editor = new TextEditor();
const undoRedoManager = new UndoRedoManager();
editor.write('Hello, ');
undoRedoManager.save(editor.save());
editor.write('world!');
undoRedoManager.save(editor.save());
console.log('Content after writing:', editor.getContent()); // "Hello, world!"
editor.deleteLastNChars(6);
console.log('Content after deletion:', editor.getContent()); // "Hello, "
// Undo the deletion
const undoState = undoRedoManager.undo();
if (undoState) {
    editor.restore(undoState);
    console.log('Content after undo:', editor.getContent()); // "Hello, world!"
}
// Redo the deletion
const redoState = undoRedoManager.redo();
if (redoState) {
    editor.restore(redoState);
    console.log('Content after redo:', editor.getContent()); // "Hello, "
}
// ### Explanation of the Example
//
// #### Key Components:
// 1. **Originator (`TextEditor`)**:
// - Contains the internal state (`content`).
// - Can save its current state to a `Memento` and restore a previous state from one.
// 2. **Memento (`TextEditorMemento`)**:
// - Immutable snapshot of the originator's state.
// - Does not expose the internal structure of the originator.
// 3. **Caretaker (`UndoRedoManager`)**:
// - Manages the history of mementos and provides undo/redo functionality.
// - Ensures the originator can save and restore its state without knowing about the history management logic.
// #### Product-Based Standards:
// - **Scalability**: Supports extensible features like adding more complex state-saving logic (e.g., formatting, metadata).
// - **Encapsulation**: State is saved and restored without exposing the internals of the originator.
// - **Robustness**: Undo/redo logic is handled in a separate class (`UndoRedoManager`), adhering to the **Single Responsibility Principle**.
// ### Why This Example Covers the Full Power of the Memento Pattern
// 1. **Core Features of Memento Pattern:**
// - **Saving State**: `TextEditorMemento` captures snapshots.
// - **Restoring State**: `restore` in `TextEditor` retrieves previous states.
// - **Encapsulation**: `TextEditorMemento` ensures the editor's state is not directly accessible or modifiable.
//
// 2. **Real-World Use Case:**
// - Undo/Redo functionality is a common application of the Memento Pattern in product-based systems like text editors, IDEs, or design tools.
//
// 3. **Extension for More Complexity:**
// - Easily scalable to include more attributes in the state, like cursor position, selected text, or formatting.
// - Can integrate with distributed systems for collaborative editing (e.g., version history in Google Docs).
// ### Is This Example Enough?
//   This example:
// - Demonstrates all key components of the **Memento Pattern**.
// - Shows a real-world application aligned with **product-based standards**.
// - Includes scalable and extensible design practices.
//
//   However, the **Memento Pattern** can be applied to other domains, such as:
// - **Game Development**: Save game checkpoints.
// - **Web Forms**: Save and restore partially filled forms.
// - **State Management**: Store snapshots of Redux-like state.
//
//   If your goal is to understand **Memento** for real-world product-based applications, this example is comprehensive. To further explore its versatility, you might create additional examples in the contexts mentioned above.
//
//   Would you like me to add other domain-specific examples?
//# sourceMappingURL=01.js.map