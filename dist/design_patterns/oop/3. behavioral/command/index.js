"use strict";
// Concrete command for turning on the light
class LightOnCommand {
    constructor(light) {
        this.light = light;
    }
    execute() {
        this.light.turnOn();
    }
}
// Receiver class
class Light {
    turnOn() {
        console.log('Light is ON');
    }
    turnOff() {
        console.log('Light is OFF');
    }
}
// Invoker class
class RemoteControl {
    setCommand(command) {
        this.command = command;
    }
    pressButton() {
        this.command.execute();
    }
}
// Usage
const light = new Light();
const lightOn = new LightOnCommand(light);
const remote = new RemoteControl();
remote.setCommand(lightOn);
remote.pressButton(); // Output: Light is ON
// When to use:
// Use this pattern when you want to parameterize objects with operations, delay the execution of an operation, or implement undo/redo functionality.
//# sourceMappingURL=index.js.map