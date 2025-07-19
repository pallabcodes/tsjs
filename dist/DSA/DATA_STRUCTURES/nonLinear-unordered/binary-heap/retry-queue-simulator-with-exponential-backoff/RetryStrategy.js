"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExponentialBackoffDelay = getExponentialBackoffDelay;
function getExponentialBackoffDelay(attempt) {
    return Math.min(2 ** attempt * 1000, 60_000); // cap at 60s
}
//# sourceMappingURL=RetryStrategy.js.map