/**
 * Problem: You need to track the stock prices in real-time and notify when the price is higher than previous prices over a certain number of days (i.e., stock span).

Solution:

Use a monotonic stack to track the stock price span (next greater price).

The stack will store prices, and you can pop off prices that are smaller than the current one.
 * 
 * 
*/

function calculateStockSpan(prices: number[]): number[] {
  const stack: number[] = [];
  const span: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    // Pop all prices less than or equal to the current price
    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
      stack.pop();
    }

    // If stack is empty, the span is the entire array so far
    span[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];

    // Push the current index onto the stack
    stack.push(i);
  }

  return span;
}

const stockPrices = [100, 80, 60, 70, 60, 75, 85];
console.log(calculateStockSpan(stockPrices)); // Output: [1, 1, 1, 2, 1, 4, 6]


/**
 * Explanation:

We maintain a monotonic stack where prices are stored in decreasing order.

The span of the current price is calculated based on how many previous days had a lower price than the current one.
 * 
 * 
*/