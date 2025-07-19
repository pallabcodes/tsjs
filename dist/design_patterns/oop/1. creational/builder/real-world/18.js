"use strict";
// use: Subscription plan builder
class SubscriptionPlan {
    constructor(name, pricePerMonth, features) {
        this.name = name;
        this.pricePerMonth = pricePerMonth;
        this.features = features;
    }
}
class BasicSubscriptionPlanBuilder {
    constructor() {
        this.name = 'Basic Plan';
        this.price = 9.99;
        this.features = ['Email Support', '1GB Storage'];
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setPrice(price) {
        this.price = price;
        return this;
    }
    setFeatures(features) {
        this.features = features;
        return this;
    }
    build() {
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
//# sourceMappingURL=18.js.map