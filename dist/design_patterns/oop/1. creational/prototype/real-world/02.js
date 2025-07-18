"use strict";
// Certainly! Let's walk through a **real-world scenario in configuration management**, where the **Prototype Pattern** is applied to clone and modify system settings for different environments, such as **development**, **testing**, and **production**.
// This interface will ensure that all configuration objects can be cloned and provide a method to return their settings.
// ### Step 2: Define Concrete Config Prototypes for Each Environment
// We’ll define a base configuration object, and then extend it for specific environments like **Development**, **Testing**, and **Production**.
// ==========================
// Concrete Config Prototypes
// ==========================
class SystemConfig {
    constructor(databaseUrl, apiKey, logLevel, featureFlags) {
        this.databaseUrl = databaseUrl;
        this.apiKey = apiKey;
        this.logLevel = logLevel;
        this.featureFlags = featureFlags;
    }
    // Clone method for creating new instances based on the prototype
    clone() {
        return new SystemConfig(this.databaseUrl, this.apiKey, this.logLevel, [
            ...this.featureFlags,
        ]);
    }
    getSettings() {
        return `Database URL: ${this.databaseUrl}, API Key: ${this.apiKey}, Log Level: ${this.logLevel}, Feature Flags: ${this.featureFlags.join(', ')}`;
    }
}
// The **`SystemConfig`** class represents the base configuration for the system. The `clone` method allows us to create a new instance of the configuration with the same values. We also use the spread operator (`[...]`) to ensure that the **featureFlags** array is copied (not just referenced).
// ### Step 3: Configuration Manager to Handle Environment-Specific Clones
// We’ll use a **Configuration Manager** that can register the base configuration prototype and clone it for each environment.
// ==========================
// Configuration Manager
// ==========================
class ConfigManager {
    constructor(prototype) {
        this.prototype = prototype;
    }
    // Method to clone configuration for a specific environment and modify it
    getConfigForEnvironment(env) {
        const clonedConfig = this.prototype.clone(); // it gets a new memory address as it instantiates SystemConfig
        // Modify or overwrite the clonedConfig based on the env
        if (env === 'development') {
            clonedConfig.databaseUrl = 'localhost:5432/dev';
            clonedConfig.apiKey = 'dev-api-key';
            clonedConfig.logLevel = 'debug';
            clonedConfig.featureFlags = ['feature1', 'feature2'];
        }
        else if (env === 'testing') {
            clonedConfig.databaseUrl = 'localhost:5432/test';
            clonedConfig.apiKey = 'test-api-key';
            clonedConfig.logLevel = 'info';
            clonedConfig.featureFlags = ['feature1'];
        }
        else if (env === 'production') {
            clonedConfig.databaseUrl = 'prod-db.example.com';
            clonedConfig.apiKey = 'prod-api-key';
            clonedConfig.logLevel = 'error';
            clonedConfig.featureFlags = ['feature1', 'feature3'];
        }
        return clonedConfig;
    }
}
// In this example:
// - The **ConfigManager** stores a reference to the base configuration prototype.
// - The `getConfigForEnvironment` method clones the base configuration and adjusts it according to the environment (development, testing, or production).
// - The adjustments are **environment-specific**, ensuring that each environment has its own unique configuration.
// ### Step 4: Usage Example
// ==========================
// Usage Example
// ==========================
const baseConfig = new SystemConfig('localhost:5432', 'default-api-key', 'debug', []);
const configManager = new ConfigManager(baseConfig);
// Cloning and customizing configurations for different environments
const devConfig = configManager.getConfigForEnvironment('development');
const testConfig = configManager.getConfigForEnvironment('testing');
const prodConfig = configManager.getConfigForEnvironment('production');
// Displaying the settings for each environment
console.log('Development Config:', devConfig.getSettings());
console.log('Testing Config:', testConfig.getSettings());
console.log('Production Config:', prodConfig.getSettings());
// ### Expected Output:
// ```txt
// Development Config: Database URL: localhost:5432/dev, API Key: dev-api-key, Log Level: debug, Feature Flags: feature1, feature2
// Testing Config: Database URL: localhost:5432/test, API Key: test-api-key, Log Level: info, Feature Flags: feature1
// Production Config: Database URL: prod-db.example.com, API Key: prod-api-key, Log Level: error, Feature Flags: feature1, feature3
// ```
// ---
// ### Real-World Applicability:
// 1. **Configuration Management Across Multiple Environments:**
//    - The core idea of cloning configurations based on a prototype allows for easily adapting the system settings to multiple environments without needing to manually define each setting. For instance, development and production environments often need different database URLs, API keys, and logging levels.
// 2. **Avoiding Repetitive Code:**
//    - The **Prototype Pattern** prevents the need to manually create different configurations for each environment from scratch. Instead, you simply clone the base configuration and modify the necessary fields, reducing redundancy and errors.
// 3. **Customizing Clones for Specific Contexts:**
//    - For each environment, you clone the configuration and tweak only the relevant properties, making this pattern highly flexible. This is critical when you have numerous settings and need to ensure they are applied correctly across different environments.
// 4. **Scalability:**
//    - As your system grows and more environments or configurations are added, this approach scales easily. You only need to register the base prototype and add new logic in the `ConfigManager` to customize the clone for the new environment.
// ---
// ### Conclusion: Does This Example Cover Real-World Product Standards?
// Yes, this example provides a **solid application** of the **Prototype Pattern** in **configuration management** for **multiple environments**. This pattern is highly applicable in real-world product development scenarios where:
// - **System configurations** are needed across various environments.
// - Configuration values need to be **cloned and adjusted** based on the environment (e.g., `dev`, `test`, `prod`).
// - There is a need for **efficiency** in creating and maintaining configurations by cloning and modifying prototypes rather than recreating configuration objects from scratch.
// This approach is widely used in **enterprise-level applications**, **cloud deployments**, and **microservices architectures** where configurations vary across environments but share common structure.
//# sourceMappingURL=02.js.map