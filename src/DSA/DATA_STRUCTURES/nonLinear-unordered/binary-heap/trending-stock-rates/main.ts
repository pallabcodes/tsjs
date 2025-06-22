import { generateRandomStockEvent } from './StockEvent';
import { TrendingRateService } from './TrendingRateService';

const rateTracker = new TrendingRateService();

setInterval(() => {
  const event = generateRandomStockEvent();
  rateTracker.insert(event);

  console.clear();
  console.log('⚡ Trending Stocks by Speed of Price Change (₹/s):\n');
  console.table(rateTracker.getTopTrending());

}, 1000);
