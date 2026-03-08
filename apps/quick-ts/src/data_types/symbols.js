// ============================================
// SYMBOL USAGE PATTERNS IN JAVASCRIPT
// ============================================
// Inspired by real-world patterns from open source projects

console.log('=== SYMBOL BASICS ===');

// 1. Symbol Uniqueness
const symbol1 = Symbol('description');
const symbol2 = Symbol('description');
const symbol3 = Symbol();

console.log('Symbols with same description are unique:', symbol1 === symbol2); // false
console.log('Symbol descriptions:', symbol1.description, symbol2.description);
console.log('Symbol without description:', symbol3.description); // undefined

// 2. Global Symbol Registry (shared symbols)
const sharedSymbol1 = Symbol.for('shared');
const sharedSymbol2 = Symbol.for('shared');
const key = Symbol.keyFor(sharedSymbol1);

console.log('Global registry symbols are equal:', sharedSymbol1 === sharedSymbol2);
console.log('Symbol key:', key);

// ============================================
// PRIVATE PROPERTIES PATTERN
// ============================================
// Inspired by libraries like Lodash and internal frameworks

const PRIVATE_PROPS = Symbol('private properties');

class BankAccount {
  constructor(initialBalance = 0) {
    this[PRIVATE_PROPS] = {
      balance: initialBalance,
      transactions: [],
      pin: null
    };
  }

  deposit(amount) {
    if (amount > 0) {
      this[PRIVATE_PROPS].balance += amount;
      this[PRIVATE_PROPS].transactions.push({ type: 'deposit', amount, date: new Date() });
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this[PRIVATE_PROPS].balance) {
      this[PRIVATE_PROPS].balance -= amount;
      this[PRIVATE_PROPS].transactions.push({ type: 'withdraw', amount, date: new Date() });
      return true;
    }
    return false;
  }

  getBalance() {
    return this[PRIVATE_PROPS].balance;
  }

  getTransactions() {
    // Return a copy to prevent external modification
    return [...this[PRIVATE_PROPS].transactions];
  }

  // Public properties are still accessible
  accountNumber = Math.random().toString(36).substr(2, 9);
}

const account = new BankAccount(1000);
account.deposit(500);
account.withdraw(200);

console.log('Account balance:', account.getBalance());
console.log('Account number (public):', account.accountNumber);
console.log('Private props not enumerable:', Object.keys(account)); // ['accountNumber']

// ============================================
// WELL-KNOWN SYMBOLS - CUSTOM ITERATORS
// ============================================
// Inspired by RxJS and other reactive programming libraries

class FibonacciSequence {
  constructor(limit = 10) {
    this.limit = limit;
  }

  *[Symbol.iterator]() {
    let [a, b] = [0, 1];
    let count = 0;

    while (count < this.limit) {
      yield a;
      [a, b] = [b, a + b];
      count++;
    }
  }

  // Custom iterator for reverse fibonacci
  *reverse() {
    const fibs = [];
    let [a, b] = [0, 1];

    while (b < 1000) { // Generate up to a reasonable limit
      fibs.push(a);
      [a, b] = [b, a + b];
    }

    for (let i = fibs.length - 1; i >= 0; i--) {
      yield fibs[i];
    }
  }
}

const fib = new FibonacciSequence(8);
console.log('Fibonacci sequence:', [...fib]);
console.log('Reverse fibonacci:', [...fib.reverse()]);

// ============================================
// SYMBOL-BASED PLUGIN SYSTEM
// ============================================
// Inspired by Express.js middleware and plugin architectures

const PLUGIN_REGISTRY = Symbol('plugin registry');
const PLUGIN_HOOKS = Symbol('plugin hooks');

class Application {
  constructor() {
    this[PLUGIN_REGISTRY] = new Map();
    this[PLUGIN_HOOKS] = new Map();
  }

  use(plugin) {
    const pluginId = Symbol(`plugin_${plugin.name}_${plugin.version}`);
    this[PLUGIN_REGISTRY].set(pluginId, plugin);

    // Register plugin for hooks
    if (!this[PLUGIN_HOOKS].has('init')) {
      this[PLUGIN_HOOKS].set('init', []);
    }
    this[PLUGIN_HOOKS].get('init').push(pluginId);

    return pluginId;
  }

  triggerHook(hookName, ...args) {
    const pluginIds = this[PLUGIN_HOOKS].get(hookName) || [];
    pluginIds.forEach(id => {
      const plugin = this[PLUGIN_REGISTRY].get(id);
      if (plugin && typeof plugin[hookName] === 'function') {
        plugin[hookName](...args);
      }
    });
  }

  getPlugins() {
    return Array.from(this[PLUGIN_REGISTRY].values());
  }
}

// Plugin implementations
const loggerPlugin = {
  name: 'logger',
  version: '1.0.0',
  init(app) {
    console.log('Logger plugin initialized');
  },
  log(message) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }
};

const authPlugin = {
  name: 'auth',
  version: '1.0.0',
  init(app) {
    console.log('Auth plugin initialized');
  },
  authenticate(user, pass) {
    return user === 'admin' && pass === 'secret';
  }
};

// Usage
const app = new Application();
const loggerId = app.use(loggerPlugin);
const authId = app.use(authPlugin);

console.log('Registered plugins:', app.getPlugins().map(p => p.name));

// ============================================
// SYMBOL-BASED METADATA SYSTEM
// ============================================
// Inspired by metadata patterns in various frameworks

const METADATA_KEY = Symbol('metadata');
const PRIVATE_DATA = Symbol('private data');

class MetadataManager {
  constructor() {
    this[METADATA_KEY] = new Map();
  }

  setMetadata(target, key, value) {
    if (!this[METADATA_KEY].has(target)) {
      this[METADATA_KEY].set(target, new Map());
    }
    this[METADATA_KEY].get(target).set(key, value);
  }

  getMetadata(target, key) {
    const targetMetadata = this[METADATA_KEY].get(target);
    return targetMetadata ? targetMetadata.get(key) : undefined;
  }

  hasMetadata(target, key) {
    const targetMetadata = this[METADATA_KEY].get(target);
    return targetMetadata ? targetMetadata.has(key) : false;
  }
}

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this[PRIVATE_DATA] = {
      loginAttempts: 0,
      lastLogin: null
    };
  }

  login(password) {
    // Simulate login logic
    this[PRIVATE_DATA].loginAttempts++;
    this[PRIVATE_DATA].lastLogin = new Date();
    console.log(`${this.name} logged in (attempt ${this[PRIVATE_DATA].loginAttempts})`);
  }

  getLoginStats() {
    return { ...this[PRIVATE_DATA] };
  }
}

// Usage
const metadataManager = new MetadataManager();
const user = new User('Alice', 'alice@example.com');

// Set metadata using symbols as keys
const validationKey = Symbol('validation');
const permissionsKey = Symbol('permissions');

metadataManager.setMetadata(user, validationKey, { required: ['name', 'email'] });
metadataManager.setMetadata(user, permissionsKey, ['read', 'write']);

console.log('User has validation metadata:', metadataManager.hasMetadata(user, validationKey));
console.log('User permissions:', metadataManager.getMetadata(user, permissionsKey));

user.login('password123');
console.log('Login stats:', user.getLoginStats());

// ============================================
// SYMBOL-BASED STATE MANAGEMENT
// ============================================
// Inspired by Redux and Vuex patterns

const STATE_KEY = Symbol('state');
const MUTATIONS = Symbol('mutations');
const ACTIONS = Symbol('actions');

class Store {
  constructor() {
    this[STATE_KEY] = {
      count: 0,
      user: null
    };
    this[MUTATIONS] = new Map();
    this[ACTIONS] = new Map();
  }

  get state() {
    return { ...this[STATE_KEY] }; // Return immutable copy
  }

  commit(mutation, payload) {
    const mutationFn = this[MUTATIONS].get(mutation);
    if (mutationFn) {
      mutationFn(this[STATE_KEY], payload);
    }
  }

  dispatch(action, payload) {
    const actionFn = this[ACTIONS].get(action);
    if (actionFn) {
      actionFn({ commit: this.commit.bind(this), state: this.state }, payload);
    }
  }

  registerMutation(name, mutation) {
    this[MUTATIONS].set(name, mutation);
  }

  registerAction(name, action) {
    this[ACTIONS].set(name, action);
  }
}

// Mutations (synchronous state changes)
const INCREMENT = 'increment';
const SET_USER = 'setUser';

// Actions (can be async)
const LOGIN = 'login';
const INCREMENT_ASYNC = 'incrementAsync';

const store = new Store();

// Register mutations
store.registerMutation(INCREMENT, (state, amount = 1) => {
  state.count += amount;
});

store.registerMutation(SET_USER, (state, user) => {
  state.user = user;
});

// Register actions
store.registerAction(LOGIN, ({ commit }, user) => {
  // Simulate async login
  setTimeout(() => {
    commit(SET_USER, user);
    console.log('User logged in:', user);
  }, 100);
});

store.registerAction(INCREMENT_ASYNC, ({ commit }, amount) => {
  setTimeout(() => {
    commit(INCREMENT, amount);
  }, 500);
});

// Usage
console.log('Initial state:', store.state);

store.commit(INCREMENT, 5);
console.log('After increment:', store.state);

store.dispatch(LOGIN, 'john_doe');
store.dispatch(INCREMENT_ASYNC, 3);

// Wait a bit for async operations
setTimeout(() => {
  console.log('Final state:', store.state);
}, 600);

// ============================================
// SYMBOL-BASED EVENT SYSTEM
// ============================================
// Inspired by Node.js EventEmitter and browser EventTarget

const EVENTS = Symbol('events');
const MAX_LISTENERS = Symbol('max listeners');

class EventEmitter {
  constructor() {
    this[EVENTS] = new Map();
    this[MAX_LISTENERS] = 10;
  }

  on(event, callback) {
    if (!this[EVENTS].has(event)) {
      this[EVENTS].set(event, []);
    }

    const listeners = this[EVENTS].get(event);
    if (listeners.length >= this[MAX_LISTENERS]) {
      console.warn(`Max listeners (${this[MAX_LISTENERS]}) exceeded for event: ${event}`);
    }

    listeners.push(callback);
  }

  off(event, callback) {
    const listeners = this[EVENTS].get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this[EVENTS].get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Event callback error:', error);
        }
      });
    }
  }

  listenerCount(event) {
    return this[EVENTS].get(event)?.length || 0;
  }

  eventNames() {
    return Array.from(this[EVENTS].keys());
  }
}

// Usage with symbols for private events
const emitter = new EventEmitter();
const PRIVATE_EVENT = Symbol('private event');
const PUBLIC_EVENT = 'user:login';

emitter.on(PUBLIC_EVENT, (data) => {
  console.log('User logged in:', data);
});

emitter.on(PRIVATE_EVENT, (data) => {
  console.log('Private event triggered:', data.secret);
});

emitter.emit(PUBLIC_EVENT, { userId: 123, timestamp: Date.now() });
emitter.emit(PRIVATE_EVENT, { secret: 'internal data', userId: 123 });

// Private events don't appear in public event names
console.log('Public event names:', emitter.eventNames().filter(name => typeof name === 'string'));

// ============================================
// SYMBOL-BASED ENUMS AND CONSTANTS
// ============================================

const Color = {
  RED: Symbol('red'),
  GREEN: Symbol('green'),
  BLUE: Symbol('blue')
};

const Shape = {
  CIRCLE: Symbol('circle'),
  SQUARE: Symbol('square'),
  TRIANGLE: Symbol('triangle')
};

function createShape(color, shape) {
  return { color, shape };
}

// Usage
const redCircle = createShape(Color.RED, Shape.CIRCLE);
const blueSquare = createShape(Color.BLUE, Shape.SQUARE);

console.log('Created shapes with symbol-based enums');

// ============================================
// SYMBOL-BASED CACHE WITH TTL
// ============================================

const CACHE_DATA = Symbol('cache data');

class SymbolCache {
  constructor() {
    this[CACHE_DATA] = new Map();
  }

  set(key, value, ttl) {
    const entry = { value };
    if (ttl) {
      entry.expiry = Date.now() + ttl;
    }

    this[CACHE_DATA].set(key, entry);
  }

  get(key) {
    const entry = this[CACHE_DATA].get(key);

    if (!entry) return undefined;

    if (entry.expiry && entry.expiry < Date.now()) {
      this[CACHE_DATA].delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    return this[CACHE_DATA].delete(key);
  }

  clear() {
    this[CACHE_DATA].clear();
  }

  size() {
    // Clean expired entries
    for (const [key, entry] of this[CACHE_DATA]) {
      if (entry.expiry && entry.expiry < Date.now()) {
        this[CACHE_DATA].delete(key);
      }
    }
    return this[CACHE_DATA].size;
  }
}

// Usage with symbol keys for private caching
const cache = new SymbolCache();
const PRIVATE_CACHE_KEY = Symbol('private data');

cache.set('public', 'public data');
cache.set(PRIVATE_CACHE_KEY, 'secret data', 5000); // Expires in 5 seconds

console.log('Cache has public:', cache.has('public'));
console.log('Cache has private:', cache.has(PRIVATE_CACHE_KEY));

// Private keys don't appear in iteration
console.log('Cache size:', cache.size());

// ============================================
// ADVANCED: SYMBOL-BASED MIXINS
// ============================================

const MIXIN_APPLIED = Symbol('mixin applied');

function applyMixin(target, mixin, mixinId) {
  if (!target[MIXIN_APPLIED]) {
    target[MIXIN_APPLIED] = [];
  }

  if (target[MIXIN_APPLIED].includes(mixinId)) {
    return; // Mixin already applied
  }

  target[MIXIN_APPLIED].push(mixinId);

  // Apply mixin properties
  Object.getOwnPropertyNames(mixin).forEach(name => {
    if (name !== 'constructor') {
      target[name] = mixin[name];
    }
  });

  // Apply mixin symbols
  Object.getOwnPropertySymbols(mixin).forEach(symbol => {
    target[symbol] = mixin[symbol];
  });
}

// Mixin definitions
const LOG_LEVEL = Symbol('logLevel');
const VALIDATORS = Symbol('validators');

const LoggerMixin = {
  [LOG_LEVEL]: 'info',

  log(message, level = 'info') {
    const currentLevel = this[LOG_LEVEL];
    if (level === 'error' || currentLevel === 'debug' || level === currentLevel) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  },

  setLogLevel(level) {
    this[LOG_LEVEL] = level;
  }
};

const ValidationMixin = {
  [VALIDATORS]: new Map(),

  addValidator(field, validator) {
    if (!this[VALIDATORS]) {
      this[VALIDATORS] = new Map();
    }
    this[VALIDATORS].set(field, validator);
  },

  validate(data) {
    const validators = this[VALIDATORS] || new Map();
    for (const [field, validator] of validators) {
      if (data[field] !== undefined && !validator(data[field])) {
        return false;
      }
    }
    return true;
  }
};

// Usage
class Form {
  constructor(name) {
    this.name = name;
  }
}

const form = new Form('contact');

applyMixin(form, LoggerMixin, Symbol('LoggerMixin'));
applyMixin(form, ValidationMixin, Symbol('ValidationMixin'));

form.addValidator('email', (value) => value.includes('@'));
form.setLogLevel('debug');

const testData = { email: 'test@example.com', name: 'John' };
const isValid = form.validate(testData);

form.log(`Form validation result: ${isValid}`, 'info');

console.log('\n=== SYMBOL USAGE SUMMARY ===');
console.log('Symbols enable:');
console.log('• Private properties (not enumerable)');
console.log('• Unique identifiers');
console.log('• Well-known symbol protocol');
console.log('• Metaprogramming capabilities');
console.log('• Type-safe constants');
console.log('• Advanced patterns like mixins and registries');

console.log('\nReal-world applications:');
console.log('• Framework internals (React Fiber, Vue internals)');
console.log('• Library APIs (private methods, plugin systems)');
console.log('• State management (Redux internal symbols)');
console.log('• Dependency injection (Angular-style DI)');
console.log('• Event systems (Node.js EventEmitter patterns)');
console.log('• Caching and memoization');
console.log('• Metaprogramming and decorators');
