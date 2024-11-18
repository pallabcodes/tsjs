// The Facade Pattern is used to provide a unified interface to a set of interfaces in a subsystem. This makes the subsystem easier to use by hiding its complexity from the client. It simplifies interactions with multiple subsystems by providing a single entry point.

// For a real-world example, let's build a "Home Automation System". The system will control multiple subsystems, such as lighting, HVAC (heating, ventilation, and air conditioning), and entertainment, through a single facade interface.

// Complete Example: Home Automation System
// Subsystems
// Subsystem 1: Lighting
class LightingSystem {
  turnOn(): void {
    console.log('Lights are ON');
  }
  turnOff(): void {
    console.log('Lights are OFF');
  }
  dim(level: number): void {
    console.log(`Lights dimmed to ${level}%`);
  }
}

// Subsystem 2: HVAC
class HvacSystem {
  setTemperature(temp: number): void {
    console.log(`HVAC temperature set to ${temp}°C`);
  }
  turnOn(): void {
    console.log('HVAC is ON');
  }
  turnOff(): void {
    console.log('HVAC is OFF');
  }
}

// Subsystem 3: Entertainment
class EntertainmentSystem {
  turnOn(): void {
    console.log('Entertainment system is ON');
  }
  turnOff(): void {
    console.log('Entertainment system is OFF');
  }
  setMode(mode: string): void {
    console.log(`Entertainment system set to ${mode} mode`);
  }
}

// # Facade Class
// The facade simplifies the interaction with all subsystems by providing a unified interface.

class HomeAutomationFacade {
  private lighting: LightingSystem;
  private hvac: HvacSystem;
  private entertainment: EntertainmentSystem;

  constructor() {
    this.lighting = new LightingSystem();
    this.hvac = new HvacSystem();
    this.entertainment = new EntertainmentSystem();
  }

  morningRoutine(): void {
    console.log('Starting morning routine...');
    this.lighting.turnOn();
    this.lighting.dim(75);
    this.hvac.setTemperature(22);
    this.entertainment.turnOff();
  }

  eveningRoutine(): void {
    console.log('Starting evening routine...');
    this.lighting.dim(50);
    this.hvac.setTemperature(24);
    this.entertainment.turnOn();
    this.entertainment.setMode('Movie');
  }

  nightRoutine(): void {
    console.log('Starting night routine...');
    this.lighting.turnOff();
    this.hvac.turnOff();
    this.entertainment.turnOff();
  }
}

// # Usage Example
const homeAutomation = new HomeAutomationFacade();

// Execute morning routine
homeAutomation.morningRoutine();

// Execute evening routine
homeAutomation.eveningRoutine();

// Execute night routine
homeAutomation.nightRoutine();

// # Key Features Demonstrated
// 1. Unified Interface for Complex Subsystems
// The facade simplifies the interaction with multiple subsystems (lighting, HVAC, entertainment) by combining operations into higher-level routines (e.g., morningRoutine, eveningRoutine, nightRoutine).
//
// 2. Hiding Complexity
// The client doesn’t need to know the details of how each subsystem works or coordinate them. It simply calls methods on the facade.
//
// 3. Encapsulation and Modularity
// Subsystems remain independent and can evolve independently. For example, you can upgrade the HVAC system without affecting the facade or the client.
//
// 4. Extensibility
// You can easily add new routines or integrate additional subsystems (e.g., a security system or smart curtains) without changing the existing client code.
