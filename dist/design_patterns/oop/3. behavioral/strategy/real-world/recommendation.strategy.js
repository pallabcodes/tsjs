"use strict";
// Base Strategy Interface/Class
class RecommendationStrategy {
}
// Concrete Strategy: Popularity-based Recommendation
class PopularityRecommendation extends RecommendationStrategy {
    recommend(userId) {
        console.log(`Recommended products based on popularity for user ${userId}`);
        // Logic to get popular products
        const popularProducts = this.getPopularProducts();
        popularProducts.forEach(product => {
            console.log(`- ${product.name} ($${product.price})`);
        });
    }
    getPopularProducts() {
        return [
            { name: 'Wireless Headphones', price: 99.99 },
            { name: 'Smartphone', price: 699.99 },
            { name: 'Laptop', price: 999.99 },
        ];
    }
}
// Concrete Strategy: User Ratings Recommendation
class RatingsRecommendation extends RecommendationStrategy {
    recommend(userId) {
        console.log(`Recommended products based on user ratings for user ${userId}`);
        // Logic to get highly rated products
        const highlyRatedProducts = this.getHighlyRatedProducts();
        highlyRatedProducts.forEach(product => {
            console.log(`- ${product.name} ($${product.price}) with rating ${product.rating}`);
        });
    }
    getHighlyRatedProducts() {
        return [
            { name: 'Bluetooth Speaker', price: 49.99, rating: 4.8 },
            { name: 'Smart Watch', price: 199.99, rating: 4.5 },
            { name: 'Gaming Console', price: 399.99, rating: 4.7 },
        ];
    }
}
// Concrete Strategy: Purchase History Recommendation
class PurchaseHistoryRecommendation extends RecommendationStrategy {
    recommend(userId) {
        console.log(`Recommended products based on purchase history for user ${userId}`);
        // Logic to analyze purchase history
        const recommendedBasedOnHistory = this.getRecommendationsBasedOnHistory(userId);
        recommendedBasedOnHistory.forEach(product => {
            console.log(`- ${product.name} ($${product.price})`);
        });
    }
    getRecommendationsBasedOnHistory(_userId) {
        // Assuming the user has previously bought headphones
        return [
            { name: 'Headphone Stand', price: 29.99 },
            { name: 'Portable Charger', price: 19.99 },
        ];
    }
}
// Context
class RecommendationEngine {
    constructor() {
        this.recommendationStrategy = null;
    }
    setRecommendationStrategy(strategy) {
        this.recommendationStrategy = strategy;
    }
    recommendProducts(userId) {
        if (!this.recommendationStrategy) {
            console.log('Recommendation strategy not set!');
            return;
        }
        this.recommendationStrategy.recommend(userId); // Execute the recommendation
    }
}
// Usage
const engine = new RecommendationEngine();
// Customer chooses popularity-based recommendations
engine.setRecommendationStrategy(new PopularityRecommendation());
engine.recommendProducts('User123');
// Output: Recommended products based on popularity for user User123
// - Wireless Headphones ($99.99)
// - Smartphone ($699.99)
// - Laptop ($999.99)
// Customer changes to ratings-based recommendations
engine.setRecommendationStrategy(new RatingsRecommendation());
engine.recommendProducts('User123');
// Output: Recommended products based on user ratings for user User123
// - Bluetooth Speaker ($49.99) with rating 4.8
// - Smart Watch ($199.99) with rating 4.5
// - Gaming Console ($399.99) with rating 4.7
// Customer changes to purchase history-based recommendations
engine.setRecommendationStrategy(new PurchaseHistoryRecommendation());
engine.recommendProducts('User123');
// Output: Recommended products based on purchase history for user User123
// - Headphone Stand ($29.99)
// - Portable Charger ($19.99)
//# sourceMappingURL=recommendation.strategy.js.map