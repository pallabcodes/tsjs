# SCALING-INV-28: Branch-free Instruction Scaling

## Purpose
Maximize CPU instruction pipeline efficiency by eliminating conditional branches (`if/else`) in hot loops.

## The Limitation of xyflow (Production)
JavaScript code is filled with `if` statements. 
- **The Bottleneck**: Inside a loop of 1,000,000 nodes, the CPU's **Branch Predictor** often fails. When a branch is mispredicted, the CPU must flush its pipeline, wasting 15-20 cycles.

## The L7 Scaling DNA: Bitwise Multiplexing
1. **The Mask**: Instead of `if (visible) render()`, we compute a `visibilityBit` (0 or 1).
2. **The Multiply**: We multiply the position or opacity by that bit. 
3. **Linear Execution**: The CPU sees a straight line of instructions with zero branches, allowing it to "Speculatively Execute" at maximum speed.

## Evolutionary Step
| Feature | Standard JS | L7 Mastery Scaling |
|---------|-------------|-------------------|
| Hot Loop Logic | Conditional (Branching) | Bitwise / Algebraic (Branch-free) |
| CPU Pipeline | Frequent Flushes | Continuous Stream |

## Implementation Roadmap
- [ ] Implement a `BranchlessCuller` using bitwise masks.
- [ ] Benchmark "Branchless" vs "Branching" logic in a 1M node loop.
