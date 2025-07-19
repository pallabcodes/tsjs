"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// Global validators object
const validators = {};
// --- Singleton decorator ---
function Singleton(constructor) {
    let instance;
    return class extends constructor {
        constructor(...args) {
            super(...args);
            if (!instance) {
                instance = this;
            }
        }
    };
}
// --- Property decorator ---
function LogProperty() {
    return function (target, propertyKey) {
        let value = target[propertyKey];
        Object.defineProperty(target, propertyKey, {
            get() {
                console.log(`Getting ${String(propertyKey)}: ${value}`);
                return value;
            },
            set(newVal) {
                console.log(`Setting ${String(propertyKey)} to ${newVal}`);
                value = newVal;
            },
            enumerable: true,
            configurable: true
        });
    };
}
function TypeMeta(type) {
    return function (target, propertyKey) {
        Reflect.defineMetadata("design:type", type, target, propertyKey);
    };
}
// --- Serializable decorator ---
function Serializable(target, propertyKey) {
    const props = Reflect.getMetadata("serializable:props", target) || [];
    props.push(propertyKey);
    Reflect.defineMetadata("serializable:props", props, target);
}
// --- Usage ---
let MetaExample = class MetaExample {
    constructor() {
        this.data = "init";
    }
    doSomething(x) {
        return x * 2;
    }
};
__decorate([
    LogProperty(),
    __metadata("design:type", String)
], MetaExample.prototype, "data", void 0);
MetaExample = __decorate([
    Singleton
], MetaExample);
class UserMeta {
}
__decorate([
    TypeMeta(String),
    __metadata("design:type", String)
], UserMeta.prototype, "name", void 0);
__decorate([
    TypeMeta(Number),
    __metadata("design:type", Number)
], UserMeta.prototype, "age", void 0);
// --- Validation decorators ---
function Validate(type) {
    return function (target, propertyKey) {
        Reflect.defineMetadata("validate:type", type, target, propertyKey);
    };
}
class UserValidation {
}
__decorate([
    Validate("email"),
    __metadata("design:type", String)
], UserValidation.prototype, "email", void 0);
function Required(target, propertyKey) {
    const key = propertyKey;
    if (!validators[key])
        validators[key] = [];
    validators[key].push((v) => v !== undefined && v !== null && v !== "");
}
function MinLength(length) {
    return function (target, propertyKey) {
        const key = propertyKey;
        if (!validators[key])
            validators[key] = [];
        validators[key].push((v) => typeof v === "string" && v.length >= length);
    };
}
class UserValidation2 {
}
__decorate([
    Required,
    MinLength(3),
    __metadata("design:type", String)
], UserValidation2.prototype, "name", void 0);
function validate(obj) {
    return Object.keys(validators).flatMap(key => validators[key].map(fn => fn(obj[key]) ? null : `Validation failed for ${key}`)).filter(Boolean);
}
function TypeMeta2(type) {
    return Reflect.metadata("design:type", type);
}
function isOfType(obj, key, type) {
    return Reflect.getMetadata("design:type", obj, key) === type;
}
class ProductMeta {
}
__decorate([
    TypeMeta2(Number),
    __metadata("design:type", Number)
], ProductMeta.prototype, "price", void 0);
function Column(type) {
    return function (target, propertyKey) {
        const columns = Reflect.getMetadata("orm:columns", target) || [];
        columns.push({ propertyKey, type });
        Reflect.defineMetadata("orm:columns", columns, target);
    };
}
class UserEntity {
}
__decorate([
    Column("string"),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    Column("number"),
    __metadata("design:type", Number)
], UserEntity.prototype, "age", void 0);
class PersonMeta {
}
__decorate([
    Serializable,
    __metadata("design:type", String)
], PersonMeta.prototype, "name", void 0);
__decorate([
    Serializable,
    __metadata("design:type", Number)
], PersonMeta.prototype, "age", void 0);
function serialize(obj) {
    const props = Reflect.getMetadata("serializable:props", obj) || [];
    const data = {};
    for (const key of props)
        data[key] = obj[key];
    return JSON.stringify(data);
}
function printTypes(target) {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
        const type = Reflect.getMetadata("design:type", target.prototype, key);
        if (type) {
            console.log(`${key}: ${type.name}`);
        }
    }
}
// ORM-style schema extraction
function getSchema(target) {
    return Reflect.getMetadata("orm:columns", target) || [];
}
// Runtime: fetch metadata for validation
function getValidationType(target, key) {
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
    constructor() {
        this.secret = "classified";
        this.publicInfo = "open";
    }
}
const handler = {
    get(target, prop, receiver) {
        if (prop === "secret")
            throw new Error("Access denied");
        return Reflect.get(target, prop, receiver);
    }
};
const proxy = new Proxy(new SecureData(), handler);
console.log(proxy.publicInfo); // "open"
const _meta = Symbol("meta");
class WithMeta {
    constructor(meta) { this[_meta] = meta; }
    getMeta() { return this[_meta]; }
}
const obj = new WithMeta({ version: 2 });
console.log(obj.getMeta()); // { version: 2 }
function handleEvent(type, payload) {
    console.log(type, payload);
}
handleEvent("click", { x: 10, y: 20 });
handleEvent("key", { code: "Enter" });
const internal = Symbol("internal");
class SymbolMeta {
    constructor(secret) {
        this[internal] = secret;
    }
    getSecret() {
        return this[internal];
    }
}
const s = new SymbolMeta("hidden");
console.log(s.getSecret()); // "hidden"
function Activatable(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.isActive = false;
        }
        activate() { this.isActive = true; }
        deactivate() { this.isActive = false; }
    };
}
function Disposable(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.disposed = false;
        }
        dispose() { this.disposed = true; }
    };
}
// Compose multiple mixins with type inference
class Service {
    doWork(x) { return x * 2; }
}
const AdvancedService = Activatable(Disposable(Service));
const svc = new AdvancedService();
svc.activate();
svc.dispose();
console.log(getValidationType(UserValidation.prototype, "email")); // "email"
function createModel(defaults) {
    return class {
        constructor(init) {
            Object.assign(this, defaults, init);
        }
    };
}
const UserModel = createModel({ name: "", age: 0 });
const user = new UserModel({ name: "Alice" });
console.log(user); // { name: "Alice", age: 0 }
function createQuery(table) {
    let fields = [];
    let cond = {};
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
const q = createQuery("users").select(["id", "name"]).where({ id: 42 });
console.log(q.toString()); // SELECT id, name FROM users WHERE id='42'
const registry = new Map();
function Register(name) {
    return function (ctor) {
        registry.set(name, ctor);
    };
}
let MyService = class MyService {
};
MyService = __decorate([
    Register("MyService")
], MyService);
console.log(registry.get("MyService") === MyService); // true
class Foo {
    constructor() {
        this.a = 1;
    }
    b() { }
    c() { }
}
function createLogged(obj) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            const orig = Reflect.get(target, prop, receiver);
            if (typeof orig === "function") {
                return function (...args) {
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
class TypedEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, fn) {
        if (!this.listeners[event])
            this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
    emit(event, payload) {
        this.listeners[event]?.forEach(fn => fn(payload));
    }
}
const emitter = new TypedEmitter();
emitter.on("data", d => console.log(d.value));
emitter.emit("data", { value: 42 });
// Usage:
const u = new UserValidation2();
u.name = "Al";
console.log(validate(u)); // ["Validation failed for name"]
const PLUGIN_REGISTRY = Symbol("PLUGIN_REGISTRY");
function RegisterPlugin(ctor) {
    globalThis[PLUGIN_REGISTRY] ||= [];
    globalThis[PLUGIN_REGISTRY].push(ctor);
}
let LoggerPlugin = class LoggerPlugin {
    constructor() {
        this.name = "logger";
    }
    run() { console.log("Logging..."); }
};
LoggerPlugin = __decorate([
    RegisterPlugin
], LoggerPlugin);
// Usage:
const plugins = (globalThis[PLUGIN_REGISTRY] || []).map((C) => new C());
plugins.forEach(p => p.run());
function extendWith(Base, props) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            Object.assign(this, props);
        }
    };
}
class Animal {
    speak() { return "..."; }
}
const Dog = extendWith(Animal, { bark: () => "woof" });
const d = new Dog();
console.log(d.speak(), d.bark());
const personMeta = new PersonMeta();
personMeta.name = "Alice";
personMeta.age = 30;
personMeta.password = "secret";
console.log(serialize(personMeta)); // {"name":"Alice","age":30}
function area(shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.size ** 2;
        default: {
            const _exhaustive = shape;
            return _exhaustive;
        }
    }
}
class ImmutableConfig {
    constructor(config) {
        this.config = config;
        Object.freeze(this.config);
    }
}
const cfg = new ImmutableConfig({ port: 8080, env: "prod" });
class SealedModel {
    constructor() {
        this.name = "sealed";
        Object.seal(this);
    }
}
const sealed = new SealedModel();
class DynamicModel {
    constructor() {
        this._data = {};
    }
    set(key, value) {
        Reflect.set(this._data, key, value);
    }
    get(key) {
        return Reflect.get(this._data, key);
    }
    has(key) {
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
    getSecret() {
        return this._secret;
    }
}
const h = new HiddenState();
console.log(h.getSecret()); // 42
console.log(Object.keys(h)); // []
console.log(getSchema(UserEntity.prototype));
class BankAccount {
    constructor() {
        this.balance = 1000;
    }
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
secured["foo"] = 123; // Allowed
function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        const value = obj[prop];
        if (value && typeof value === "object")
            deepFreeze(value);
    });
    return Object.freeze(obj);
}
const deeply = deepFreeze({ a: { b: { c: 1 } } });
function validateSchema(obj, schema) {
    return Object.keys(schema).every(key => typeof obj[key] === schema[key]);
}
const schema = { name: "string", age: "number" };
console.log(validateSchema({ name: "Alice", age: 30 }, schema)); // true
console.log(validateSchema({ name: "Alice", age: "oops" }, schema)); // false
//# sourceMappingURL=meta-programming.js.map