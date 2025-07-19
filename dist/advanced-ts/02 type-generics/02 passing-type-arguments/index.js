"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomePageFeatureFlags = exports.Component = exports.createSet = exports.createSetWithoutDefaultArg = void 0;
const createSetWithoutDefaultArg = () => {
    return new Set();
};
exports.createSetWithoutDefaultArg = createSetWithoutDefaultArg;
const createSet = () => {
    return new Set();
};
exports.createSet = createSet;
const stringSet = (0, exports.createSet)();
const stringOrNumberSet = (0, exports.createSet)();
const numberSet = (0, exports.createSet)();
const unknownSet = (0, exports.createSet)();
const unknownSetWithoutDefaultArg = (0, exports.createSetWithoutDefaultArg)();
class Component {
    constructor(props) {
        this.getProps = () => this.props;
        this.props = props;
    }
}
exports.Component = Component;
const cloneComponent = (component) => {
    return new Component(component.getProps());
};
const component = new Component({ a: 1, b: 2, c: 3 });
const clonedComponent = cloneComponent(component);
const result = clonedComponent.getProps();
const array = [
    {
        name: 'John',
    },
    {
        name: 'Steve',
    },
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const obj = array.reduce((accum, item) => {
    accum[item.name] = item;
    return accum;
}, {});
const fetchData = async (url) => {
    const data = await fetch(url).then(response => response.json());
    return data;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetching() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = await fetchData('https://swapi.dev/api/people/1');
}
const getHomePageFeatureFlags = (config, override) => {
    return override(config.rawConfig.featureFlags.homePage);
};
exports.getHomePageFeatureFlags = getHomePageFeatureFlags;
const EXAMPLE_CONFIG = {
    apiEndpoint: 'https://api.example.com',
    apiVersion: 'v1',
    apiKey: '1234567890',
    rawConfig: {
        featureFlags: {
            homePage: {
                showBanner: true,
                showLogOut: false,
            },
            loginPage: {
                showCaptcha: true,
                showConfirmPassword: false,
            },
        },
    },
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const flags = (0, exports.getHomePageFeatureFlags)(EXAMPLE_CONFIG, defaultFlags => defaultFlags);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const flagsNoBanner = (0, exports.getHomePageFeatureFlags)(EXAMPLE_CONFIG, defaultFlags => ({
    ...defaultFlags,
    showBanner: false,
}));
const typedObjectKeys = (obj) => {
    return Object.keys(obj);
};
const result1 = typedObjectKeys({
    a: 1,
    b: 2,
});
// this is a higher order function, so TypeScript denotes first generic to params and second as the return type
const makeSafe = (func) => (...args) => {
    try {
        const result = func(...args);
        return {
            type: 'success',
            result,
        };
    }
    catch (e) {
        return {
            type: 'failure',
            error: e,
        };
    }
};
// N.B: Here, below function () => 1, which has no parameters (so TParams is [], an empty tuple) and returns a number (so TReturn is number).
const func = makeSafe(() => 1);
const resultFunc = func();
// upto 14
//# sourceMappingURL=index.js.map