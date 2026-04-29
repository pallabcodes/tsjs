# SCALING-INV-24: Double-Buffered Atomic Snapshots

## Purpose
Ensure system stability and fault tolerance by maintaining two independent state buffers, preventing partial or corrupt renders.

## The Limitation of xyflow (Production)
In monolithic state systems, if an error occurs during an update (e.g., a node with `NaN` coordinates), the entire UI state becomes corrupted.
- **The Bottleneck**: There is no "Safe Space" to perform complex math. If the math fails mid-way, the previous valid state is already overwritten.

## The L7 Scaling DNA: Double Buffering
1. **The Back Buffer**: Where the Worker (INV-13) performs all the complex reconciliation and math.
2. **The Front Buffer**: What the Main Thread uses for the current frame's rendering.
3. **The Atomic Swap**: Only when the Back Buffer is verified as "Clean" (no NaNs, bounds valid), the engine swaps the pointers.
4. **Fault Recovery**: If the update fails, the engine simply skips the swap and continues rendering the Front Buffer until the Worker recovers.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Reliability | Fragile (Single State) | Fault-Tolerant (Double Buffer) |
| Recovery | Crash / White Screen | Automatic (Skip-Frame) |

## Implementation Roadmap
- [ ] Create a `DoubleBufferStore` that manages two `SharedNodeStore` instances.
- [ ] Implement the `swap()` and `rollback()` logic.
