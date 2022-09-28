const fs = require("fs");

class Journal {
  constructor() {
    this.entries = {};
  }
  addEntry (text) {
    let count = ++Journal.count;
    this.entries[count] = `${count}: ${text}`;
    return count;
  }
  removeEntry(index) {
    delete this.entries[index];
  }
  toString() {
    return Object.values(this.entries).join("\n");
  }
  // save(filename) {
  //   fs.writeFileSync(filename, this.toString());
  // }
  // load(filename) {}
  // loadFromUrl(url) {}
}

Journal.count = 0;

// single responsibility principle used for separation of concerns like how these two method separated in its own class

class PersistentManager {
  preprocess (j) {}
  saveToFile(journal, filename) {
    fs.writeFileSync(filename, journal.toString());
  }
}


let j =  new Journal()

console.log(j);
console.log(j.addEntry('JavaScript Awesome'));
console.log(j.addEntry('MERN STACK'));
console.log(j.toString());
console.log(j.toString());

let p = new PersistentManager();
let filename = "F:\\fronend\\full_todo.md";
p.saveToFile(j, filename);
