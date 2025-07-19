"use strict";
// use: Product Customization (Colors, Sizes, etc.)
class TShirt {
    constructor(color, size, material) {
        this.color = color;
        this.size = size;
        this.material = material;
    }
}
class TShirtBuilderImpl {
    constructor() {
        this.color = 'Red';
        this.size = 'M';
        this.material = 'Cotton';
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setSize(size) {
        this.size = size;
        return this;
    }
    setMaterial(material) {
        this.material = material;
        return this;
    }
    build() {
        return new TShirt(this.color, this.size, this.material);
    }
}
// Usage
const tshirt = new TShirtBuilderImpl()
    .setColor('Blue')
    .setSize('L')
    .setMaterial('Polyester')
    .build();
console.log(tshirt);
//# sourceMappingURL=16.js.map