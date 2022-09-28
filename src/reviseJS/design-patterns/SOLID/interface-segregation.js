let aggregation = (baseClass, ...mixins) => {
  class base extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach(mixin => {
        copyProps(this, (new mixin))
      })
    }
  }
  // this function will copy all props and symbols excluding some special ones from target
  let copyProps = (target, source) => {
    Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source)).forEach(prop => {
      if (!prop.match(/^(?:constuctor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
        Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
      }
    });
  };
  mixins.forEach(mixin => {
  //  outside constructor() to allow aggregation(A, B).staticFunction to be called etc.
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin)
  });
  return base
}
class Document {
}

class Machine {
  constructor() {
    if (this.constructor.name === "Machine") throw  new Error("Machine class is abstract");
  }

  print(doc) {
  }

  fax(doc) {
  }

  scan(doc) {
  }
}

class MultiFunctionPrinter extends Machine {
  print(doc) {
    // super.print(doc);
  }

  fax(doc) {
    // super.fax(doc);
  }

  scan(doc) {
    // super.scan(doc);
  }
}

class NotImplementedError extends Error {
  constructor(name) {
    let message = `${name} is not implemented`;
    super(message);
    // noinspection JSUnresolvedVariable
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError);
    }
  }
}

class OldFashionPrinter extends Machine {
  print(doc) {
    // super.print(doc);
  }


  scan(doc) {
    // throw new Error("not implemented");
    throw new NotImplementedError("OldFashionedPrinter.scan");
  }
}

// ISP = segregate (split up)

class Printer {
  constructor() {
    if (this.constructor.name === "Printer") throw  new Error("Printer class is abstract");
  }

  print() {
  }
}

class Scanner {
  constructor() {
    if (this.constructor.name === "Scanner") throw  new Error("Scanner class is abstract");
  }
  scan() {}
}

class Photocopier  {
  print() {}
  scan() {}
}

// class Photocopier extends aggregation(Printer, Scanner) {
//   print() {}
//   scan() {}
// }

let printer = new OldFashionPrinter();
printer.scan();

