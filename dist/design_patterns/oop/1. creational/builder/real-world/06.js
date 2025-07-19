"use strict";
// use: Immutable objects
class Computer {
    constructor(CPU, RAM, storage) {
        this.CPU = CPU;
        this.RAM = RAM;
        this.storage = storage;
    }
}
class GamingComputerBuilder {
    constructor() {
        this.CPU = 'Intel i9';
        this.RAM = '32GB';
        this.storage = '1TB SSD';
    }
    setCPU(CPU) {
        this.CPU = CPU;
        return this;
    }
    setRAM(RAM) {
        this.RAM = RAM;
        return this;
    }
    setStorage(storage) {
        this.storage = storage;
        return this;
    }
    build() {
        return new Computer(this.CPU, this.RAM, this.storage);
    }
}
// Usage
const gamingPC = new GamingComputerBuilder()
    .setCPU('AMD Ryzen 9')
    .setRAM('64GB')
    .setStorage('2TB SSD')
    .build();
console.log(gamingPC);
//# sourceMappingURL=06.js.map