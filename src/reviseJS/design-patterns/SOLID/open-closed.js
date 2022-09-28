let Color = Object.freeze({ red: "red", green: "green", blue: "blue" });
let Size = Object.freeze({ small: "small", medium: "medium", large: "large" });


class Product {
  constructor(name, color, size) {
    this.name = name;
    this.color = color;
    this.size = size;
  }
}

// open for extension while close for modification

class ProductFilter {
  filterByColor(products, color) {
    return products.filter(p => p.color === color);
  }

  filterBySize(products, size) {
    return products.filter(p => p.size === size);
  }

  filterBySizeAndColor(products, size, color) {
    return products.filter(p => p.size === size && p.color === color);
  }

  //  state space exploration
  //  3 criteria = 7 methods
}

class ColorSpecification {
  constructor(color) {
    this.color = color;
  }

  isSatisfied(item) {
    return item.color === this.color;
  }
}

class SizeSpecification {
  constructor(size) {
    this.size = size;
  }

  isSatisfied(item) {
    return item.size === this.size;
  }
}

class AndSpecification {
  constructor(...specs) {
    this.specs = specs;
  }

  isSatisfied(item) {
    return this.specs.every(x => x.isSatisfied(item));
  }
}


let apple = new Product("Apple", Color.green, Size.small);
let tree = new Product("Tree", Color.green, Size.large);
let house = new Product("House", Color.blue, Size.large);

let products = [apple, tree, house];

let pf = new ProductFilter();
console.log(pf);
console.log(`Green products (old):`);
// console.log(pf.filterByColor(products, Color.green));

for (const p of pf.filterByColor(products, Color.green)) {
  console.log(` * ${p.name} is  green`);
}

// for (const p of pf.filterBySize(products, Size.small)) {
//   console.log(` * ${p.name} is  small`);
// }

class BetterFilter {
  filter(items, spec) {
    return items.filter(x => spec.isSatisfied(x));
  }
}

let bFilter = new BetterFilter();
console.log(`Green products (new)`);

for (let b of bFilter.filter(products, new ColorSpecification(Color.green))) {
  console.log(` * ${b.name} is green`);
}

console.log(`Large and green products: `);

let spec = new AndSpecification(new ColorSpecification(Color.green), new SizeSpecification(Size.large));

for (let s of bFilter.filter(products, spec)) {
  console.log(` * ${s.name} is large and green`);
}
