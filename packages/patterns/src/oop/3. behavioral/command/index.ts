// Index interface
interface Index {
  execute(): void;
}

// Concrete command for turning on the light
class LightOnCommand implements Index {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }
}

// Receiver class
class Light {
  turnOn(): void {
    console.log('Light is ON');
  }

  turnOff(): void {
    console.log('Light is OFF');
  }
}

// Invoker class
class RemoteControl {
  private command!: Index;

  setCommand(command: Index) {
    this.command = command;
  }

  pressButton(): void {
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
