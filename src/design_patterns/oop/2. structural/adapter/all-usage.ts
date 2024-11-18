// The **Adapter Pattern** is used to allow incompatible interfaces to work together. It provides a way to wrap one interface with another, making it compatible without modifying the existing codebase. The Adapter pattern is typically used in the following scenarios:

// ### Common Use Cases for the Adapter Pattern:

// 1. **Integrating with legacy systems** - When you need to interact with legacy systems that don’t conform to the current interface.
// 2. **Third-party library integration** - If you need to integrate a third-party library or service, but the library’s interface doesn’t match your requirements.
// 3. **Data conversion** - When converting one data structure or format to another (e.g., converting JSON data to a format your system understands).
// 4. **Cross-platform compatibility** - When working with systems that have different APIs, and you need a unified interface to interact with them.
// 5. **Different object structures** - When you have objects that have similar functionality but different structures, and you need to adapt them to use the same interface.
// 6. **External service adaptation** - When interacting with external services or APIs that have an incompatible structure with your system’s architecture.
//
//
// ### Adapter Pattern Examples from Real-World Product-Based Scenarios
//
// #### 1. **Integrating with Legacy Systems**
// - **Scenario**: You have a modern application that communicates with a legacy payment processing system with an outdated API.
// - **Adapter Use**: Wrap the legacy system’s API in an adapter that exposes a modern interface.

// Legacy Payment Processor (Old API)
class LegacyPaymentProcessor {
  public processPayment(amount: number, cardNumber: string): string {
    return `Processed payment of ${amount} with card ${cardNumber}`;
  }
}

// Modern Payment System (New Interface)
interface PaymentProcessor {
  process(amount: number): string;
}

// Adapter for Legacy System
class LegacyPaymentAdapter implements PaymentProcessor {
  private legacyProcessor: LegacyPaymentProcessor;

  constructor(legacyProcessor: LegacyPaymentProcessor) {
    this.legacyProcessor = legacyProcessor;
  }

  public process(amount: number): string {
    // Wrap legacy API to conform to new interface
    return this.legacyProcessor.processPayment(amount, '1234-5678-9876-5432');
  }
}

// Usage
const legacyProcessor = new LegacyPaymentProcessor();
const paymentAdapter = new LegacyPaymentAdapter(legacyProcessor);
console.log(paymentAdapter.process(100)); // Output: Processed payment of 100 with card 1234-5678-9876-5432

// #### 2. **Third-Party Library Integration**
// - **Scenario**: A third-party library provides data in XML format, but your application expects JSON.
// - **Adapter Use**: Write an adapter to convert the XML data into a JSON object.
// Third-Party Library: XML Data
class XmlLibrary {
  public fetchXmlData(): string {
    return '<user><name>John</name><age>30</age></user>';
  }
}

// Your application's expected interface: JSON Data
interface JsonData {
  name: string;
  age: number;
}

// Adapter for XML to JSON
class XmlToJsonAdapter implements JsonData {
  private xmlLibrary: XmlLibrary;

  constructor(xmlLibrary: XmlLibrary) {
    this.xmlLibrary = xmlLibrary;
  }

  // Convert XML to JSON
  public get name(): string {
    const xml = this.xmlLibrary.fetchXmlData();
    return xml.match(/<name>(.*?)<\/name>/)?.[1] ?? '';
  }

  public get age(): number {
    const xml = this.xmlLibrary.fetchXmlData();
    return parseInt(xml.match(/<age>(.*?)<\/age>/)?.[1] ?? '0');
  }
}

// Usage
const xmlLibrary = new XmlLibrary();
const adapter = new XmlToJsonAdapter(xmlLibrary);
console.log(adapter.name); // Output: John
console.log(adapter.age);  // Output: 30

// #### 3. **Data Conversion**
// - **Scenario**: A database returns data in a format that your application doesn't support. You need to adapt it to match your data models.
// - **Adapter Use**: Convert the raw database result into the expected model format.
// Raw Database Data (e.g., from a query)
class RawDbData {
  public userId: string = '123';
  public userAge: string = '30';
  public userName: string = 'John';
}

// Application's expected data format
interface User {
  id: string;
  name: string;
  age: number;
}

// Adapter for converting RawDbData to User
class UserAdapter implements User {
  private rawDbData: RawDbData;

  constructor(rawDbData: RawDbData) {
    this.rawDbData = rawDbData;
  }

  public get id(): string {
    return this.rawDbData.userId;
  }

  public get name(): string {
    return this.rawDbData.userName;
  }

  public get age(): number {
    return parseInt(this.rawDbData.userAge);
  }
}

// Usage
const rawDbData = new RawDbData();
const userAdapter = new UserAdapter(rawDbData);
console.log(userAdapter.id);   // Output: 123
console.log(userAdapter.name); // Output: John
console.log(userAdapter.age);  // Output: 30

// #### 4. **Cross-Platform Compatibility**
// - **Scenario**: Your application needs to communicate with multiple services (one using a REST API and another using GraphQL). You want to provide a unified interface.
// - **Adapter Use**: Write adapters for each service so that they can both be accessed through a common interface.
// REST API Service
class RestApiService {
  public fetchData(): string {
    return 'Data from REST API';
  }
}

// GraphQL API Service
class GraphqlApiService {
  public fetchQuery(): string {
    return 'Data from GraphQL API';
  }
}

// Unified interface
interface ApiService {
  fetchData(): string;
}

// Adapter for REST API
class RestApiAdapter implements ApiService {
  private restApi: RestApiService;

  constructor(restApi: RestApiService) {
    this.restApi = restApi;
  }

  public fetchData(): string {
    return this.restApi.fetchData();
  }
}

// Adapter for GraphQL API
class GraphqlApiAdapter implements ApiService {
  private graphqlApi: GraphqlApiService;

  constructor(graphqlApi: GraphqlApiService) {
    this.graphqlApi = graphqlApi;
  }

  public fetchData(): string {
    return this.graphqlApi.fetchQuery();
  }
}

// Usage
const restApi = new RestApiService();
const graphqlApi = new GraphqlApiService();

const restAdapter = new RestApiAdapter(restApi);
const graphqlAdapter = new GraphqlApiAdapter(graphqlApi);

console.log(restAdapter.fetchData());   // Output: Data from REST API
console.log(graphqlAdapter.fetchData()); // Output: Data from GraphQL API

// #### 5. **External Service Adaptation**
// - **Scenario**: Your system needs to communicate with an external weather service, but the external service's API format doesn't match your internal system's expectations.
// - **Adapter Use**: Adapt the external weather service's data into your expected internal format.
// External Weather Service
class ExternalWeatherService {
  public fetchWeather(): string {
    return '{"temperature": "22", "humidity": "75"}'; // JSON from external service
  }
}

// Internal System expects a different format
interface WeatherData {
  temperature: number;
  humidity: number;
}

// Adapter to convert external weather service data to internal format
class WeatherAdapter implements WeatherData {
  private externalWeatherService: ExternalWeatherService;

  constructor(externalWeatherService: ExternalWeatherService) {
    this.externalWeatherService = externalWeatherService;
  }

  public get temperature(): number {
    const weatherJson = JSON.parse(this.externalWeatherService.fetchWeather());
    return parseInt(weatherJson.temperature);
  }

  public get humidity(): number {
    const weatherJson = JSON.parse(this.externalWeatherService.fetchWeather());
    return parseInt(weatherJson.humidity);
  }
}

// Usage
const externalService = new ExternalWeatherService();
const weatherAdapter = new WeatherAdapter(externalService);

console.log(`Temperature: ${weatherAdapter.temperature}°C`); // Output: Temperature: 22°C
console.log(`Humidity: ${weatherAdapter.humidity}%`);       // Output: Humidity: 75%


// ### Conclusion:
// The **Adapter Pattern** is highly flexible and can be used in various real-world product scenarios, such as:
// 1. **Integrating with legacy systems** (payment processors).
// 2. **Third-party library integration** (XML to JSON conversion).
// 3. **Data conversion** (a database results to expected models).
// 4. **Cross-platform compatibility** (REST/GraphQL APIs).
// 5. **External service adaptation** (weather service data format adjustment).
//
// By wrapping incompatible interfaces with an adapter, the existing system can interact with external or legacy systems without breaking the codebase or requiring major changes.