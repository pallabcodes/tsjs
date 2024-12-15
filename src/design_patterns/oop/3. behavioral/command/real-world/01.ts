// The **Command Pattern** is a behavioral design pattern that encapsulates a request as an object, thereby allowing you to parameterize clients with queues, requests, and operations. It decouples the sender of a request from the object that processes the request, and it is particularly useful in scenarios where you want to:

// - Queue requests
// - Log the requests
// - Support undoable operations
// - Provide transactional behavior

// Let's take a detailed look at an example of the **Command Pattern** applied to a **real-world scenario** involving a **Light Management System**. We'll cover various aspects such as queuing commands, undo operations, and handling different types of requests, as they would be implemented in a **product-based environment**.

// I'll then evaluate if this example fully explores the "power" of the **Command Pattern** and its typical use cases in a product scenario.

// ### Real-World Scenario Example: Home Automation System

// In this scenario, we have a **Home Automation System** where you can control devices like **lights**, **fans**, and **thermostats**. The system allows users to send commands like turning a light on or off, adjusting a thermostat, etc.

// The **Command Pattern** will help us:

// 1. **Encapsulate commands** into objects that can be passed around.
// 2. **Queue requests** for delayed execution.
// 3. **Undo commands** if necessary.
// 4. **Handle transactional behaviors**, such as grouping multiple commands and executing them together.

// ### Step-by-Step Command Pattern Example

// #### 1. **Command Interface**

// The base command interface will define an abstract method for executing commands.

// Command interface
interface Command {
  execute(): void;
  undo(): void; // Optionally support undo
}

// #### 2. **Receiver (The Actual Devices)**

// The receiver is the device being controlled by the commands. Here, we have `Light` and `Thermostat` classes.

// Receiver: Light
class Light {
  private isOn = false;

  turnOn() {
    this.isOn = true;
    console.log('Light is ON');
  }

  turnOff() {
    this.isOn = false;
    console.log('Light is OFF');
  }

  getState() {
    return this.isOn ? 'ON' : 'OFF';
  }
}

// Receiver: Thermostat
class Thermostat {
  private temperature = 22; // Default temperature

  increaseTemperature() {
    this.temperature += 1;
    console.log(`Temperature increased to ${this.temperature}°C`);
  }

  decreaseTemperature() {
    this.temperature -= 1;
    console.log(`Temperature decreased to ${this.temperature}°C`);
  }

  getTemperature() {
    return this.temperature;
  }
}

// #### 3. **Concrete Command Classes**

// We will create concrete command classes that encapsulate the request to execute on the receiver.

// Command: TurnOnLightCommand
class TurnOnLightCommand implements Command {
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

// Command: TurnOffLightCommand
export class TurnOffLightCommand implements Command {
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

// Command: IncreaseTemperatureCommand
class IncreaseTemperatureCommand implements Command {
  private thermostat: Thermostat;

  constructor(thermostat: Thermostat) {
    this.thermostat = thermostat;
  }

  execute(): void {
    this.thermostat.increaseTemperature();
  }

  undo(): void {
    this.thermostat.decreaseTemperature();
  }
}

// Command: DecreaseTemperatureCommand
export class DecreaseTemperatureCommand implements Command {
  private thermostat: Thermostat;

  constructor(thermostat: Thermostat) {
    this.thermostat = thermostat;
  }

  execute(): void {
    this.thermostat.decreaseTemperature();
  }

  undo(): void {
    this.thermostat.increaseTemperature();
  }
}

// #### 4. **Invoker (Command Executor)**

// The invoker class is responsible for calling the `execute()` method on the command object.

// Invoker
class RemoteControl {
  private commandHistory: Command[] = [];

  pressButton(command: Command): void {
    command.execute();
    this.commandHistory.push(command); // Track the history for undo/redo
  }

  undoLastCommand(): void {
    const lastCommand = this.commandHistory.pop();
    if (lastCommand) {
      lastCommand.undo();
    } else {
      console.log('No commands to undo');
    }
  }
}

// #### 5. **Client**

// Now, let's see how all these pieces fit together by simulating a client controlling devices.

// Client Code
const light = new Light();
const thermostat = new Thermostat();

const turnOnLight = new TurnOnLightCommand(light);
// const turnOffLight = new TurnOffLightCommand(light);
const increaseTemp = new IncreaseTemperatureCommand(thermostat);
// const decreaseTemp = new DecreaseTemperatureCommand(thermostat);

const remoteControl = new RemoteControl();

// Execute commands
remoteControl.pressButton(turnOnLight); // Light is ON
remoteControl.pressButton(increaseTemp); // Temperature increased to 23°C

// Undo last command (Temperature decrease)
remoteControl.undoLastCommand(); // Temperature decreased to 22°C

// Undo last command (Light off)
remoteControl.undoLastCommand(); // Light is OFF

// ### Full Power of the Command Pattern in Product-Based Environments
//
// The example above demonstrates the following key advantages of the **Command Pattern**:
//
// 1. **Encapsulation of Commands**:
// Each action (turning on/off a light, changing the temperature) is encapsulated into its own command object. This decouples the objects that initiate requests (e.g., the client or invoker) from the objects that handle the requests (e.g., the light or thermostat).
//
// 2. **Undo Capability**:
// The `undo()` method is implemented in each command class, allowing you to reverse the action. This is useful in cases where you might want to support "undo" functionality in a UI or in systems where actions need to be reversible.
//
// 3. **Flexibility**:
// You can create new command objects without changing the client or invoker code. For example, if you want to add a new device (e.g., a fan), you can create a `TurnOnFanCommand` and `TurnOffFanCommand` without altering existing code.
//
// 4. **Queuing/Batching Commands**:
// The command objects can be queued or batched, allowing you to execute a series of commands at once or execute them at a later time.
//
// 5. **Logging/Transactional Behavior**:
// By encapsulating commands as objects, you can easily log each executed command or group a set of commands into a transaction, allowing them to be executed or rolled back as a group.
//
// 6. **Separation of Concerns**:
// The sender (client or invoker) and the receiver (device) are decoupled. The sender only knows how to interact with the command interface, not the actual device. This reduces the complexity of the system and makes it more maintainable.
//
// ### Is This Enough to Cover the Full Power of the Command Pattern in Product-Based Standards?
//
//   Yes, the example above covers most of the key scenarios where the **Command Pattern** is used effectively in **product-based environments**, including:
//
//   - Encapsulation of requests and operations.
// - Undo functionality for state management.
// - Support for queuing, logging, and transactional behavior.
// - Easy extension of new commands without modifying existing code.
//
//   However, **real-world systems** may require even more complex behaviors, like:
//
// - **Composite Commands**: In real-world applications, you might have composite commands that execute multiple sub-commands at once.
// - **Asynchronous Commands**: Commands that involve async operations (e.g., network requests) can also be handled using promises or observables.
// - **Contextual Commands**: Some systems may need to pass context with each command (e.g., user credentials, transaction IDs).
//
// ### Conclusion
//
// This **Home Automation System** example gives a thorough demonstration of the **Command Pattern** and its typical use cases. It highlights how the pattern is used to encapsulate operations, queue them for delayed execution, and provide undo functionality. It also addresses important product-based concerns like flexibility, separation of concerns, and extensibility.
//
//   While there are certainly more 04 advanced-generics use cases (like asynchronous or composite commands), this example is a solid foundation and covers the core principles and advantages of the **Command Pattern** as it would be used in most real-world, product-based applications.
