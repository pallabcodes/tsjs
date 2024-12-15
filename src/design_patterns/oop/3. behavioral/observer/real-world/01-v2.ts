// To extend the Observer Pattern example further and ensure it covers additional considerations that might come up in real-world product-based systems, here's an updated version that incorporates several 04 advanced-generics features like asynchronous notifications, observer priorities, and scalability considerations.
//
// ### Full Example with Advanced Features:

// ==========================
// Observer Interface
// ==========================
interface Observer {
  update(data: WeatherData): void;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
}

// ==========================
// Concrete Observers
// ==========================
class DisplayElement implements Observer {
  private id: string;
  private data?: WeatherData;

  constructor(id: string) {
    this.id = id;
  }

  update(data: WeatherData): void {
    this.data = data;
    this.display();
  }

  display(): void {
    if (!this.data) return;
    console.log(
      `${this.id} - Temperature: ${this.data.temperature}°C, Humidity: ${this.data.humidity}%, Pressure: ${this.data.pressure} hPa`
    );
  }
}

class AlertSystem implements Observer {
  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  update(data: WeatherData): void {
    if (data.temperature > this.threshold) {
      this.sendAlert(data.temperature);
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
class WeatherStation {
  private observers: Observer[] = [];
  private data: WeatherData = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
  };

  // Observer priority - observers with higher priority will be notified first
  private observerPriorities: Map<Observer, number> = new Map();

  addObserver(observer: Observer, priority = 0): void {
    this.observers.push(observer);
    this.observerPriorities.set(observer, priority);
    this.sortObservers();
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
    this.observerPriorities.delete(observer);
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.data);
    }
  }

  // Simulate weather data update with async updates
  async setWeatherData(
    temperature: number,
    humidity: number,
    pressure: number
  ): Promise<void> {
    this.data = { temperature, humidity, pressure };
    console.log(
      `Weather data updated: Temperature: ${temperature}°C, Humidity: ${humidity}%, Pressure: ${pressure} hPa`
    );

    await this.asyncNotifyObservers();
  }

  private async asyncNotifyObservers(): Promise<void> {
    const notificationPromises = this.observers.map(async observer => {
      await new Promise(resolve => setTimeout(resolve, 100));
      observer.update(this.data);
    });

    await Promise.all(notificationPromises);
  }

  // Sort observers by priority
  private sortObservers(): void {
    this.observers.sort((a, b) => {
      const priorityA = this.observerPriorities.get(a) || 0;
      const priorityB = this.observerPriorities.get(b) || 0;
      return priorityB - priorityA; // Higher priority first
    });
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

// Add observers to the weather station with different priorities
weatherStation.addObserver(display1, 2); // Higher priority
weatherStation.addObserver(display2, 1); // Lower priority
weatherStation.addObserver(alertSystem, 0); // Alert system with lowest priority

// Simulate weather data updates
weatherStation.setWeatherData(25, 65, 1013); // Normal update
weatherStation.setWeatherData(32, 70, 1010); // High temperature, alert should trigger

// Remove an observer and update again
weatherStation.removeObserver(display1);
weatherStation.setWeatherData(28, 60, 1012); // Only display2 and alertSystem should receive updates

// ### Key Features and Further Extensions Covered:
//   1. **Asynchronous Updates**:
// - The `asyncNotifyObservers` method simulates an asynchronous notification mechanism. This can represent real-world scenarios where observer updates require asynchronous operations (e.g., database queries, network calls, or background tasks).
// - This can be particularly useful in **real-time systems** where updates are not instantaneous, or when handling large numbers of observers.
//
// 2. **Observer Prioritization**:
// - The example introduces **priority-based notifications** by maintaining a map (`observerPriorities`) of each observer’s priority. This allows observers with higher priorities (e.g., critical alerts) to be notified before others.
// - In large systems, some observers may need to react faster or more urgently than others, and this prioritization ensures that those observers are notified first.
//
// 3. **Efficient Sorting of Observers**:
// - The observers are **sorted by priority** before notification to ensure that high-priority observers are notified first. This is done by using the `sortObservers()` method.
//
// 4. **Dynamic Observer Management**:
// - Observers can still be **added and removed dynamically**, but with the added ability to manage priorities for each observer. This helps to better manage critical systems and control the flow of notifications in a complex system.
//
// 5. **Scalability Considerations**:
// - In a real-world product, where there could be a large number of observers, the **asynchronous notification** feature helps scale the system.
// - The system can handle high-frequency state changes, like weather updates, without blocking the main execution flow. In larger applications, this can be adapted to use message queues, event loops, or publish-subscribe systems for better performance.
//
// ### How This Covers Real-World Product-Based Scenarios:
//   This extension of the **Observer Pattern** takes into account several additional challenges that arise in complex, high-performance, product-based systems:
//
//   - **Asynchronous Operations**: Many product-based systems need asynchronous communication, such as handling data fetches, network calls, or time-consuming computations.
//
// - **Real-Time Data Updates**: The pattern simulates real-time data propagation, which is essential for systems like dashboards, notifications, or monitoring tools.
//
// - **Observer Priorities**: In cases like alert systems, some events need to be processed before others (e.g., high-priority alerts should come before display updates). This ensures that critical systems are not blocked or delayed.
//
// - **Scalability and Efficiency**: By simulating asynchronous behavior and efficiently managing observer priority, the system can scale better, especially in large-scale applications.
//
// ### Conclusion:
//   This **enhanced Observer Pattern** example covers a wide range of real-world scenarios that a product-based system might encounter. It adds support for **asynchronous updates**, **observer prioritization**, and **scalability**, all while maintaining the core principles of the Observer Pattern. This version should be suitable for complex systems that need to handle multiple observers, varying priorities, and real-time notifications efficiently.
