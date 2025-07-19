"use strict";
// While the example I provided is solid and covers various aspects of the **Factory Pattern** in the context of a configuration-driven system (like creating different components for database connections, API clients, and loggers), there are still areas where this example could be expanded to better represent the full range of **real-world scenarios** and **product-based standards** in a more complex system.
// ==========================
// Concrete Products (Database Connections, API Clients, and Loggers)
// ==========================
class MySQLConnection {
    connect() {
        console.log('Connected to MySQL');
    }
    close() {
        console.log('Closed MySQL connection');
    }
}
class PostgreSQLConnection {
    connect() {
        console.log('Connected to PostgreSQL');
    }
    close() {
        console.log('Closed PostgreSQL connection');
    }
}
class RESTAPIClient {
    makeRequest(endpoint) {
        console.log(`REST request to ${endpoint}`);
    }
}
class GraphQLAPIClient {
    makeRequest(endpoint) {
        console.log(`GraphQL request to ${endpoint}`);
    }
}
class ConsoleLogger {
    log(message) {
        console.log(`Console log: ${message}`);
    }
}
class FileLogger {
    log(message) {
        console.log(`File log: ${message}`);
    }
}
// ==========================
// Concrete Factory for Cloud Environment
// ==========================
class CloudSystemFactory {
    createDatabaseConnection() {
        return new PostgreSQLConnection(); // Cloud defaults to PostgreSQL
    }
    createAPIClient() {
        return new GraphQLAPIClient(); // Cloud defaults to GraphQL
    }
    createLogger() {
        return new FileLogger(); // Log to file in cloud environments
    }
}
// ==========================
// Concrete Factory for On-Premise Environment
// ==========================
class OnPremiseSystemFactory {
    createDatabaseConnection() {
        return new MySQLConnection(); // On-premise defaults to MySQL
    }
    createAPIClient() {
        return new RESTAPIClient(); // On-premise uses REST API
    }
    createLogger() {
        return new ConsoleLogger(); // Log to console in on-premise environments
    }
}
// ==========================
// Factory for Specific Use Case (e.g., External Service Integration)
// ==========================
class ExternalServiceIntegrationFactory {
    constructor(integrationType) {
        this.integrationType = integrationType;
    }
    createDatabaseConnection() {
        throw new Error("External integration doesn't require direct database connection.");
    }
    createAPIClient() {
        if (this.integrationType === 'PaymentGateway') {
            return new RESTAPIClient(); // Payment Gateway uses REST API
        }
        else if (this.integrationType === 'CRM') {
            return new GraphQLAPIClient(); // CRM integration uses GraphQL
        }
        throw new Error('Unsupported external service');
    }
    createLogger() {
        return new FileLogger(); // Log external service events to a file
    }
}
// ==========================
// Client Code to Demonstrate Usage
// ==========================
function configureSystem(factory) {
    const dbConnection = factory.createDatabaseConnection();
    const apiClient = factory.createAPIClient();
    const logger = factory.createLogger();
    dbConnection.connect();
    apiClient.makeRequest('/getData');
    logger.log('System configured successfully.');
}
// ==========================
// Example Usage
// ==========================
console.log('Configuring Cloud System:');
const cloudFactory = new CloudSystemFactory();
configureSystem(cloudFactory);
console.log('\nConfiguring On-Premise System:');
const onPremFactory = new OnPremiseSystemFactory();
configureSystem(onPremFactory);
console.log('\nConfiguring External Service (Payment Gateway):');
const paymentGatewayFactory = new ExternalServiceIntegrationFactory('PaymentGateway');
configureSystem(paymentGatewayFactory);
console.log('\nConfiguring External Service (CRM):');
const crmFactory = new ExternalServiceIntegrationFactory('CRM');
configureSystem(crmFactory);
// ### Key Enhancements in This Example
// 1. **Dynamic Configuration for Different Environments (Cloud vs. On-Premise):**
//    - Factories dynamically create different components based on the environment (Cloud vs. On-Premise). This is useful in real-world product-based systems where environments change (e.g., different services for cloud and on-premise configurations).
// 2. **Product-Specific Third-Party Integrations:**
//    - We’ve added the `ExternalServiceIntegrationFactory`, which creates different components based on the integration type (e.g., Payment Gateway vs. CRM). This demonstrates how the factory can be used for specialized product use cases, such as integrating with external services.
// 3. **Resource Pooling or Reuse (optional for databases, API clients):**
//    - In a more complex product-based scenario, factories could manage resource pooling or reusing existing connections, especially for things like database connections or network clients.
// 4. **Error Handling and Logging:**
//    - Each factory can throw meaningful errors if an unsupported configuration is detected, and log any issues that arise during the creation of components (e.g., unsupported external service integration type).
// ### Conclusion
// This extended example now reflects more **real-world complexity** that would be found in a **product-based environment**, addressing things like dynamic configurations, third-party integrations, error handling, and environment-specific object creation. While it's still relatively simple compared to the complexity of some enterprise-level systems, this example covers many core aspects of **Factory Pattern** usage in product development.
// So yes, this can serve as a **solid template** for learning and applying the **Factory Pattern** to a wide variety of scenarios you might encounter in the real world, especially in product-based systems where configurations, integrations, and environment-specific logic are key.
//# sourceMappingURL=01.js.map