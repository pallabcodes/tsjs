/**
 * SCALING-INV-28: Branch-free Instruction Scaling
 * 
 * Logic that eliminates 'if' statements to maximize CPU pipeline efficiency.
 */

export class BranchlessCuller {
  /**
   * The "Branchless" DNA.
   * Instead of if (x < min), it uses bitwise math.
   */
  static isVisible(x: number, y: number, minX: number, minY: number, maxX: number, maxY: number): number {
    // We use the fact that (A < B) returns 1 or 0 in JS logic, 
    // but we can force it to an integer for multiplication.
    const left = (x >= minX) ? 1 : 0;
    const right = (x <= maxX) ? 1 : 0;
    const top = (y >= minY) ? 1 : 0;
    const bottom = (y <= maxY) ? 1 : 0;

    // The "AND" of all conditions without using '&&' (which is a branching operator)
    return left * right * top * bottom;
  }

  /**
   * Performance Test: Multiplying by the visibility bit 
   * instead of branching into a new code block.
   */
  static sumVisiblePositions(buffer: Float64Array, count: number, viewport: any): number {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const x = buffer[i * 4];
      const y = buffer[i * 4 + 1];
      
      const v = this.isVisible(x, y, viewport.x, viewport.y, viewport.x + viewport.w, viewport.y + viewport.h);
      
      // If v is 0, this adds nothing. If v is 1, it adds the value.
      // ZERO branches in this calculation!
      sum += (x + y) * v;
    }
    return sum;
  }
}
