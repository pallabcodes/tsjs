import "reflect-metadata";

// Global validators object
const validators: Record<string, ((value: any) => boolean)[]> = {};

// --- Singleton decorator ---
function Singleton<T extends new (...args: any[]) => any>(constructor: T) {
  let instance: InstanceType<T>;
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      if (!instance) {
        instance = this as InstanceType<T>;
      }
    }
  };
}

// --- Property decorator ---
function LogProperty(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    let value = target[propertyKey];
    Object.defineProperty(target, propertyKey, {
      get() {
        console.log(`Getting ${String(propertyKey)}: ${value}`);
        return value;
      },
      set(newVal: any) {
        console.log(`Setting ${String(propertyKey)} to ${newVal}`);
        value = newVal;
      },
      enumerable: true,
      configurable: true
    });
  };
}

function TypeMeta(type: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata("design:type", type, target, propertyKey);
  };
}

// --- Serializable decorator ---
function Serializable(target: any, propertyKey: string | symbol): void {
  const props = Reflect.getMetadata("serializable:props", target) || [];
  props.push(propertyKey);
  Reflect.defineMetadata("serializable:props", props, target);
}

// --- Usage ---
@Singleton
class MetaExample {
  @LogProperty()
  public data: string = "init";

  doSomething(x: number): number {
    return x * 2;
  }
}

class UserMeta {
  @TypeMeta(String)
  name!: string;

  @TypeMeta(Number)
  age!: number;
}

// --- Validation decorators ---
function Validate(type: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata("validate:type", type, target, propertyKey);
  };
}

class UserValidation {
  @Validate("email")
  email!: string;
}

function Required(target: any, propertyKey: string | symbol): void {
  const key = propertyKey as string;
  if (!validators[key]) validators[key] = [];
  validators[key].push((v) => v !== undefined && v !== null && v !== "");
}

function MinLength(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const key = propertyKey as string;
    if (!validators[key]) validators[key] = [];
    validators[key].push((v) => typeof v === "string" && v.length >= length);
  };
}

class UserValidation2 {
  @Required
  @MinLength(3)
  name!: string;
}

function validate(obj: any): string[] {
  return Object.keys(validators).flatMap(key =>
    validators[key].map(fn => fn(obj[key]) ? null : `Validation failed for ${key}`)).filter(Boolean) as string[];
}

function TypeMeta2(type: any): PropertyDecorator {
  return Reflect.metadata("design:type", type);
}

function isOfType<T>(obj: any, key: keyof T, type: any): boolean {
  return Reflect.getMetadata("design:type", obj, key as string) === type;
}

class ProductMeta {
  @TypeMeta2(Number)
  price!: number;
}

function Column(type: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const columns = Reflect.getMetadata("orm:columns", target) || [];
    columns.push({ propertyKey, type });
    Reflect.defineMetadata("orm:columns", columns, target);
  };
}

class UserEntity {
  @Column("string")
  name!: string;

  @Column("number")
  age!: number;
}

class PersonMeta {
  @Serializable 
  name!: string;
  
  @Serializable 
  age!: number;
  
  password!: string;
}

function serialize(obj: any): string {
  const props: string[] = Reflect.getMetadata("serializable:props", obj) || [];
  const data: any = {};
  for (const key of props) data[key] = obj[key];
  return JSON.stringify(data);
}

function printTypes(target: any): void {
  for (const key of Object.getOwnPropertyNames(target.prototype)) {
    const type = Reflect.getMetadata("design:type", target.prototype, key);
    if (type) {
      console.log(`${key}: ${type.name}`);
    }
  }
}

// ORM-style schema extraction
function getSchema(target: any): any[] {
  return Reflect.getMetadata("orm:columns", target) || [];
}

// Runtime: fetch metadata for validation
function getValidationType(target: any, key: string): any {
  return Reflect.getMetadata("validate:type", target, key);
}

printTypes(UserMeta);

const meta1 = new MetaExample();
const meta2 = new MetaExample();
meta1.data = "changed";
console.log(meta1.data);
console.log(meta1.doSomething(5));
console.log(meta1 === meta2); // true (singleton)

class SecureData {
  secret = "classified";
  publicInfo = "open";
}

const handler: ProxyHandler<SecureData> = {
  get(target, prop, receiver) {
    if (prop === "secret") throw new Error("Access denied");
    return Reflect.get(target, prop, receiver);
  }
};

const proxy = new Proxy(new SecureData(), handler);
console.log(proxy.publicInfo); // "open"

const _meta = Symbol("meta");

class WithMeta {
  [_meta]: any;
  constructor(meta: any) { this[_meta] = meta; }
  getMeta(): any { return this[_meta]; }
}

const obj = new WithMeta({ version: 2 });
console.log(obj.getMeta()); // { version: 2 }

type MakeOptional<T> = {
  [K in keyof T]?: T[K];
};

type EventMap = {
  click: { x: number; y: number };
  key: { code: string };
};

type EventPayload<T extends keyof EventMap> = EventMap[T];

function handleEvent<T extends keyof EventMap>(type: T, payload: EventPayload<T>): void {
  console.log(type, payload);
}

handleEvent("click", { x: 10, y: 20 });
handleEvent("key", { code: "Enter" });

const internal = Symbol("internal");

class SymbolMeta {
  [internal]: string;
  constructor(secret: string) {
    this[internal] = secret;
  }
  getSecret(): string {
    return this[internal];
  }
}

const s = new SymbolMeta("hidden");
console.log(s.getSecret()); // "hidden"

type Constructor<T = {}> = new (...args: any[]) => T;

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    activate(): void { this.isActive = true; }
    deactivate(): void { this.isActive = false; }
  };
}

function Disposable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    disposed = false;
    dispose(): void { this.disposed = true; }
  };
}

// Compose multiple mixins with type inference
class Service {
  doWork(x: number): number { return x * 2; }
}
const AdvancedService = Activatable(Disposable(Service));
const svc = new AdvancedService();
svc.activate();
svc.dispose();

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Example1 = { a: { b: { c: number } }, d: string };
type ReadonlyExample = DeepReadonly<Example1>;

console.log(getValidationType(UserValidation.prototype, "email")); // "email"

function createModel<T extends object>(defaults: T) {
  return class {
    constructor(init?: Partial<T>) {
      Object.assign(this, defaults, init);
    }
  } as new(init?: Partial<T>) => T;
}

const UserModel = createModel({ name: "", age: 0 });
const user = new UserModel({ name: "Alice" });
console.log(user); // { name: "Alice", age: 0 }

interface Query<T> {
  select: (fields: (keyof T)[]) => Query<T>;
  where: (cond: Partial<T>) => Query<T>;
  toString: () => string;
}

function createQuery<T>(table: string): Query<T> {
  let fields: (keyof T)[] = [];
  let cond: Partial<T> = {};
  return {
    select(f) { fields = f; return this; },
    where(c) { cond = c; return this; },
    toString() {
      const whereClause = Object.entries(cond).map(([k, v]) => `${k}='${v}'`).join(" AND ");
      return `SELECT ${fields.join(", ")} FROM ${table} WHERE ${whereClause}`;
    }
  };
}

// Usage:
const q = createQuery<{ id: number, name: string }>("users").select(["id", "name"]).where({ id: 42 });
console.log(q.toString()); // SELECT id, name FROM users WHERE id='42'

const registry = new Map<string, any>();

function Register(name: string) {
  return function (ctor: any) {
    registry.set(name, ctor);
  };
}

@Register("MyService")
class MyService {}

console.log(registry.get("MyService") === MyService); // true

type IsString<T> = T extends string ? true : false;
type Test1 = IsString<"hello">; // true
type Test2 = IsString<42>;      // false

type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type OnlyMethods<T> = Pick<T, FunctionKeys<T>>;

class Foo { 
  a = 1; 
  b(): void { /* method implementation */ }
  c(): void { /* method implementation */ }
}
type FooMethods = OnlyMethods<Foo>; // { b: ..., c: ... }

function createLogged<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const orig = Reflect.get(target, prop, receiver);
      if (typeof orig === "function") {
        return function (this: any, ...args: any[]) {
          console.log(`Calling ${String(prop)} with`, args);
          return orig.apply(this, args);
        };
      }
      return orig;
    }
  });
}

const loggedService = createLogged(new Service());
loggedService.doWork(5); // Logs: Calling doWork with [5]

type Events = {
  data: { value: number };
  error: { message: string };
};

class TypedEmitter<E extends Record<string, any>> {
  private readonly listeners: { [K in keyof E]?: Array<(payload: E[K]) => void> } = {};
  
  on<K extends keyof E>(event: K, fn: (payload: E[K]) => void): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(fn);
  }
  
  emit<K extends keyof E>(event: K, payload: E[K]): void {
    this.listeners[event]?.forEach(fn => fn(payload));
  }
}

const emitter = new TypedEmitter<Events>();
emitter.on("data", d => console.log(d.value));
emitter.emit("data", { value: 42 });

// Usage:
const u = new UserValidation2();
u.name = "Al";
console.log(validate(u)); // ["Validation failed for name"]

const PLUGIN_REGISTRY = Symbol("PLUGIN_REGISTRY");

interface Plugin {
  name: string;
  run(): void;
}

function RegisterPlugin<T extends new(...args: any[]) => Plugin>(ctor: T): void {
  (globalThis as any)[PLUGIN_REGISTRY] ||= [];
  (globalThis as any)[PLUGIN_REGISTRY].push(ctor);
}

@RegisterPlugin
class LoggerPlugin implements Plugin {
  name = "logger";
  run(): void { console.log("Logging..."); }
}

// Usage:
const plugins: Plugin[] = ((globalThis as any)[PLUGIN_REGISTRY] || []).map((C: any) => new C());
plugins.forEach(p => p.run());

type PropertiesOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T];

type OnlyStrings<T> = Pick<T, PropertiesOfType<T, string>>;

type Example2 = { a: string; b: number; c: string };
type StringProps = OnlyStrings<Example2>; // { a: string; c: string }

function extendWith<TBase extends new (...args: any[]) => any, TProps extends object>(
  Base: TBase, props: TProps
) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, props);
    }
  };
}

class Animal { 
  speak(): string { return "..."; } 
}

const Dog = extendWith(Animal, { bark: () => "woof" });
const d = new Dog();
console.log(d.speak(), (d as any).bark());

const personMeta = new PersonMeta();
personMeta.name = "Alice";
personMeta.age = 30;
personMeta.password = "secret";
console.log(serialize(personMeta)); // {"name":"Alice","age":30}

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T];

type Example3 = { a?: number; b: string };
type RequiredOnly = Pick<Example3, RequiredKeys<Example3>>; // { b: string }

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": 
      return Math.PI * shape.radius ** 2;
    case "square": 
      return shape.size ** 2;
    default: {
      const _exhaustive: never = shape; 
      return _exhaustive;
    }
  }
}

class ImmutableConfig {
  constructor(public config: Record<string, any>) {
    Object.freeze(this.config);
  }
}

const cfg = new ImmutableConfig({ port: 8080, env: "prod" });

class SealedModel {
  name = "sealed";
  constructor() {
    Object.seal(this);
  }
}
const sealed = new SealedModel();

class DynamicModel {
  private readonly _data: Record<string, any> = {};
  
  set(key: string, value: any): void {
    Reflect.set(this._data, key, value);
  }
  
  get(key: string): any {
    return Reflect.get(this._data, key);
  }
  
  has(key: string): boolean {
    return Reflect.has(this._data, key);
  }
}

const model = new DynamicModel();
model.set("foo", 123);
console.log(model.get("foo")); // 123
console.log(model.has("foo")); // true

class HiddenState {
  constructor() {
    Object.defineProperty(this, "_secret", {
      value: 42,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  
  getSecret(): number {
    return (this as any)._secret;
  }
}

const h = new HiddenState();
console.log(h.getSecret()); // 42
console.log(Object.keys(h)); // []

console.log(getSchema(UserEntity.prototype));

class BankAccount {
  balance = 1000;
}

const account = new BankAccount();

const secured = new Proxy(account, {
  get(target, prop, receiver) {
    if (prop === "balance") {
      throw new Error("Access denied");
    }
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    if (prop === "balance" && value < 0) {
      throw new Error("Negative balance not allowed");
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

(secured as any)["foo"] = 123; // Allowed

function deepFreeze<T>(obj: T): T {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === "object") deepFreeze(value);
  });
  return Object.freeze(obj);
}

const deeply = deepFreeze({ a: { b: { c: 1 } } });

type Schema = { [key: string]: "string" | "number" | "boolean" };

function validateSchema(obj: any, schema: Schema): boolean {
  return Object.keys(schema).every(
    key => typeof obj[key] === schema[key]
  );
}

const schema: Schema = { name: "string", age: "number" };
console.log(validateSchema({ name: "Alice", age: 30 }, schema)); // true
console.log(validateSchema({ name: "Alice", age: "oops" }, schema)); // false