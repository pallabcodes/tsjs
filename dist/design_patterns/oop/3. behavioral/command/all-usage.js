"use strict";
// ### Command Pattern Use Cases
class LightOnCommand {
    constructor(light) {
        this.light = light;
    }
    execute() {
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
    setCommand(command) {
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
class LightOnCommandWithUndo {
    constructor(light) {
        this.light = light;
    }
    execute() {
        this.light.turnOn();
    }
    undo() {
        this.light.turnOff();
    }
}
class LightOffCommandWithUndo {
    constructor(light) {
        this.light = light;
    }
    execute() {
        this.light.turnOff();
    }
    undo() {
        this.light.turnOn();
    }
}
class UndoButton {
    constructor() {
        this.commandHistory = [];
    }
    pressCommand(command) {
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
class FileCommand {
    constructor(file) {
        this.file = file;
    }
    execute() {
        console.log(`Opening file: ${this.file}`);
    }
}
class CommandQueue {
    constructor() {
        this.queue = [];
    }
    addCommand(command) {
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
class MacroCommand {
    constructor(commands) {
        this.commands = commands;
    }
    execute() {
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
    constructor() {
        this.commands = [];
    }
    executeCommand(command) {
        command.execute();
        this.commands.push(command);
    }
    getExecutedCommands() {
        return this.commands;
    }
}
// Usage example
const commandManager = new CommandManager();
commandManager.executeCommand(new LightOnCommand(light)); // Light is ON
commandManager.executeCommand(new LightOffCommandWithUndo(light)); // Light is OFF
console.log(commandManager.getExecutedCommands());
//# sourceMappingURL=all-usage.js.map