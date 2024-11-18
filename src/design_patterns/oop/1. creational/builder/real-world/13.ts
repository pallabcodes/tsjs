// use: Configurable Object Builder (Used in configuration setup for complex systems)

interface ConfigurationBuilder {
    setDatabase(dbName: string): this;
    setLogging(isEnabled: boolean): this;
    setPort(port: number): this;
    build(): Configuration;
}

class Configuration {
    constructor(
        public dbName: string,
        public logging: boolean,
        public port: number
    ) {}
}

class ConfigurationBuilderImpl implements ConfigurationBuilder {
    private dbName: string = "test";
    private logging: boolean = false;
    private port: number = 3000;

    setDatabase(dbName: string): this {
        this.dbName = dbName;
        return this;
    }

    setLogging(isEnabled: boolean): this {
        this.logging = isEnabled;
        return this;
    }

    setPort(port: number): this {
        this.port = port;
        return this;
    }

    build(): Configuration {
        return new Configuration(this.dbName, this.logging, this.port);
    }
}

// Usage
const config = new ConfigurationBuilderImpl()
    .setDatabase("prod_db")
    .setLogging(true)
    .setPort(8080)
    .build();

console.log(config);
