// @ts-nocheck

// While the example I provided is solid and covers various aspects of the **Factory Pattern** in the context of a configuration-driven system (like creating different components for database connections, API clients, and loggers), there are still areas where this example could be expanded to better represent the full range of **real-world scenarios** and **product-based standards** in a more complex system.

// ### Additional Considerations for Factory Pattern in Real-World Product-Based Scenarios

// In a product-based scenario, particularly in large-scale systems, the **Factory Pattern** might be extended to account for:

// 1. **Abstracting Dependencies and Frameworks:**
//    - Often, products involve third-party frameworks or services (e.g., AWS SDKs, external payment providers, etc.). Factories can abstract the creation of these dependencies, ensuring the system is decoupled from specific third-party implementations.
   
// 2. **Dynamic Configuration Changes:**
//    - The configuration used by the factory might change over time or be dependent on the runtime environment (e.g., cloud vs. on-prem, staging vs. production). Factories need to handle such changes dynamically.

// 3. **Complex Conditional Logic in Object Creation:**
//    - In some product scenarios, objects are created based on several conditions (e.g., different API versions, user roles, feature flags). A factory pattern should handle such scenarios gracefully and allow for flexible creation of objects based on multiple conditions.

// 4. **Pooling and Resource Management:**
//    - For resource-heavy components like database connections, caching systems, or API clients, factories may handle object pooling to optimize resource usage.

// 5. **Factory Method Variation for Scalability:**
//    - You might need different factories for different types of components (e.g., one factory for managing database connections, another for managing external integrations). 

// 6. **Error Handling and Logging:**
//    - Factories often need to log creation errors, throw exceptions when invalid configurations are provided, or handle retries for resource creation.

// To reflect these product-level concerns, we can extend the example with additional complexity.

// ---

// ### Extended Real-World Factory Pattern Example

// Here’s an updated version of the Factory Pattern, incorporating more advanced scenarios, such as:

// 1. **Dynamic Configuration for Different Environments**
// 2. **Product-Specific Third-Party Integrations**
// 3. **Resource Pooling**
// 4. **Error Handling and Logging**

// ==========================
// Abstract Product Interfaces
// ==========================
interface DatabaseConnection {
    connect(): void;
    close(): void;
}

interface APIClient {
    makeRequest(endpoint: string): void;
}

interface Logger {
    log(message: string): void;
}

// ==========================
// Concrete Products (Database Connections, API Clients, and Loggers)
// ==========================
class MySQLConnection implements DatabaseConnection {
    connect() { console.log("Connected to MySQL"); }
    close() { console.log("Closed MySQL connection"); }
}

class PostgreSQLConnection implements DatabaseConnection {
    connect() { console.log("Connected to PostgreSQL"); }
    close() { console.log("Closed PostgreSQL connection"); }
}

class RESTAPIClient implements APIClient {
    makeRequest(endpoint: string) { console.log(`REST request to ${endpoint}`); }
}

class GraphQLAPIClient implements APIClient {
    makeRequest(endpoint: string) { console.log(`GraphQL request to ${endpoint}`); }
}

class ConsoleLogger implements Logger {
    log(message: string) { console.log(`Console log: ${message}`); }
}

class FileLogger implements Logger {
    log(message: string) { console.log(`File log: ${message}`); }
}

// ==========================
// Abstract Factory Interface
// ==========================
interface SystemComponentFactory {
    createDatabaseConnection(): DatabaseConnection;
    createAPIClient(): APIClient;
    createLogger(): Logger;
}

// ==========================
// Concrete Factory for Cloud Environment
// ==========================
class CloudSystemFactory implements SystemComponentFactory {
    createDatabaseConnection(): DatabaseConnection {
        return new PostgreSQLConnection(); // Cloud defaults to PostgreSQL
    }

    createAPIClient(): APIClient {
        return new GraphQLAPIClient(); // Cloud defaults to GraphQL
    }

    createLogger(): Logger {
        return new FileLogger(); // Log to file in cloud environments
    }
}

// ==========================
// Concrete Factory for On-Premise Environment
// ==========================
class OnPremiseSystemFactory implements SystemComponentFactory {
    createDatabaseConnection(): DatabaseConnection {
        return new MySQLConnection(); // On-premise defaults to MySQL
    }

    createAPIClient(): APIClient {
        return new RESTAPIClient(); // On-premise uses REST API
    }

    createLogger(): Logger {
        return new ConsoleLogger(); // Log to console in on-premise environments
    }
}

// ==========================
// Factory for Specific Use Case (e.g., External Service Integration)
// ==========================
class ExternalServiceIntegrationFactory implements SystemComponentFactory {
    private integrationType: string;

    constructor(integrationType: string) {
        this.integrationType = integrationType;
    }

    createDatabaseConnection(): DatabaseConnection {
        throw new Error("External integration doesn't require direct database connection.");
    }

    createAPIClient(): APIClient {
        if (this.integrationType === 'PaymentGateway') {
            return new RESTAPIClient(); // Payment Gateway uses REST API
        } else if (this.integrationType === 'CRM') {
            return new GraphQLAPIClient(); // CRM integration uses GraphQL
        }
        throw new Error("Unsupported external service");
    }

    createLogger(): Logger {
        return new FileLogger(); // Log external service events to a file
    }
}

// ==========================
// Client Code to Demonstrate Usage
// ==========================
function configureSystem(factory: SystemComponentFactory) {
    const dbConnection = factory.createDatabaseConnection();
    const apiClient = factory.createAPIClient();
    const logger = factory.createLogger();

    dbConnection.connect();
    apiClient.makeRequest("/getData");
    logger.log("System configured successfully.");
}

// ==========================
// Example Usage
// ==========================
console.log("Configuring Cloud System:");
const cloudFactory = new CloudSystemFactory();
configureSystem(cloudFactory);

console.log("\nConfiguring On-Premise System:");
const onPremFactory = new OnPremiseSystemFactory();
configureSystem(onPremFactory);

console.log("\nConfiguring External Service (Payment Gateway):");
const paymentGatewayFactory = new ExternalServiceIntegrationFactory("PaymentGateway");
configureSystem(paymentGatewayFactory);

console.log("\nConfiguring External Service (CRM):");
const crmFactory = new ExternalServiceIntegrationFactory("CRM");
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