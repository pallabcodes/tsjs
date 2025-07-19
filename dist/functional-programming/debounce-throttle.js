"use strict";
// ## debounce
function debounce(fn, delay) {
    let timerId; // Use appropriate type for timer ID
    return (...args) => {
        // Clear the previous timer if it exists
        if (timerId)
            clearTimeout(timerId);
        // Set a new timer
        timerId = setTimeout(() => {
            fn(...args); // Call the original function
        }, delay);
    };
}
// ## throttle
function throttle(fn, delay) {
    let lastExecutionTime = 0; // Keep track of the last execution time
    let timerId; // Use appropriate type for timer ID
    return (...args) => {
        const now = Date.now(); // Get the current time
        if (now - lastExecutionTime < delay) {
            // If the time since the last execution is less than the delay, do nothing
            return;
        }
        // Update the last execution time
        lastExecutionTime = now;
        fn(...args); // Call the original function
    };
}
// Usage examples
const logMessage = (message) => {
    console.log(message);
};
const debouncedLog = debounce(logMessage, 2000);
const throttledLog = throttle(logMessage, 1000);
// Example usage (debounced)
debouncedLog("Debounce: This message will appear after 2 seconds if not called again.");
debouncedLog("Debounce: This message resets the timer.");
// Example usage (throttled)
setInterval(() => {
    throttledLog("Throttle: This message can appear every second.");
}, 500); // Will log every 1 second, but not more frequently than that
//# sourceMappingURL=debounce-throttle.js.map