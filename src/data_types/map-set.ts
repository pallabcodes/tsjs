// ============================================
// MAP AND SET IN TYPESCRIPT/JAVASCRIPT
// ============================================

export {};

// ============================================
// MAP - KEY-VALUE PAIRS WITH ANY DATA TYPES
// ============================================

console.log('=== MAP EXAMPLES ===');

// 1. Creating Maps
const emptyMap = new Map<string | number | boolean, string>();
const initializedMap = new Map<string | number | boolean, string>([
  ['key1', 'value1'],
  ['key2', 'value2'],
  [3, 'number key'],
  [true, 'boolean key']
]);

console.log('Empty map:', emptyMap);
console.log('Initialized map:', initializedMap);

// 2. Setting and Getting Values
const userMap = new Map<string, string | number | boolean>();

// set(key, value) - adds or updates a key-value pair
userMap.set('name', 'Alice');
userMap.set('age', 30);
userMap.set('isActive', true);

// get(key) - retrieves value by key
console.log('Name:', userMap.get('name'));
console.log('Age:', userMap.get('age'));
console.log('Non-existent key:', userMap.get('email')); // undefined

// 3. Map Size and Existence Checks
console.log('Map size:', userMap.size);
console.log('Has name key:', userMap.has('name'));
console.log('Has email key:', userMap.has('email'));

// 4. Deleting Entries
userMap.set('temp', 'temporary');
console.log('Before delete:', userMap.has('temp'));
userMap.delete('temp');
console.log('After delete:', userMap.has('temp'));

// 5. Iterating Over Maps
const inventory = new Map<string, number>([
  ['apples', 10],
  ['bananas', 5],
  ['oranges', 8]
]);

// forEach(callback, thisArg)
inventory.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// for...of with entries()
for (const [key, value] of inventory.entries()) {
  console.log(`Entry: ${key} = ${value}`);
}

// for...of with keys()
console.log('Keys:', Array.from(inventory.keys()));

// for...of with values()
console.log('Values:', Array.from(inventory.values()));

// 6. Map Operations
const map1 = new Map<string, number>([['a', 1], ['b', 2]]);
const map2 = new Map<string, number>([['b', 20], ['c', 3]]);

// Merging maps (map2 values override map1 for duplicate keys)
const merged = new Map<string, number>([...map1, ...map2]);
console.log('Merged map:', merged);

// Clearing all entries
merged.clear();
console.log('After clear:', merged.size);

// ============================================
// SET - UNIQUE VALUES COLLECTION
// ============================================

console.log('\n=== SET EXAMPLES ===');

// 1. Creating Sets
const emptySet = new Set();
const initializedSet = new Set([1, 2, 3, 2, 1]); // duplicates are ignored
const stringSet = new Set(['a', 'b', 'c', 'a']);

console.log('Empty set:', emptySet);
console.log('Initialized set (duplicates removed):', initializedSet);
console.log('String set:', stringSet);

// 2. Adding and Checking Values
const uniqueNumbersSet = new Set();

// add(value) - adds a value if it doesn't exist
uniqueNumbersSet.add(1);
uniqueNumbersSet.add(2);
uniqueNumbersSet.add(1); // duplicate, ignored
uniqueNumbersSet.add(3);

console.log('Set after adding:', uniqueNumbersSet);
console.log('Set size:', uniqueNumbersSet.size);
console.log('Has 2:', uniqueNumbersSet.has(2));
console.log('Has 4:', uniqueNumbersSet.has(4));

// 3. Deleting Values
uniqueNumbersSet.add(99);
console.log('Before delete:', uniqueNumbersSet.has(99));
uniqueNumbersSet.delete(99);
console.log('After delete:', uniqueNumbersSet.has(99));

// 4. Iterating Over Sets
const fruits = new Set(['apple', 'banana', 'orange']);

// forEach(callback, thisArg)
fruits.forEach(fruit => {
  console.log('Fruit:', fruit);
});

// for...of loop
for (const fruit of fruits) {
  console.log('For...of fruit:', fruit);
}

// Converting to array
console.log('Set as array:', Array.from(fruits));
console.log('Set values:', [...fruits.values()]);
console.log('Set keys (same as values):', [...fruits.keys()]);

// 5. Set Operations
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union: elements in either set
const union = new Set([...setA, ...setB]);
console.log('Union:', union);

// Intersection: elements in both sets
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log('Intersection:', intersection);

// Difference: elements in setA but not in setB
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log('Difference (A - B):', difference);

// Symmetric difference: elements in either set but not both
const symmetricDifference = new Set([
  ...[...setA].filter(x => !setB.has(x)),
  ...[...setB].filter(x => !setA.has(x))
]);
console.log('Symmetric difference:', symmetricDifference);

// ============================================
// ADVANCED MAP AND SET PATTERNS
// ============================================

console.log('\n=== ADVANCED PATTERNS ===');

// 1. Using Objects as Map Keys
const userMapWithObjects = new Map<{id: number; name: string}, string>();

const userObj1 = { id: 1, name: 'Alice' };
const userObj2 = { id: 2, name: 'Bob' };

// Objects can be used as keys (unlike plain objects)
userMapWithObjects.set(userObj1, 'Admin');
userMapWithObjects.set(userObj2, 'User');

console.log('User roles:', userMapWithObjects.get(userObj1), userMapWithObjects.get(userObj2));

// Note: Different object instances with same content are different keys
const userObj1Duplicate = { id: 1, name: 'Alice' };
console.log('Same content, different object:', userMapWithObjects.get(userObj1Duplicate)); // undefined

// 2. WeakMap - allows garbage collection of keys
const weakMap = new WeakMap();
let tempObject: { data: string } | undefined = { data: 'temporary' };

weakMap.set(tempObject, 'associated value');
console.log('WeakMap value:', weakMap.get(tempObject));

// When tempObject is set to undefined, it can be garbage collected
tempObject = undefined;
// Note: We can't check weakMap.has() here as the object might already be collected

// 3. WeakSet - allows garbage collection of values
const weakSet = new WeakSet();
let tempObj: { id: number } | undefined = { id: 123 };

weakSet.add(tempObj);
console.log('WeakSet has object:', weakSet.has(tempObj));

tempObj = undefined;
// Object can now be garbage collected

// 4. Map with complex key types
const complexMap = new Map<any, string>();

// Using arrays as keys
complexMap.set([1, 2, 3], 'array key');
complexMap.set(['a', 'b'], 'another array key');

// Using functions as keys
complexMap.set(function add(a: number, b: number): number { return a + b; }, 'function key');

// Note: Reference equality for complex keys
console.log('Same array reference:', complexMap.get([1, 2, 3])); // undefined (different array instance)
console.log('Function key:', complexMap.get(function add(a: number, b: number): number { return a + b; })); // undefined (different function instance)

// 5. Converting between Map and Object
const sampleObj = { a: 1, b: 2, c: 3 };
const mapFromObj = new Map<string, number>(Object.entries(sampleObj));
console.log('Map from object:', mapFromObj);

const objFromMap = Object.fromEntries(mapFromObj);
console.log('Object from map:', objFromMap);

// 6. Set with custom equality (using Map internally)
function createSetWithCustomEquality() {
  const map = new Map<string, unknown>();

  return {
    add(item: unknown) {
      // Using JSON.stringify as a simple equality check (not recommended for production)
      const key = JSON.stringify(item);
      if (!map.has(key)) {
        map.set(key, item);
      }
      return this;
    },

    has(item: unknown) {
      return map.has(JSON.stringify(item));
    },

    get size() {
      return map.size;
    },

    values() {
      return map.values();
    }
  };
}

const customSet = createSetWithCustomEquality();
customSet.add({ x: 1, y: 2 });
customSet.add({ x: 1, y: 2 }); // duplicate, ignored
customSet.add({ x: 3, y: 4 });

console.log('Custom set size:', customSet.size);

// ============================================
// TYPE-SAFE MAP AND SET WITH TYPESCRIPT
// ============================================

console.log('\n=== TYPESCRIPT EXAMPLES ===');

// Type-safe Map
interface MapUser {
  id: number;
  name: string;
}

const userRoleMap: Map<MapUser, 'admin' | 'user' | 'guest'> = new Map();

const mapUserAlice: MapUser = { id: 1, name: 'Alice' };
const mapUserBob: MapUser = { id: 2, name: 'Bob' };

userRoleMap.set(mapUserAlice, 'admin');
userRoleMap.set(mapUserBob, 'user');

// Type-safe Set
const allowedRoles: Set<'admin' | 'user' | 'guest'> = new Set(['admin', 'user']);

console.log('Type-safe examples work without compilation errors');

// ============================================
// PERFORMANCE CHARACTERISTICS
// ============================================

console.log('\n=== PERFORMANCE NOTES ===');
/*
Map vs Object:
- Map: O(1) for get/set/has/delete
- Object: O(1) average case, but can degrade with many properties

Set vs Array:
- Set: O(1) for has/add/delete
- Array: O(n) for includes/push/splice

Memory:
- Map/Set use more memory than Object/Array
- WeakMap/WeakSet allow garbage collection of keys/values

Iteration:
- Map preserves insertion order
- Set preserves insertion order
- Object property order is not guaranteed in older JS engines
*/

// ============================================
// COMMON USE CASES
// ============================================

console.log('\n=== COMMON USE CASES ===');

// 1. Caching/Memoization
const cache = new Map<string, any>();

function memoizedFibonacci(n: number): number {
  const key = n.toString();
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = n <= 1 ? n : memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
  cache.set(key, result);
  return result;
}

console.log('Fibonacci(10):', memoizedFibonacci(10));

// 2. Unique value filtering
const numberArray = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = [...new Set(numberArray)];
console.log('Unique numbers:', uniqueNumbers);

// 3. Frequency counting
const words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const frequency = new Map<string, number>();

words.forEach(word => {
  frequency.set(word, (frequency.get(word) || 0) + 1);
});

console.log('Word frequency:', Object.fromEntries(frequency));

// 4. Bidirectional mapping
const bidirectionalMap = {
  forward: new Map<string, string>(),
  reverse: new Map<string, string>()
};

function setBidirectional(key: string, value: string) {
  bidirectionalMap.forward.set(key, value);
  bidirectionalMap.reverse.set(value, key);
}

setBidirectional('en', 'English');
setBidirectional('es', 'Spanish');

console.log('Forward lookup:', bidirectionalMap.forward.get('en'));
console.log('Reverse lookup:', bidirectionalMap.reverse.get('English'));

console.log('\n=== SUMMARY ===');
console.log('Map: Key-value pairs, any data type keys, preserves insertion order');
console.log('Set: Unique values, preserves insertion order');
console.log('WeakMap/WeakSet: Allow garbage collection of keys/values');
console.log('Use Map over Object when: keys are not strings/symbols, need iteration order, frequent additions/deletions');
console.log('Use Set over Array when: need unique values, frequent membership tests, frequent additions/deletions');
