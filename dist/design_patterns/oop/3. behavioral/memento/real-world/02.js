"use strict";
// Here are **solid examples** of the **Memento Pattern** applied to various domains. Each example adheres to **real-world product-based standards** and **AAA game development practices**.
//
//
// ### Example 1: **Game Development - Save Game Checkpoints**
//
// #### Scenario:
//   In a AAA game, the player can save checkpoints. Each checkpoint includes the player’s position, health, inventory, and mission progress. The player can load a previous checkpoint to resume the game.
//
// #### Code:
// ==============================
// Memento Class: Game State Snapshot
// ==============================
class GameState {
    constructor(playerPosition, health, inventory, missionProgress) {
        this.playerPosition = playerPosition;
        this.health = health;
        this.inventory = inventory;
        this.missionProgress = missionProgress;
    }
}
// ==============================
// Originator: Game
// ==============================
class Game {
    constructor() {
        this.playerPosition = { x: 0, y: 0 };
        this.health = 100;
        this.inventory = [];
        this.missionProgress = 'Not Started';
    }
    setState(position, health, inventory, mission) {
        this.playerPosition = { ...position };
        this.health = health;
        this.inventory = [...inventory];
        this.missionProgress = mission;
    }
    getState() {
        return new GameState(this.playerPosition, this.health, this.inventory, this.missionProgress);
    }
    restoreState(state) {
        this.playerPosition = state.playerPosition;
        this.health = state.health;
        this.inventory = [...state.inventory];
        this.missionProgress = state.missionProgress;
    }
    displayState() {
        console.log('Game State:', {
            position: this.playerPosition,
            health: this.health,
            inventory: this.inventory,
            mission: this.missionProgress,
        });
    }
}
// ==============================
// Caretaker: Checkpoint Manager
// ==============================
class CheckpointManager {
    constructor() {
        this.checkpoints = [];
    }
    save(state) {
        this.checkpoints.push(state);
    }
    load(index) {
        if (index < 0 || index >= this.checkpoints.length) {
            throw new Error('Invalid checkpoint index');
        }
        return this.checkpoints[index];
    }
}
// ==============================
// Example Usage
// ==============================
const game = new Game();
const checkpointManager = new CheckpointManager();
// Simulate gameplay and save checkpoints
game.setState({ x: 10, y: 20 }, 90, ['Sword', 'Shield'], 'Started Mission');
checkpointManager.save(game.getState());
game.setState({ x: 50, y: 80 }, 70, ['Sword', 'Potion'], 'Mid Mission');
checkpointManager.save(game.getState());
game.displayState(); // Shows the latest state
// Restore to a previous checkpoint
const previousGameState = checkpointManager.load(0);
if (previousGameState) {
    game.restoreState(previousGameState);
    game.displayState(); // Restores to the first checkpoint
}
// ### Example 2: **Web Forms - Save and Restore Partially Filled Forms**
//
// #### Scenario:
//   A web form allows users to save drafts and resume filling later. The Memento Pattern stores the form’s state (input values, selection choices, etc.).
//
// #### Code:
// ==============================
// Memento Class: Form State Snapshot
// ==============================
class FormState {
    constructor(values) {
        this.values = values;
    }
}
// ==============================
// Originator: Web Form
// ==============================
class WebForm {
    constructor() {
        this.values = {};
    }
    setValue(key, value) {
        this.values[key] = value;
    }
    getState() {
        return new FormState({ ...this.values });
    }
    restoreState(state) {
        this.values = { ...state.values };
    }
    displayState() {
        console.log('Form State:', this.values);
    }
}
// ==============================
// Caretaker: Form Draft Manager
// ==============================
class FormDraftManager {
    constructor() {
        this.drafts = [];
    }
    save(state) {
        this.drafts.push(state);
    }
    load(index) {
        return this.drafts[index] || null;
    }
}
// ==============================
// Example Usage
// ==============================
const form = new WebForm();
const draftManager = new FormDraftManager();
// Fill the form and save drafts
form.setValue('name', 'John Doe');
form.setValue('email', 'john@example.com');
draftManager.save(form.getState());
form.setValue('address', '123 Main St');
draftManager.save(form.getState());
form.displayState(); // Shows the latest form state
// Restore to a previous draft
const previousFormDraft = draftManager.load(0);
if (previousFormDraft) {
    form.restoreState(previousFormDraft);
    form.displayState(); // Restores to the first draft
}
// ### Example 3: **State Management - Redux-like Snapshots**
//
// #### Scenario:
//   A Redux-like application needs to save state snapshots for debugging or time travel features.
//
// #### Code:
// ==============================
// Memento Class: Redux State Snapshot
// ==============================
class ReduxState {
    constructor(state) {
        this.state = state;
    }
}
// ==============================
// Originator: Redux Store
// ==============================
class ReduxStore {
    constructor() {
        this.state = {};
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
    }
    getState() {
        return new ReduxState({ ...this.state });
    }
    restoreState(state) {
        this.state = { ...state.state };
    }
    displayState() {
        console.log('Redux State:', this.state);
    }
}
// ==============================
// Caretaker: State History Manager
// ==============================
class StateHistoryManager {
    constructor() {
        this.history = [];
    }
    save(state) {
        this.history.push(state);
    }
    load(index) {
        if (index < 0 || index >= this.history.length) {
            throw new Error('Invalid history index');
        }
        return this.history[index];
    }
}
// ==============================
// Example Usage
// ==============================
const store = new ReduxStore();
const historyManager = new StateHistoryManager();
// Update the store and save states
store.setState({ user: 'Alice', theme: 'dark' });
historyManager.save(store.getState());
store.setState({ user: 'Bob' });
historyManager.save(store.getState());
store.displayState(); // Shows the latest state
// Restore to a previous state
const previousReduxState = historyManager.load(0);
if (previousReduxState) {
    store.restoreState(previousReduxState);
    store.displayState(); // Restores to the first state
}
// ### Do These Examples Cover the Full Power of the Memento Pattern?
//
//   1. **Core Components**: All examples include **Originator**, **Memento**, and **Caretaker**, the foundational components of the Memento Pattern.
// 2. **Real-World Use Cases**:
// - Game Development: Checkpoints with multiple interdependent properties.
// - Web Forms: Draft saving for resuming user input.
// - Redux-like State Management: Time travel debugging.
// 3. **Extensibility**:
// - All examples demonstrate scalability and adherence to product-based standards.
// - Additional attributes can be easily added without breaking the pattern.
//
// ### Conclusion:
//
//   These examples effectively demonstrate the **full power of the Memento Pattern** across diverse, real-world domains and meet the expectations for **product-based or AAA standards**. If you need further expansion into specific industry scenarios, feel free to ask!
//# sourceMappingURL=02.js.map