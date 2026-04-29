/**
 * SCALING-INV-31: JIT Profile-Guided Warmup (PGO)
 * 
 * "Primes" the V8 compiler before user interaction begins.
 */

export class JitWarmer {
  /**
   * The "Warmup" DNA.
   * Runs a function repeatedly to trigger the Optimizing Compiler (TurboFan).
   */
  static warm(fn: () => void, iterations: number = 10000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const duration = performance.now() - start;
    console.log(`JIT Warmup complete (${iterations} iterations in ${duration.toFixed(2)}ms)`);
  }

  /**
   * Benchmark to verify that the 10,001st call is as fast as the 10,000th
   * (demonstrating that the code is already compiled).
   */
  static verifyCompiled(fn: () => void): number {
    const start = performance.now();
    fn();
    return performance.now() - start;
  }
}
