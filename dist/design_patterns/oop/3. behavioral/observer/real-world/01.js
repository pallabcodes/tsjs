"use strict";
// The **Observer Pattern** is one of the most common design patterns used in product-based development, particularly for scenarios where one object (the **subject**) needs to notify multiple other objects (the **observers**) about state changes, often without knowing who or what those observers are. It's commonly used for event-driven systems, UI frameworks, and real-time data updates.
// ==========================
// Concrete Observers
// ==========================
class DisplayElement {
    constructor(id) {
        this.temperature = 0;
        this.humidity = 0;
        this.pressure = 0;
        this.id = id;
    }
    update(temperature, humidity, pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        this.display();
    }
    display() {
        console.log(`${this.id} - Temperature: ${this.temperature}°C, Humidity: ${this.humidity}%, Pressure: ${this.pressure} hPa`);
    }
}
class AlertSystem {
    constructor(threshold) {
        this.threshold = threshold;
    }
    update(temperature, _humidity, _pressure) {
        if (temperature > this.threshold) {
            this.sendAlert(temperature);
        }
    }
    sendAlert(temperature) {
        console.log(`ALERT: Temperature exceeds threshold! Current: ${temperature}°C`);
    }
}
// ==========================
// Subject (Weather Station)
// ==========================
class WeatherStation {
    constructor() {
        this.observers = new Set(); // Use Set instead of Array
        this.temperature = 0;
        this.humidity = 0;
        this.pressure = 0;
    }
    addObserver(observer) {
        if (!observer)
            throw new Error('Observer cannot be null');
        this.observers.add(observer);
    }
    removeObserver(observer) {
        this.observers.delete(observer);
    }
    notifyObservers() {
        this.observers.forEach(observer => {
            observer.update(this.temperature, this.humidity, this.pressure);
        });
    }
    setWeatherData(temperature, humidity, pressure) {
        // Add input validation
        if (!Number.isFinite(temperature) ||
            !Number.isFinite(humidity) ||
            !Number.isFinite(pressure)) {
            throw new Error('Invalid weather data values');
        }
        console.log(`Weather data updated: Temperature: ${temperature}°C, Humidity: ${humidity}%, Pressure: ${pressure} hPa`);
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
//# sourceMappingURL=01.js.map