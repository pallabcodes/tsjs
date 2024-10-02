class Subject {
  constructor() {
    if (new.target === Subject) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  registerObserver() {
    throw new Error('You have to implement the method registerObserver!');
  }

  removeObserver() {
    throw new Error('You have to implement the method removeObserver!');
  }

  notifyObservers() {
    throw new Error('You have to implement the method notifyObservers!');
  }
}

class ConcreteSubject extends Subject {
  constructor() {
    super();
    this.observers = [];
    this.value = 0;
  }

  registerObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers() {
    for (let observer of this.observers) {
      observer.update(this.value);
    }
  }

  setValue(value) {
    this.value = value;
    this.notifyObservers();
  }
}

class Observer {
  constructor() {
    if (new.target === Observer) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  update() {
    throw new Error('You have to implement the method update!');
  }
}

class ConcreteObserver extends Observer {
  constructor(subject) {
    super();
    this.subject = subject;
    this.subject.registerObserver(this);
  }

  update(value) {
    this.value = value;
  }
}

class Store {
  constructor() {
    if (new.target === Store) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  addCustomer() {
    throw new Error('You have to implement the method addCustomer!');
  }

  removeCustomer() {
    throw new Error('You have to implement the method removeCustomer!');
  }

  notifyCustomers() {
    throw new Error('You have to implement the method notifyCustomers!');
  }

  updateQuantity() {
    throw new Error('You have to implement the method updateQuantity!');
  }
}

class BookStore extends Store {
  constructor() {
    super();
    this.customers = [];
    this.stockQuantity = 0;
  }

  addCustomer(customer) {
    this.customers.push(customer);
  }

  removeCustomer(customer) {
    const index = this.customers.indexOf(customer);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
  }

  notifyCustomers() {
    for (let customer of this.customers) {
      customer.update(this.stockQuantity);
    }
  }

  updateQuantity(quantity) {
    this.stockQuantity = quantity;
    this.notifyCustomers();
  }
}

class Customer {
  constructor() {
    if (new.target === Customer) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  update() {
    throw new Error('You have to implement the method update!');
  }
}

class BookCustomer extends Customer {
  constructor(store) {
    super();
    this.store = store;
    this.observedStockQuantity = 0;
    this.store.addCustomer(this);
  }

  update(stockQuantity) {
    this.observedStockQuantity = stockQuantity;
    if (stockQuantity > 0) {
      console.log("Hello, a book you are interested in is back in stock!");
    }
  }
}

let store = new BookStore();

let customer1 = new BookCustomer(store);
let customer2 = new BookCustomer(store);

console.log("Setting stock to 0.");
store.updateQuantity(0);

console.log("\nSetting stock to 5.");
store.updateQuantity(5);

store.removeCustomer(customer1);

console.log("\nSetting stock to 2.");
store.updateQuantity(2);