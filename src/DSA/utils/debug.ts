/**
 * Debug utility for DSA problem solving
 */
export class DebugUtil {
  private static instance: DebugUtil;
  private isDebugMode: boolean = false;
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): DebugUtil {
    if (!DebugUtil.instance) {
      DebugUtil.instance = new DebugUtil();
    }
    return DebugUtil.instance;
  }
  
  /**
   * Enable or disable debug mode
   */
  public setDebugMode(isEnabled: boolean): void {
    this.isDebugMode = isEnabled;
  }
  
  /**
   * Log message if in debug mode
   */
  public log(message: string, data?: any): void {
    if (!this.isDebugMode) return;
    
    console.log(`[DEBUG] ${message}`);
    if (data !== undefined) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
  
  /**
   * Log array state during algorithm execution
   */
  public logArray<T>(arr: T[], message: string = "Array state"): void {
    if (!this.isDebugMode) return;
    
    console.log(`[DEBUG] ${message}:`, arr);
  }
  
  /**
   * Print execution time of a function
   */
  public async measureTime<T>(fn: () => Promise<T> | T): Promise<T> {
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

// Export default instance
export default DebugUtil.getInstance();