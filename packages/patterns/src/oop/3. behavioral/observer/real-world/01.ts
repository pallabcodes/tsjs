// The **Observer Pattern** is one of the most common design patterns used in product-based development, particularly for scenarios where one object (the **subject**) needs to notify multiple other objects (the **observers**) about state changes, often without knowing who or what those observers are. It's commonly used for event-driven systems, UI frameworks, and real-time data updates.

// ### Real-World Example: Observer Pattern for a Weather Station

// Let's dive into a **full, real-world example** using the **Observer Pattern**. We'll focus on a **Weather Station System** where multiple **Observers** are listening for changes in the weather, such as temperature, humidity, and pressure.
//
// This example will cover the following key scenarios, which are essential to understand the **Observer Pattern**:
//
// - **Multiple Observers**: Observers can be dynamically added and removed.
// - **State Change Notification**: The subject notifies all observers when its state changes.
// - **Loose Coupling**: The subject (weather station) doesn't know who its observers are; it just sends out notifications.
// - **Real-Time Updates**: Observers receive updates in real-time when the weather data changes.
// - **Dynamic Interaction**: New observers can be added, and existing ones can be removed as needed.

// ### Full Example: Weather Station Observer Pattern

// ==========================
// Observer Interface
// ==========================
interface Observer {
  update(temperature: number, humidity: number, pressure: number): void;
}

// Add interface for the subject
interface Subject {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(): void;
}

// ==========================
// Concrete Observers
// ==========================
class DisplayElement implements Observer {
  private id: string;
  private temperature = 0;
  private humidity = 0;
  private pressure = 0;

  constructor(id: string) {
    this.id = id;
  }

  update(temperature: number, humidity: number, pressure: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.display();
  }

  display(): void {
    console.log(
      `${this.id} - Temperature: ${this.temperature}°C, Humidity: ${this.humidity}%, Pressure: ${this.pressure} hPa`
    );
  }
}

class AlertSystem implements Observer {
  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  update(temperature: number, _humidity: number, _pressure: number): void {
    if (temperature > this.threshold) {
      this.sendAlert(temperature);
    }
  }

  private sendAlert(temperature: number): void {
    console.log(
      `ALERT: Temperature exceeds threshold! Current: ${temperature}°C`
    );
  }
}

// ==========================
// Subject (Weather Station)
// ==========================
class WeatherStation implements Subject {
  private observers: Set<Observer> = new Set(); // Use Set instead of Array
  private temperature = 0;
  private humidity = 0;
  private pressure = 0;

  addObserver(observer: Observer): void {
    if (!observer) throw new Error('Observer cannot be null');
    this.observers.add(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers.delete(observer);
  }

  notifyObservers(): void {
    this.observers.forEach(observer => {
      observer.update(this.temperature, this.humidity, this.pressure);
    });
  }

  setWeatherData(
    temperature: number,
    humidity: number,
    pressure: number
  ): void {
    // Add input validation
    if (
      !Number.isFinite(temperature) ||
      !Number.isFinite(humidity) ||
      !Number.isFinite(pressure)
    ) {
      throw new Error('Invalid weather data values');
    }

    console.log(
      `Weather data updated: Temperature: ${temperature}°C, Humidity: ${humidity}%, Pressure: ${pressure} hPa`
    );

    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.notifyObservers();
  }
}

// ==========================
// Usage Example
// ==========================
const weatherStation = new WeatherStation();

// Create observers
const display1 = new DisplayElement('Display 1');
const display2 = new DisplayElement('Display 2');
const alertSystem = new AlertSystem(30); // Alert if temperature exceeds 30°C

// Add observers to the weather station
weatherStation.addObserver(display1);
weatherStation.addObserver(display2);
weatherStation.addObserver(alertSystem);

// Simulate weather data updates
weatherStation.setWeatherData(25, 65, 1013); // Normal update
weatherStation.setWeatherData(32, 70, 1010); // High temperature, alert should trigger

// Remove an observer and update again
weatherStation.removeObserver(display1);
weatherStation.setWeatherData(28, 60, 1012); // Only display2 and alertSystem should receive updates

// ### Key Concepts Covered by This Example:
//
//   1. **Multiple Observers**:
// - **Multiple Observers** (like `DisplayElement` and `AlertSystem`) can be registered to listen to state changes from the **subject** (`WeatherStation`).
// - Observers can be dynamically **added** and **removed** using `addObserver()` and `removeObserver()`.
//
// 2. **State Change Notification**:
// - When the weather data is updated via `setWeatherData()`, the **subject** (`WeatherStation`) notifies all the registered **observers** of the state change by calling `notifyObservers()`.
// - Observers (like `DisplayElement` and `AlertSystem`) are notified with the new temperature, humidity, and pressure values.
//
// 3. **Loose Coupling**:
// - The **subject** (`WeatherStation`) doesn't know the specifics of each observer. It just calls `update()` on all observers. This maintains a **loose coupling** between the subject and observers.
// - Observers can be added or removed without modifying the core logic of the weather station.
//
// 4. **Real-Time Updates**:
// - Observers receive real-time updates whenever the weather data changes. This is useful for applications like UI updates, event triggers, or alerts.
// - For example, the `AlertSystem` can trigger alerts in real-time if the temperature exceeds a certain threshold.
//
// 5. **Dynamic Interaction**:
// - New observers can be added (like `DisplayElement` or `AlertSystem`) dynamically, and old observers can be removed at any time. This allows flexibility in how the system reacts to state changes.
//
// ### Is This Enough to Cover All Aspects of the Observer Pattern in Product-Based Standards?
//
//   This example covers most of the core aspects of the **Observer Pattern** in real-world scenarios, especially for product-based development. Here’s why:
//
//   1. **Real-Time Updates**: This example clearly shows how observers react to changes in the **subject** (the weather data) in real-time.
//
// 2. **Loose Coupling**: The subject doesn’t need to know about the specific types of observers—it just calls `update()` when the state changes. This is a key part of the Observer Pattern, especially in large product-based systems where decoupling components is crucial for maintainability.
//
//   3. **Multiple Observers**: The example supports adding multiple observers (e.g., UI elements, alert systems), which is typical in product systems like dashboards, notification systems, or monitoring tools.
//
// 4. **Dynamic Behavior**: Observers can be dynamically added or removed. This is helpful for systems that need flexibility, such as monitoring tools, event-driven applications, or systems that have varying levels of notification.
//
// 5. **Alerting and UI Updates**: The example simulates an **alert system** (sending alerts when a threshold is crossed) and **UI updates** (displaying the weather data). These are two common use cases for the Observer Pattern.
//
// 6. **Real-World Product System Behavior**: In real-world product systems, the Observer Pattern is often used for event-driven architectures, like:
// - Updating UIs when data changes (e.g., dashboards showing live data updates).
// - Event-driven communication between components (e.g., notifying various modules when a critical state changes).
// - Systems requiring real-time monitoring, logging, or alerting mechanisms.
//
// ### Further Extensions for Real-World Scenarios:
//   To fully leverage the **Observer Pattern** in complex product-based systems, here are additional considerations:
//   - **Asynchronous Updates**: In large-scale systems, observers might need to be notified asynchronously (e.g., using event queues or message brokers like Kafka, RabbitMQ).
// - **Performance Optimization**: When managing many observers, the `notifyObservers` method could become a performance bottleneck. This might require optimizations, like batched notifications or event throttling.
// - **Observer Priority**: Some observers might need to be notified before others (e.g., high-priority alert systems versus low-priority display updates). You could introduce **observer priority** in such cases.
// - **Stateful Observers**: In some systems, observers may need to keep track of previous states for comparison or aggregation. This can be handled within the observer logic.
//
// ### Conclusion:
//   This **Weather Station Example** should be sufficient to demonstrate the **full power** of the **Observer Pattern** in product-based scenarios. It covers key aspects like real-time updates, loose coupling, dynamic observer management, and a clear separation between the subject and observers. However, in highly complex systems, you'll encounter additional concerns like asynchronous updates, observer priorities, or scalability, which can be handled with some enhancements to the basic pattern.
