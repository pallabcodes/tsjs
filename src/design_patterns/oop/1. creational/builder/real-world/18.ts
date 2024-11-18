// use: Subscription plan builder

class SubscriptionPlan {
  constructor(
    public name: string,
    public pricePerMonth: number,
    public features: string[]
  ) {}
}

interface SubscriptionPlanBuilder {
  setName(name: string): this;
  setPrice(price: number): this;
  setFeatures(features: string[]): this;
  build(): SubscriptionPlan;
}

class BasicSubscriptionPlanBuilder implements SubscriptionPlanBuilder {
  private name = 'Basic Plan';
  private price = 9.99;
  private features: string[] = ['Email Support', '1GB Storage'];

  setName(name: string): this {
    this.name = name;
    return this;
  }
  setPrice(price: number): this {
    this.price = price;
    return this;
  }
  setFeatures(features: string[]): this {
    this.features = features;
    return this;
  }
  build(): SubscriptionPlan {
    return new SubscriptionPlan(this.name, this.price, this.features);
  }
}

// Usage
const basicPlan = new BasicSubscriptionPlanBuilder()
  .setName('Premium Plan')
  .setPrice(29.99)
  .setFeatures(['Priority Support', '10GB Storage', 'Analytics'])
  .build();

console.log(basicPlan);
