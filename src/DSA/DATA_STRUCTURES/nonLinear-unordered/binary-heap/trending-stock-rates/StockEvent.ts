export type StockEvent = {
  symbol: string;
  price: number;
  timestamp: number;
};

const STOCK_SYMBOLS = ['AAPL', 'GOOG', 'AMZN', 'TSLA', 'MSFT', 'NVDA'];

export function generateRandomStockEvent(): StockEvent {
  const symbol = STOCK_SYMBOLS[Math.floor(Math.random() * STOCK_SYMBOLS.length)];

  const price = parseFloat((100 + Math.random() * 50).toFixed(2));

  return {
    symbol,
    price,
    timestamp: Date.now()
  };
}
