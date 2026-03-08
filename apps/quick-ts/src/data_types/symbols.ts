// ============================================
// SYMBOL USAGE PATTERNS IN JAVASCRIPT/TYPESCRIPT
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
  [PRIVATE_PROPS] = {
    balance: 0,
    transactions: [],
    pin: null
  };

  constructor(initialBalance = 0) {
    this[PRIVATE_PROPS].balance = initialBalance;
  }

  deposit(amount: number) {
    if (amount > 0) {
      this[PRIVATE_PROPS].balance += amount;
      this[PRIVATE_PROPS].transactions.push({ type: 'deposit', amount, date: new Date() });
    }
  }

  withdraw(amount: number) {
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
  public accountNumber = Math.random().toString(36).substr(2, 9);
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
  constructor(private limit: number = 10) {}

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
    const fibs: number[] = [];
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

interface Plugin {
  name: string;
  version: string;
  init(app: Application): void;
}

class Application {
  [PLUGIN_REGISTRY] = new Map<symbol, Plugin>();
  [PLUGIN_HOOKS] = new Map<string, symbol[]>();

  use(plugin: Plugin) {
    const pluginId = Symbol(`plugin_${plugin.name}_${plugin.version}`);
    this[PLUGIN_REGISTRY].set(pluginId, plugin);

    // Register plugin for hooks
    if (!this[PLUGIN_HOOKS].has('init')) {
      this[PLUGIN_HOOKS].set('init', []);
    }
    this[PLUGIN_HOOKS].get('init')!.push(pluginId);

    return pluginId;
  }

  triggerHook(hookName: string, ...args: any[]) {
    const pluginIds = this[PLUGIN_HOOKS].get(hookName) || [];
    pluginIds.forEach(id => {
      const plugin = this[PLUGIN_REGISTRY].get(id);
      if (plugin && typeof (plugin as any)[hookName] === 'function') {
        (plugin as any)[hookName](...args);
      }
    });
  }

  getPlugins() {
    return Array.from(this[PLUGIN_REGISTRY].values());
  }
}

// Plugin implementations
const loggerPlugin: Plugin = {
  name: 'logger',
  version: '1.0.0',
  init(app: Application) {
    console.log('Logger plugin initialized');
  },
  log: function(message: string) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }
};

const authPlugin: Plugin = {
  name: 'auth',
  version: '1.0.0',
  init(app: Application) {
    console.log('Auth plugin initialized');
  },
  authenticate: function(user: string, pass: string) {
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
// Inspired by TypeScript decorators and Angular's dependency injection

const METADATA_KEY = Symbol('metadata');
const DEPENDENCIES = Symbol('dependencies');
const INJECTABLE = Symbol('injectable');

interface Constructor<T = any> {
  new (...args: any[]): T;
}

class Container {
  private services = new Map<symbol, any>();

  register<T>(token: symbol, implementation: Constructor<T>) {
    // Check if class is marked as injectable
    if (!implementation[INJECTABLE]) {
      throw new Error('Class must be marked as injectable');
    }

    const dependencies = implementation[DEPENDENCIES] || [];
    const instances = dependencies.map((dep: symbol) => this.services.get(dep));

    this.services.set(token, new implementation(...instances));
  }

  get<T>(token: symbol): T {
    return this.services.get(token);
  }
}

function Injectable() {
  return function<T extends Constructor>(target: T) {
    target[INJECTABLE] = true;
    return target;
  };
}

function Inject(token: symbol) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
    if (!target[DEPENDENCIES]) {
      target[DEPENDENCIES] = [];
    }
    target[DEPENDENCIES][parameterIndex] = token;
  };
}

// Service tokens
const LOGGER_SERVICE = Symbol('LoggerService');
const CONFIG_SERVICE = Symbol('ConfigService');

@Injectable()
class ConfigService {
  getConfig() {
    return { database: 'mongodb://localhost', port: 3000 };
  }
}

@Injectable()
class LoggerService {
  constructor(@Inject(CONFIG_SERVICE) private config: ConfigService) {}

  log(message: string) {
    console.log(`[${this.config.getConfig().port}] ${message}`);
  }
}

@Injectable()
class AppService {
  constructor(@Inject(LOGGER_SERVICE) private logger: LoggerService) {}

  run() {
    this.logger.log('Application started');
  }
}

// Usage
const container = new Container();

container.register(CONFIG_SERVICE, ConfigService);
container.register(LOGGER_SERVICE, LoggerService);
container.register(Symbol('AppService'), AppService);

const appService = container.get<AppService>(Symbol('AppService'));
appService.run();

// ============================================
// SYMBOL-BASED STATE MANAGEMENT
// ============================================
// Inspired by Redux and Vuex patterns

const STATE_KEY = Symbol('state');
const MUTATIONS = Symbol('mutations');
const ACTIONS = Symbol('actions');

interface State {
  count: number;
  user: string | null;
}

class Store {
  [STATE_KEY]: State = {
    count: 0,
    user: null
  };

  [MUTATIONS] = new Map<string, Function>();
  [ACTIONS] = new Map<string, Function>();

  get state() {
    return { ...this[STATE_KEY] }; // Return immutable copy
  }

  commit(mutation: string, payload?: any) {
    const mutationFn = this[MUTATIONS].get(mutation);
    if (mutationFn) {
      mutationFn(this[STATE_KEY], payload);
    }
  }

  dispatch(action: string, payload?: any) {
    const actionFn = this[ACTIONS].get(action);
    if (actionFn) {
      actionFn({ commit: this.commit.bind(this), state: this.state }, payload);
    }
  }

  registerMutation(name: string, mutation: Function) {
    this[MUTATIONS].set(name, mutation);
  }

  registerAction(name: string, action: Function) {
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
store.registerMutation(INCREMENT, (state: State, amount = 1) => {
  state.count += amount;
});

store.registerMutation(SET_USER, (state: State, user: string) => {
  state.user = user;
});

// Register actions
store.registerAction(LOGIN, ({ commit }, user: string) => {
  // Simulate async login
  setTimeout(() => {
    commit(SET_USER, user);
    console.log('User logged in:', user);
  }, 100);
});

store.registerAction(INCREMENT_ASYNC, ({ commit }, amount: number) => {
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

interface EventCallback {
  (data: any): void;
}

class EventEmitter {
  [EVENTS] = new Map<string | symbol, EventCallback[]>();
  [MAX_LISTENERS] = 10;

  on(event: string | symbol, callback: EventCallback) {
    if (!this[EVENTS].has(event)) {
      this[EVENTS].set(event, []);
    }

    const listeners = this[EVENTS].get(event)!;
    if (listeners.length >= this[MAX_LISTENERS]) {
      console.warn(`Max listeners (${this[MAX_LISTENERS]}) exceeded for event: ${event}`);
    }

    listeners.push(callback);
  }

  off(event: string | symbol, callback: EventCallback) {
    const listeners = this[EVENTS].get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event: string | symbol, data?: any) {
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

  listenerCount(event: string | symbol): number {
    return this[EVENTS].get(event)?.length || 0;
  }

  eventNames(): (string | symbol)[] {
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
// Inspired by advanced enum patterns in TypeScript

const Color = {
  RED: Symbol('red'),
  GREEN: Symbol('green'),
  BLUE: Symbol('blue')
} as const;

const Shape = {
  CIRCLE: Symbol('circle'),
  SQUARE: Symbol('square'),
  TRIANGLE: Symbol('triangle')
} as const;

type ColorType = typeof Color[keyof typeof Color];
type ShapeType = typeof Shape[keyof typeof Shape];

function createShape(color: ColorType, shape: ShapeType) {
  return { color, shape };
}

// Usage
const redCircle = createShape(Color.RED, Shape.CIRCLE);
const blueSquare = createShape(Color.BLUE, Shape.SQUARE);

console.log('Created shapes with symbol-based enums');

// Type checking works
// createShape('red', 'circle'); // TypeScript error

// ============================================
// SYMBOL-BASED CACHE WITH TTL
// ============================================
// Inspired by caching libraries like node-cache

const CACHE_DATA = Symbol('cache data');
const CACHE_EXPIRY = Symbol('cache expiry');

interface CacheEntry {
  value: any;
  expiry?: number;
}

class SymbolCache {
  [CACHE_DATA] = new Map<string | symbol, CacheEntry>();
  [CACHE_EXPIRY] = new Map<string | symbol, number>();

  set(key: string | symbol, value: any, ttl?: number) {
    const entry: CacheEntry = { value };
    if (ttl) {
      entry.expiry = Date.now() + ttl;
    }

    this[CACHE_DATA].set(key, entry);
  }

  get(key: string | symbol): any {
    const entry = this[CACHE_DATA].get(key);

    if (!entry) return undefined;

    if (entry.expiry && entry.expiry < Date.now()) {
      this[CACHE_DATA].delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: string | symbol): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string | symbol): boolean {
    return this[CACHE_DATA].delete(key);
  }

  clear() {
    this[CACHE_DATA].clear();
  }

  size(): number {
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
// Inspired by mixin patterns in various JS libraries

const MIXIN_APPLIED = Symbol('mixin applied');

interface Mixin {
  [MIXIN_APPLIED]?: symbol[];
}

function applyMixin(target: Mixin, mixin: any, mixinId: symbol) {
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
      (target as any)[name] = mixin[name];
    }
  });

  // Apply mixin symbols
  Object.getOwnPropertySymbols(mixin).forEach(symbol => {
    (target as any)[symbol] = mixin[symbol];
  });
}

// Mixin definitions
const LoggerMixin = {
  [Symbol('logLevel')]: 'info',

  log(message: string, level = 'info') {
    const currentLevel = (this as any)[Symbol('logLevel')];
    if (level === 'error' || currentLevel === 'debug' || level === currentLevel) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  },

  setLogLevel(level: string) {
    (this as any)[Symbol('logLevel')] = level;
  }
};

const ValidationMixin = {
  [Symbol('validators')]: new Map<string, Function>(),

  addValidator(field: string, validator: Function) {
    (this as any)[Symbol('validators')].set(field, validator);
  },

  validate(data: Record<string, any>): boolean {
    const validators = (this as any)[Symbol('validators')];
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
  constructor(public name: string) {}
}

const form = new Form('contact');

applyMixin(form, LoggerMixin, Symbol('LoggerMixin'));
applyMixin(form, ValidationMixin, Symbol('ValidationMixin'));

form.addValidator('email', (value: string) => value.includes('@'));
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
