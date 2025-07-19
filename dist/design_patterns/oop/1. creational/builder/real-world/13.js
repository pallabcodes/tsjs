"use strict";
// use: Configurable Object Builder (Used in configuration setup for complex systems)
class Configuration {
    constructor(dbName, logging, port) {
        this.dbName = dbName;
        this.logging = logging;
        this.port = port;
    }
}
class ConfigurationBuilderImpl {
    constructor() {
        this.dbName = 'test';
        this.logging = false;
        this.port = 3000;
    }
    setDatabase(dbName) {
        this.dbName = dbName;
        return this;
    }
    setLogging(isEnabled) {
        this.logging = isEnabled;
        return this;
    }
    setPort(port) {
        this.port = port;
        return this;
    }
    build() {
        return new Configuration(this.dbName, this.logging, this.port);
    }
}
// Usage
const config = new ConfigurationBuilderImpl()
    .setDatabase('prod_db')
    .setLogging(true)
    .setPort(8080)
    .build();
console.log(config);
//# sourceMappingURL=13.js.map