class PrinterService {
  static instance;
  #mode = null;

  constructor() {
    if (PrinterService.instance) {
      return PrinterService.instance;
    }
    PrinterService.instance = this;
  }

  getPrinterStatus() {
    return this.#mode;
  }

  // Any other methods or properties you want
  setMode(mode) {
    this.#mode = mode;
    console.log(mode);
  }


}

const worker1 = new PrinterService();
const worker2 = new PrinterService();

console.log(worker1 === worker2) //true


worker1.setMode("GrayScale");
worker2.setMode("Color");

console.log(worker1.getPrinterStatus())
console.log(worker2.getPrinterStatus());

// Static property to hold the instance