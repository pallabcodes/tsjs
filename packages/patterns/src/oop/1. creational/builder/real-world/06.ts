// use: Immutable objects

class Computer {
  constructor(
    public readonly CPU: string,
    public readonly RAM: string,
    public readonly storage: string
  ) {}
}

interface ComputerBuilder {
  setCPU(CPU: string): this;
  setRAM(RAM: string): this;
  setStorage(storage: string): this;
  build(): Computer;
}

class GamingComputerBuilder implements ComputerBuilder {
  private CPU = 'Intel i9';
  private RAM = '32GB';
  private storage = '1TB SSD';

  setCPU(CPU: string): this {
    this.CPU = CPU;
    return this;
  }

  setRAM(RAM: string): this {
    this.RAM = RAM;
    return this;
  }

  setStorage(storage: string): this {
    this.storage = storage;
    return this;
  }

  build(): Computer {
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
