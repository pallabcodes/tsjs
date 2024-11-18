// 2. Configuration Manager Singleton
// In many applications, the configuration (such as API URLs, feature flags, etc.) needs to be centrally managed. A singleton ensures there is a single point of truth for configuration settings throughout the application.

class ConfigurationManager {
    private static instance: ConfigurationManager;

    private settings: { [key: string]: string } = {};

    private constructor() {
        // Load default configurations
        this.settings["API_URL"] = "https://api.example.com";
        this.settings["FEATURE_X_ENABLED"] = "true";
    }

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    public get(key: string): string {
        return this.settings[key];
    }

    public set(key: string, value: string): void {
        this.settings[key] = value;
    }
}

// Usage
const config1 = ConfigurationManager.getInstance();
console.log(config1.get("API_URL")); // https://api.example.com

const config2 = ConfigurationManager.getInstance();
config2.set("FEATURE_X_ENABLED", "false");

console.log(config1.get("FEATURE_X_ENABLED")); // false
console.log("Are both config instances the same?", config1 === config2); // true

/*
Explanation:
ConfigurationManager Class: A singleton for holding and managing configuration settings.
Methods: The get() and set() methods allow getting and updating configuration values. getInstance() ensures only one configuration manager exists across the app.
*/