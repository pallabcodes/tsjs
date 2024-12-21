// ### Bridge Pattern Use Cases
//
// The **Bridge Pattern** is a structural design pattern that decouples an abstraction from its implementation, allowing the two to vary independently.
//
// Key scenarios where you would use the Bridge Pattern:
//
// 1. **Decoupling Abstraction from Implementation**: Enable separate development of abstraction and implementation classes.
// 2. **Extensibility with Minimal Code Changes**: Add new abstractions and implementations independently without altering existing code.
// 3. **Reducing Code Duplication**: Share common functionalities between abstractions while keeping their implementations separate.
// 4. **Implementing Platform Independence**: Abstract system logic from platform-specific code.
// 5. **Solving "Cartesian Product" Explosion**: Avoid combinatorial growth of subclasses when dealing with multiple dimensions of variations.
// 6. **Supporting Multiple Implementations for an Abstraction**: Enable an abstraction to work with different implementations dynamically.

// #### 1. **Decoupling Abstraction from Implementation**
interface Device {
  turnOn(): void;
  turnOff(): void;
  setVolume(level: number): void;
}

class TV implements Device {
  turnOn() {
    console.log('Turning on the TV');
  }

  turnOff() {
    console.log('Turning off the TV');
  }

  setVolume(level: number) {
    console.log(`Setting TV volume to ${level}`);
  }
}

class Radio implements Device {
  turnOn() {
    console.log('Turning on the Radio');
  }

  turnOff() {
    console.log('Turning off the Radio');
  }

  setVolume(level: number) {
    console.log(`Setting Radio volume to ${level}`);
  }
}

abstract class RemoteControl {
  constructor(protected device: Device) {}

  abstract togglePower(): void;
}

class BasicRemote extends RemoteControl {
  private isOn = false;

  togglePower() {
    if (this.isOn) {
      this.device.turnOff();
    } else {
      this.device.turnOn();
    }
    this.isOn = !this.isOn;
  }
}

// Usage
const tvRemote = new BasicRemote(new TV());
tvRemote.togglePower(); // Turning on the TV
tvRemote.togglePower(); // Turning off the TV

// #### 2. **Extensibility with Minimal Code Changes**
class AdvancedRemote extends RemoteControl {
  private isOn = false;

  togglePower() {
    if (this.isOn) {
      this.device.turnOff();
    } else {
      this.device.turnOn();
    }
    this.isOn = !this.isOn;
  }

  mute() {
    this.device.setVolume(0);
  }
}

// Usage
const radioRemote = new AdvancedRemote(new Radio());
radioRemote.togglePower(); // Turning on the Radio
radioRemote.mute(); // Setting Radio volume to 0

// #### 3. **Reducing Code Duplication**
// Instead of creating multiple classes for different remotes (e.g., TVRemote, RadioRemote),
// we create a single abstraction (RemoteControl) and inject different implementations (TV, Radio).

// #### 4. **Implementing Platform Independence**
// Suppose we extend the Device interface to support additional platforms like SmartTV or Streaming Devices.
// The abstraction (RemoteControl) remains unchanged while supporting new implementations.
class SmartTV implements Device {
  turnOn() {
    console.log('Turning on the Smart TV');
  }

  turnOff() {
    console.log('Turning off the Smart TV');
  }

  setVolume(level: number) {
    console.log(`Setting Smart TV volume to ${level}`);
  }
}

const smartTVRemote = new AdvancedRemote(new SmartTV());
smartTVRemote.togglePower(); // Turning on the Smart TV

// #### 5. **Solving "Cartesian Product" Explosion**
// Example: Instead of creating separate classes for every combination of Remotes and Devices (e.g., TVBasicRemote, TVAdvancedRemote),
// we decouple the variations using the Bridge Pattern.
// This avoids creating a large number of subclasses.

// #### 6. **Supporting Multiple Implementations for an Abstraction**
class StreamingDevice implements Device {
  turnOn() {
    console.log('Starting streaming device');
  }

  turnOff() {
    console.log('Stopping streaming device');
  }

  setVolume(level: number) {
    console.log(`Setting streaming device volume to ${level}`);
  }
}

const streamingDeviceRemote = new AdvancedRemote(new StreamingDevice());
streamingDeviceRemote.togglePower(); // Starting streaming device

// ### Additional Scenario: Dynamic Implementation Switching
class UniversalRemote extends RemoteControl {
  switchDevice(device: Device) {
    this.device = device;
  }

  togglePower() {
    this.device.turnOn();
  }
}

// Usage
const universalRemote = new UniversalRemote(new TV());
universalRemote.togglePower(); // Turning on the TV
universalRemote.switchDevice(new Radio());
universalRemote.togglePower(); // Turning on the Radio

/*
Key Takeaways:
- The abstraction (RemoteControl) is completely decoupled from the implementation (Device).
- Adding new abstractions (e.g., AdvancedRemote) or new implementations (e.g., StreamingDevice) is straightforward.
- Combinatorial explosion is avoided by separating dimensions of variation.
*/
