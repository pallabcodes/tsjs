"use strict";
class Cache {
    // Private constructor ensures no external instantiation
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        this.cache = new Map(); // Use `unknown` instead of `any`
    }
    // Method to get the single instance of the Cache
    static getInstance() {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }
    // Method to get a value by its key
    get(key) {
        const value = this.cache.get(key);
        return value; // Cast the value to the expected type
    }
    // Method to set a value in the cache
    set(key, value) {
        this.cache.set(key, value);
    }
    // Method to clear all cache entries
    clear() {
        this.cache.clear();
    }
}
// Usage example
const cache1 = Cache.getInstance();
cache1.set('user123', { name: 'John', age: 30 });
const cache2 = Cache.getInstance();
const user = cache2.get('user123');
console.log(user); // { name: "John", age: 30 }
console.log('Are both cache instances the same?', cache1 === cache2); // true
//# sourceMappingURL=04.js.map