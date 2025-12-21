// ============================================
// MAP AND SET IN JAVASCRIPT
// ============================================

console.log('=== MAP EXAMPLES ===');

// 1. Creating Maps
const emptyMap = new Map();
const initializedMap = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
  [3, 'number key'],
  [true, 'boolean key']
]);

console.log('Empty map:', emptyMap);
console.log('Initialized map:', initializedMap);

// 2. Setting and Getting Values
const userMap = new Map();

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
const inventory = new Map([
  ['apples', 10],
  ['bananas', 5],
  ['oranges', 8]
]);

// forEach(callback, thisArg)
inventory.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// for...of with entries()
console.log('\nEntries iteration:');
for (const [key, value] of inventory.entries()) {
  console.log(`Entry: ${key} = ${value}`);
}

// for...of with keys()
console.log('Keys:', Array.from(inventory.keys()));

// for...of with values()
console.log('Values:', Array.from(inventory.values()));

// 6. Map Operations
const map1 = new Map([['a', 1], ['b', 2]]);
const map2 = new Map([['b', 20], ['c', 3]]);

// Merging maps (map2 values override map1 for duplicate keys)
const merged = new Map([...map1, ...map2]);
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
const uniqueNumbers = new Set();

// add(value) - adds a value if it doesn't exist
uniqueNumbers.add(1);
uniqueNumbers.add(2);
uniqueNumbers.add(1); // duplicate, ignored
uniqueNumbers.add(3);

console.log('Set after adding:', uniqueNumbers);
console.log('Set size:', uniqueNumbers.size);
console.log('Has 2:', uniqueNumbers.has(2));
console.log('Has 4:', uniqueNumbers.has(4));

// 3. Deleting Values
uniqueNumbers.add(99);
console.log('Before delete:', uniqueNumbers.has(99));
uniqueNumbers.delete(99);
console.log('After delete:', uniqueNumbers.has(99));

// 4. Iterating Over Sets
const fruits = new Set(['apple', 'banana', 'orange']);

// forEach(callback, thisArg)
console.log('\nForEach iteration:');
fruits.forEach(fruit => {
  console.log('Fruit:', fruit);
});

// for...of loop
console.log('\nFor...of iteration:');
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
const userMapWithObjects = new Map();

const user1 = { id: 1, name: 'Alice' };
const user2 = { id: 2, name: 'Bob' };

// Objects can be used as keys (unlike plain objects)
userMapWithObjects.set(user1, 'Admin');
userMapWithObjects.set(user2, 'User');

console.log('User roles:', userMapWithObjects.get(user1), userMapWithObjects.get(user2));

// Note: Different object instances with same content are different keys
const user1Duplicate = { id: 1, name: 'Alice' };
console.log('Same content, different object:', userMapWithObjects.get(user1Duplicate)); // undefined

// 2. WeakMap - allows garbage collection of keys
const weakMap = new WeakMap();
let tempObject = { data: 'temporary' };

weakMap.set(tempObject, 'associated value');
console.log('WeakMap value:', weakMap.get(tempObject));

// When tempObject is set to null, it can be garbage collected
tempObject = null;
// Note: We can't check weakMap.has() here as the object might already be collected

// 3. WeakSet - allows garbage collection of values
const weakSet = new WeakSet();
let tempObj = { id: 123 };

weakSet.add(tempObj);
console.log('WeakSet has object:', weakSet.has(tempObj));

tempObj = null;
// Object can now be garbage collected

// 4. Map with complex key types
const complexMap = new Map();

// Using arrays as keys
complexMap.set([1, 2, 3], 'array key');
complexMap.set(['a', 'b'], 'another array key');

// Using functions as keys
complexMap.set(function add(a, b) { return a + b; }, 'function key');

// Note: Reference equality for complex keys
console.log('Same array reference:', complexMap.get([1, 2, 3])); // undefined (different array instance)
console.log('Function key:', complexMap.get(function add(a, b) { return a + b; })); // undefined (different function instance)

// 5. Converting between Map and Object
const obj = { a: 1, b: 2, c: 3 };
const mapFromObj = new Map(Object.entries(obj));
console.log('Map from object:', mapFromObj);

const objFromMap = Object.fromEntries(mapFromObj);
console.log('Object from map:', objFromMap);

// 6. Set with custom equality (using Map internally)
function createSetWithCustomEquality() {
  const map = new Map();

  return {
    add(item) {
      // Using JSON.stringify as a simple equality check (not recommended for production)
      const key = JSON.stringify(item);
      if (!map.has(key)) {
        map.set(key, item);
      }
      return this;
    },

    has(item) {
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
// COMMON USE CASES
// ============================================

console.log('\n=== COMMON USE CASES ===');

// 1. Caching/Memoization
const cache = new Map();

function memoizedFibonacci(n) {
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
const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbersArray = [...new Set(numbers)];
console.log('Unique numbers:', uniqueNumbersArray);

// 3. Frequency counting
const words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const frequency = new Map();

words.forEach(word => {
  frequency.set(word, (frequency.get(word) || 0) + 1);
});

console.log('Word frequency:', Object.fromEntries(frequency));

// 4. Bidirectional mapping
const bidirectionalMap = {
  forward: new Map(),
  reverse: new Map()
};

function setBidirectional(key, value) {
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
