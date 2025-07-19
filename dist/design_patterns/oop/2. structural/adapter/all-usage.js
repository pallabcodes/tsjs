"use strict";
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
    processPayment(amount, cardNumber) {
        return `Processed payment of ${amount} with card ${cardNumber}`;
    }
}
// Adapter for Legacy System
class LegacyPaymentAdapter {
    constructor(legacyProcessor) {
        this.legacyProcessor = legacyProcessor;
    }
    process(amount) {
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
    fetchXmlData() {
        return '<user><name>John</name><age>30</age></user>';
    }
}
// Adapter for XML to JSON
class XmlToJsonAdapter {
    constructor(xmlLibrary) {
        this.xmlLibrary = xmlLibrary;
    }
    // Convert XML to JSON
    get name() {
        const xml = this.xmlLibrary.fetchXmlData();
        return xml.match(/<name>(.*?)<\/name>/)?.[1] ?? '';
    }
    get age() {
        const xml = this.xmlLibrary.fetchXmlData();
        return parseInt(xml.match(/<age>(.*?)<\/age>/)?.[1] ?? '0');
    }
}
// Usage
const xmlLibrary = new XmlLibrary();
const adapter = new XmlToJsonAdapter(xmlLibrary);
console.log(adapter.name); // Output: John
console.log(adapter.age); // Output: 30
// #### 3. **Data Conversion**
// - **Scenario**: A database returns data in a format that your application doesn't support. You need to adapt it to match your data models.
// - **Adapter Use**: Convert the raw database result into the expected model format.
// Raw Database Data (e.g., from a query)
class RawDbData {
    constructor() {
        this.userId = '123';
        this.userAge = '30';
        this.userName = 'John';
    }
}
// Adapter for converting RawDbData to User
class UserAdapter {
    constructor(rawDbData) {
        this.rawDbData = rawDbData;
    }
    get id() {
        return this.rawDbData.userId;
    }
    get name() {
        return this.rawDbData.userName;
    }
    get age() {
        return parseInt(this.rawDbData.userAge);
    }
}
// Usage
const rawDbData = new RawDbData();
const userAdapter = new UserAdapter(rawDbData);
console.log(userAdapter.id); // Output: 123
console.log(userAdapter.name); // Output: John
console.log(userAdapter.age); // Output: 30
// #### 4. **Cross-Platform Compatibility**
// - **Scenario**: Your application needs to communicate with multiple services (one using a REST API and another using GraphQL). You want to provide a unified interface.
// - **Adapter Use**: Write adapters for each service so that they can both be accessed through a common interface.
// REST API Service
class RestApiService {
    fetchData() {
        return 'Data from REST API';
    }
}
// GraphQL API Service
class GraphqlApiService {
    fetchQuery() {
        return 'Data from GraphQL API';
    }
}
// Adapter for REST API
class RestApiAdapter {
    constructor(restApi) {
        this.restApi = restApi;
    }
    fetchData() {
        return this.restApi.fetchData();
    }
}
// Adapter for GraphQL API
class GraphqlApiAdapter {
    constructor(graphqlApi) {
        this.graphqlApi = graphqlApi;
    }
    fetchData() {
        return this.graphqlApi.fetchQuery();
    }
}
// Usage
const restApi = new RestApiService();
const graphqlApi = new GraphqlApiService();
const restAdapter = new RestApiAdapter(restApi);
const graphqlAdapter = new GraphqlApiAdapter(graphqlApi);
console.log(restAdapter.fetchData()); // Output: Data from REST API
console.log(graphqlAdapter.fetchData()); // Output: Data from GraphQL API
// #### 5. **External Service Adaptation**
// - **Scenario**: Your system needs to communicate with an external weather service, but the external service's API format doesn't match your internal system's expectations.
// - **Adapter Use**: Adapt the external weather service's data into your expected internal format.
// External Weather Service
class ExternalWeatherService {
    fetchWeather() {
        return '{"temperature": "22", "humidity": "75"}'; // JSON from external service
    }
}
// Adapter to convert external weather service data to internal format
class WeatherAdapter {
    constructor(externalWeatherService) {
        this.externalWeatherService = externalWeatherService;
    }
    get temperature() {
        const weatherJson = JSON.parse(this.externalWeatherService.fetchWeather());
        return parseInt(weatherJson.temperature);
    }
    get humidity() {
        const weatherJson = JSON.parse(this.externalWeatherService.fetchWeather());
        return parseInt(weatherJson.humidity);
    }
}
// Usage
const externalService = new ExternalWeatherService();
const weatherAdapter = new WeatherAdapter(externalService);
console.log(`Temperature: ${weatherAdapter.temperature}°C`); // Output: Temperature: 22°C
console.log(`Humidity: ${weatherAdapter.humidity}%`); // Output: Humidity: 75%
// ### Conclusion:
// The **Adapter Pattern** is highly flexible and can be used in various real-world product scenarios, such as:
// 1. **Integrating with legacy systems** (payment processors).
// 2. **Third-party library integration** (XML to JSON conversion).
// 3. **Data conversion** (a database results to expected models).
// 4. **Cross-platform compatibility** (REST/GraphQL APIs).
// 5. **External service adaptation** (weather service data format adjustment).
//
// By wrapping incompatible interfaces with an adapter, the existing system can interact with external or legacy systems without breaking the codebase or requiring major changes.
//# sourceMappingURL=all-usage.js.map