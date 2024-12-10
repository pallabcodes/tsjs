// 2. Configuration Manager Singleton
// In many applications, the configuration (such as API URLs, feature flags, etc.) needs to be centrally managed. A singleton ensures there is a single point of truth for configuration settings throughout the application.

class ConfigurationManager {
  private static instance: ConfigurationManager | null = null;
  private static initializationPromise: Promise<ConfigurationManager> | null =
    null;

  private settings: { [key: string]: string } = {};

  private constructor() {
    // Initialize with default settings
    this.settings['API_URL'] = 'https://api.example.com';
    this.settings['FEATURE_X_ENABLED'] = 'true';
  }

  public static async getInstance(): Promise<ConfigurationManager> {
    if (ConfigurationManager.instance) {
      return ConfigurationManager.instance;
    }

    // Initialize the singleton instance asynchronously
    if (!ConfigurationManager.initializationPromise) {
      ConfigurationManager.initializationPromise = (async () => {
        const instance = new ConfigurationManager();
        try {
          await instance.loadConfigurations(); // Simulating async configuration loading
          return instance;
        } catch (error) {
          console.error('Error initializing ConfigurationManager:', error);
          throw new Error('ConfigurationManager initialization failed.');
        }
      })();
    }

    // Wait for the initialization process to finish and assign the instance
    ConfigurationManager.instance =
      await ConfigurationManager.initializationPromise;
    return ConfigurationManager.instance;
  }

  private async loadConfigurations(): Promise<void> {
    // Simulate async loading of configurations (e.g., from a file or external service)
    await new Promise((resolve, _reject) => {
      setTimeout(() => {
        console.log('Configuration loading complete.');
        // Example of loading additional configurations
        this.settings['FEATURE_Y_ENABLED'] = 'true';
        resolve(null);
      }, 1000);
    });
  }

  public get(key: string): string {
    return this.settings[key] ?? '';
  }

  public set(key: string, value: string): void {
    this.settings[key] = value;
  }
}

// Usage example
(async () => {
  const config1 = await ConfigurationManager.getInstance();
  console.log(config1.get('API_URL')); // https://api.example.com

  const config2 = await ConfigurationManager.getInstance();
  config2.set('FEATURE_X_ENABLED', 'false');

  console.log(config1.get('FEATURE_X_ENABLED')); // false
  console.log('Are both config instances the same?', config1 === config2); // true
})();

/*
Explanation:
ConfigurationManager Class: A singleton for holding and managing configuration settings.
Methods: The get() and set() methods allow getting and updating configuration values. getInstance() ensures only one configuration manager exists across the app.
*/
