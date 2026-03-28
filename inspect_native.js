import { ZenLayoutEngine } from './packages/zen-tui-core/src/native.js';

const l = new ZenLayoutEngine();
console.log("\n--- ZenLayoutEngine Methods ---");
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(l)));
console.log("-------------------------------\n");
process.exit(0);
