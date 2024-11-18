/*
3. Cache Singleton

A cache is often shared across various parts of an application. Using a singleton ensures that only one cache instance exists, preventing inconsistencies and improving memory usage.
*/

// class Cache {
//     private static instance: Cache;
//     private cache: Map<string, any> = new Map();

//     private constructor() {}

//     public static getInstance(): Cache {
//         if (!Cache.instance) {
//             Cache.instance = new Cache();
//         }
//         return Cache.instance;
//     }

//     public get(key: string): any {
//         return this.cache.get(key);
//     }

//     public set(key: string, value: any): void {
//         this.cache.set(key, value);
//     }

//     public clear(): void {
//         this.cache.clear();
//     }
// }

// // Usage
// const cache1 = Cache.getInstance();
// cache1.set("user123", { name: "John", age: 30 });

// const cache2 = Cache.getInstance();
// console.log(cache2.get("user123")); // { name: "John", age: 30 }

// console.log("Are both cache instances the same?", cache1 === cache2); // true


/*
Explanation:

Cache Class: This singleton ensures there’s one cache instance shared across the application. It uses a Map to store cached data.
Methods: get(), set(), and clear() manage the cache. The singleton guarantees only one instance handles caching.

*/