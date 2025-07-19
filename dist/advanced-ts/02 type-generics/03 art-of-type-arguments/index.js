"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curryFunction = void 0;
exports.remapPerson = remapPerson;
const vitest_1 = require("vitest");
function youSayGoodbyeISayHello(greeting) {
    return (greeting === 'goodbye' ? 'hello' : 'goodbye');
}
function youSayGoodbyeISayHelloAlt(greeting) {
    return (greeting === 'goodbye' ? 'hello' : 'goodbye');
}
(0, vitest_1.it)('Should return goodbye when hello is passed in', () => {
    const result = youSayGoodbyeISayHelloAlt('hello');
    (0, vitest_1.expect)(result).toEqual('goodbye');
});
(0, vitest_1.it)('Should return hello when goodbye is passed in', () => {
    const result = youSayGoodbyeISayHelloAlt('goodbye');
    (0, vitest_1.expect)(result).toEqual('hello');
});
(0, vitest_1.it)('Should return goodbye when hello is passed in', () => {
    const result = youSayGoodbyeISayHello('hello');
    (0, vitest_1.expect)(result).toEqual('goodbye');
});
(0, vitest_1.it)('Should return hello when goodbye is passed in', () => {
    const result = youSayGoodbyeISayHello('goodbye');
    (0, vitest_1.expect)(result).toEqual('hello');
});
function remapPerson(key, value) {
    if (key === 'birthdate') {
        return new Date();
    }
    return value;
}
const curryFunction = (t) => (u) => (v) => {
    return {
        t,
        u,
        v,
    };
};
exports.curryFunction = curryFunction;
(0, vitest_1.it)('Should return an object which matches the types of each input', () => {
    const result = (0, exports.curryFunction)(1)(2)(3);
    (0, vitest_1.expect)(result).toEqual({
        t: 1,
        u: 2,
        v: 3,
    });
});
const createCache = (initialCache) => {
    const cache = initialCache || {};
    return {
        get: key => cache[key],
        set: (key, value) => {
            cache[key] = value;
        },
        clone: transform => {
            const newCache = {};
            for (const key in cache) {
                // @ts-expect-error type issue
                newCache[key] = transform(cache[key]);
            }
            return createCache(newCache);
        },
    };
};
(0, vitest_1.it)('Should let you get and set to/from the cache', () => {
    const cache = createCache();
    cache.set('a', 1);
    cache.set('b', 2);
    (0, vitest_1.expect)(cache.get('a')).toEqual(1);
    (0, vitest_1.expect)(cache.get('b')).toEqual(2);
});
(0, vitest_1.it)('Should let you clone the cache using a transform function', () => {
    const numberCache = createCache();
    numberCache.set('a', 1);
    numberCache.set('b', 2);
    const stringCache = numberCache.clone(elem => {
        return String(elem);
    });
    const a = stringCache.get('a');
    (0, vitest_1.expect)(a).toEqual('1');
});
const returnBothOfWhatIPassIn = (params) => {
    return [params.a, params.b];
};
(0, vitest_1.it)('Should return a tuple of the properties a and b', () => {
    const result = returnBothOfWhatIPassIn({
        a: 'a',
        b: 1,
    });
    (0, vitest_1.expect)(result).toEqual(['a', 1]);
});
const getValue = (obj, key) => {
    return obj[key];
};
const obj = {
    a: 1,
    b: 'some-string',
    c: true,
};
const numberResult = getValue(obj, 'a');
const stringResult = getValue(obj, 'b');
const booleanResult = getValue(obj, 'c');
//# sourceMappingURL=index.js.map