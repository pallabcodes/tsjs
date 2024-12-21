// ### Command Pattern Use Cases

// The **Command Pattern** is a behavioral design pattern that converts requests or simple operations into objects. These command objects can then be stored, passed, and executed later.

// It decouples the sender from the object that executes the command, allowing for more flexibility and control over operations.
// Key scenarios where you would use the Command pattern:

// 1. **Request Decoupling**: Decouple the sender of a request from the object that processes it, allowing for flexibility in handling requests.
// 2. **Undo/Redo Functionality**: Enable undo/redo functionality by keeping a history of command objects and executing their inverse.
// 3. **Queue Requests**: Queue requests for later execution, potentially to be executed in a batch or asynchronously.
// 4. **Composite Commands**: Combine multiple commands into one composite command to execute as a single operation.
// 5. **Centralized Control**: Manage a set of related operations through a central command manager or invoker.

// #### 1. **Request Decoupling**
interface Command {
  execute(): void;
}

class LightOnCommand implements Command {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.turnOn();
  }
}

class Light {
  turnOn() {
    console.log('Light is ON');
  }

  turnOff() {
    console.log('Light is OFF');
  }
}

class RemoteControl {
  private command!: Command;

  setCommand(command: Command) {
    this.command = command;
  }

  pressButton() {
    this.command.execute();
  }
}

// Usage example
const light = new Light();
const lightOn = new LightOnCommand(light);

const remote = new RemoteControl();
remote.setCommand(lightOn);
remote.pressButton(); // Light is ON

// #### 2. **Undo/Redo Functionality**
interface UndoableCommand extends Command {
  undo(): void;
}

class LightOnCommandWithUndo implements UndoableCommand {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

class LightOffCommandWithUndo implements UndoableCommand {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
  }
}

class UndoButton {
  private commandHistory: UndoableCommand[] = [];

  pressCommand(command: UndoableCommand) {
    command.execute();
    this.commandHistory.push(command);
  }

  undo() {
    const lastCommand = this.commandHistory.pop();
    if (lastCommand) {
      lastCommand.undo();
    }
  }
}

// Usage example
const light2 = new Light();
const lightOnCmd = new LightOnCommandWithUndo(light2);
const lightOffCmd = new LightOffCommandWithUndo(light2);

const undoButton = new UndoButton();
undoButton.pressCommand(lightOnCmd); // Light is ON
undoButton.pressCommand(lightOffCmd); // Light is OFF
undoButton.undo(); // Light is ON

// #### 3. **Queue Requests**
class FileCommand implements Command {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  execute(): void {
    console.log(`Opening file: ${this.file}`);
  }
}

class CommandQueue {
  private queue: Command[] = [];

  addCommand(command: Command) {
    this.queue.push(command);
  }

  executeCommands() {
    while (this.queue.length > 0) {
      const command = this.queue.shift();
      command?.execute();
    }
  }
}

// Usage example
const queue = new CommandQueue();
queue.addCommand(new FileCommand('file1.txt'));
queue.addCommand(new FileCommand('file2.txt'));
queue.executeCommands();
// Opening file: file1.txt
// Opening file: file2.txt

// #### 4. **Composite Commands**
class MacroCommand implements Command {
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  execute(): void {
    this.commands.forEach(command => command.execute());
  }
}

// Usage example
const light3 = new Light();
const lightOnCmd2 = new LightOnCommand(light3);
const lightOffCmd2 = new LightOffCommandWithUndo(light3);

const macroCommand = new MacroCommand([lightOnCmd2, lightOffCmd2]);
macroCommand.execute();
// Light is ON
// Light is OFF

// #### 5. **Centralized Control**
class CommandManager {
  private commands: Command[] = [];

  executeCommand(command: Command) {
    command.execute();
    this.commands.push(command);
  }

  getExecutedCommands(): Command[] {
    return this.commands;
  }
}

// Usage example
const commandManager = new CommandManager();
commandManager.executeCommand(new LightOnCommand(light)); // Light is ON
commandManager.executeCommand(new LightOffCommandWithUndo(light)); // Light is OFF
console.log(commandManager.getExecutedCommands());
