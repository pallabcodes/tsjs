"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugUtil = void 0;
/**
 * Debug utility for DSA problem solving
 */
class DebugUtil {
    constructor() {
        this.isDebugMode = false;
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!DebugUtil.instance) {
            DebugUtil.instance = new DebugUtil();
        }
        return DebugUtil.instance;
    }
    /**
     * Enable or disable debug mode
     */
    setDebugMode(isEnabled) {
        this.isDebugMode = isEnabled;
    }
    /**
     * Log message if in debug mode
     */
    log(message, data) {
        if (!this.isDebugMode)
            return;
        console.log(`[DEBUG] ${message}`);
        if (data !== undefined) {
            console.log(JSON.stringify(data, null, 2));
        }
    }
    /**
     * Log array state during algorithm execution
     */
    logArray(arr, message = "Array state") {
        if (!this.isDebugMode)
            return;
        console.log(`[DEBUG] ${message}:`, arr);
    }
    /**
     * Print execution time of a function
     */
    async measureTime(fn) {
        if (!this.isDebugMode) {
            return fn instanceof Promise ? await fn : fn();
        }
        const start = performance.now();
        const result = fn instanceof Promise ? await fn : fn();
        const end = performance.now();
        console.log(`[DEBUG] Execution time: ${(end - start).toFixed(2)}ms`);
        return result;
    }
}
exports.DebugUtil = DebugUtil;
// Export default instance
exports.default = DebugUtil.getInstance();
//# sourceMappingURL=debug.js.map