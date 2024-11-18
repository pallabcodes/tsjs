// use: Complex Graphs or Nested Objects

class Address {
  constructor(
    public street: string,
    public city: string,
    public zipCode: string
  ) {}
}

class Person {
  constructor(
    public name: string,
    public age: number,
    public address: Address
  ) {}
}

interface PersonBuilder {
  setName(name: string): this;
  setAge(age: number): this;
  setAddress(address: Address): this;
  build(): Person;
}

class PersonBuilderImpl implements PersonBuilder {
  private name = '';
  private age = 0;
  private address: Address = new Address('', '', '');

  setName(name: string): this {
    this.name = name;
    return this;
  }
  setAge(age: number): this {
    this.age = age;
    return this;
  }
  setAddress(address: Address): this {
    this.address = address;
    return this;
  }
  build(): Person {
    return new Person(this.name, this.age, this.address);
  }
}

// Usage
const person = new PersonBuilderImpl()
  .setName('John Doe')
  .setAge(30)
  .setAddress(new Address('123 Main St', 'New York', '10001'))
  .build();

console.log(person);
