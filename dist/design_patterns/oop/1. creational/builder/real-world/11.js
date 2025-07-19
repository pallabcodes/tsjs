"use strict";
// use: Complex Graphs or Nested Objects
class Address {
    constructor(street, city, zipCode) {
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }
}
class Person {
    constructor(name, age, address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
}
class PersonBuilderImpl {
    constructor() {
        this.name = '';
        this.age = 0;
        this.address = new Address('', '', '');
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setAge(age) {
        this.age = age;
        return this;
    }
    setAddress(address) {
        this.address = address;
        return this;
    }
    build() {
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
//# sourceMappingURL=11.js.map