// ### Memento Pattern Use Cases
//
// The **Memento Pattern** is a behavioral design pattern that allows saving and restoring the previous state of an object without exposing its internal structure.
// It is useful when you need to implement undo/redo functionality or store an object's state at different points in time.
//
// Key scenarios where you would use the Memento pattern:
//
// 1. **Undo/Redo Mechanisms**: Capture and restore the state of an object to allow reversing actions.
// 2. **Saving the State of Objects**: Save the current state of an object for later restoration.
// 3. **State Management**: Keep track of an object's history for debugging or versioning purposes.
// 4. **Object Persistence**: Allow objects to persist their state and restore it when needed.
//
// #### 1. **Undo/Redo Mechanisms**
class Memento {
  constructor(private state: string) {}

  getState(): string {
    return this.state;
  }
}

class Editor {
  private content = '';

  setContent(content: string) {
    this.content = content;
  }

  getContent() {
    return this.content;
  }

  save(): Memento {
    return new Memento(this.content);
  }

  restore(memento: Memento) {
    this.content = memento.getState();
  }
}

// Usage example
const editor = new Editor();
editor.setContent('Hello, world!');
const savedState = editor.save();

editor.setContent('New content');
console.log(editor.getContent()); // New content

editor.restore(savedState);
console.log(editor.getContent()); // Hello, world!

// #### 2. **Saving the State of Objects**
class GameState {
  constructor(private level: number, private score: number) {}

  getState() {
    return { level: this.level, score: this.score };
  }

  setState(level: number, score: number) {
    this.level = level;
    this.score = score;
  }
}

class Game {
  private stateHistory: Memento[] = [];

  saveState(state: GameState) {
    this.stateHistory.push(new Memento(JSON.stringify(state.getState())));
  }

  restoreState(): GameState {
    const memento = this.stateHistory.pop();
    if (!memento) throw new Error('No state to restore');
    const state = JSON.parse(memento.getState());
    return new GameState(state.level, state.score);
  }
}

// Usage example
const game = new Game();
const gameState = new GameState(1, 100);

game.saveState(gameState);
gameState.setState(2, 200); // New state
console.log(gameState.getState()); // { level: 2, score: 200 }

const restoredState = game.restoreState();
console.log(restoredState.getState()); // { level: 1, score: 100 }

// #### 3. **State Management**
class Document {
  private text = '';

  write(text: string) {
    this.text = text;
  }

  getText() {
    return this.text;
  }

  createMemento(): Memento {
    return new Memento(this.text);
  }

  restoreMemento(memento: Memento) {
    this.text = memento.getState();
  }
}

// Usage example
const doc = new Document();
doc.write('Draft version 1');
const memento1 = doc.createMemento();

doc.write('Draft version 2');
console.log(doc.getText()); // Draft version 2

doc.restoreMemento(memento1);
console.log(doc.getText()); // Draft version 1

// #### 4. **Object Persistence**
class UserProfile {
  constructor(private username: string, private email: string) {}

  getState() {
    return { username: this.username, email: this.email };
  }

  setState(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}

class UserProfileManager {
  private history: Memento[] = [];

  saveProfile(profile: UserProfile) {
    this.history.push(new Memento(JSON.stringify(profile.getState())));
  }

  restoreProfile(): UserProfile {
    const memento = this.history.pop();
    if (!memento) throw new Error('No profile state to restore');
    const state = JSON.parse(memento.getState());
    return new UserProfile(state.username, state.email);
  }
}

// Usage example
const profileManager = new UserProfileManager();
const userProfile = new UserProfile('john_doe', 'john@example.com');

profileManager.saveProfile(userProfile);
userProfile.setState('jane_doe', 'jane@example.com');
console.log(userProfile.getState()); // { username: 'jane_doe', email: 'jane@example.com' }

const restoredProfile = profileManager.restoreProfile();
console.log(restoredProfile.getState()); // { username: 'john_doe', email: 'john@example.com' }
