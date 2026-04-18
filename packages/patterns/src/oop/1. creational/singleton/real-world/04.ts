class Cache {
  private static instance: Cache;
  private cache: Map<string, unknown> = new Map(); // Use `unknown` instead of `any`

  // Private constructor ensures no external instantiation
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  // Method to get the single instance of the Cache
  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  // Method to get a value by its key
  public get<T>(key: string): T | undefined {
    const value = this.cache.get(key);
    return value as T | undefined; // Cast the value to the expected type
  }

  // Method to set a value in the cache
  public set(key: string, value: unknown): void {
    this.cache.set(key, value);
  }

  // Method to clear all cache entries
  public clear(): void {
    this.cache.clear();
  }
}

// Usage example
const cache1 = Cache.getInstance();
cache1.set('user123', { name: 'John', age: 30 });

const cache2 = Cache.getInstance();
const user = cache2.get<{ name: string; age: number }>('user123');
console.log(user); // { name: "John", age: 30 }

console.log('Are both cache instances the same?', cache1 === cache2); // true
