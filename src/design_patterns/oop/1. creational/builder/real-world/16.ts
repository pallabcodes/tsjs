// use: Product Customization (Colors, Sizes, etc.)

class TShirt {
  constructor(
    public color: string,
    public size: string,
    public material: string
  ) {}
}

interface TShirtBuilder {
  setColor(color: string): this;
  setSize(size: string): this;
  setMaterial(material: string): this;
  build(): TShirt;
}

class TShirtBuilderImpl implements TShirtBuilder {
  private color = 'Red';
  private size = 'M';
  private material = 'Cotton';

  setColor(color: string): this {
    this.color = color;
    return this;
  }
  setSize(size: string): this {
    this.size = size;
    return this;
  }
  setMaterial(material: string): this {
    this.material = material;
    return this;
  }
  build(): TShirt {
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
