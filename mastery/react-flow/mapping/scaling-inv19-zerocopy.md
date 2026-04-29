# SCALING-INV-19: Zero-Copy Synchronization

## Purpose
Eliminate the cost of data transfer between threads by sharing raw memory (SharedArrayBuffer) between the Main Thread and Workers.

## The Limitation of xyflow (Production)
`xyflow` and most libraries communicate with workers using `postMessage`.
- **The Bottleneck**: `postMessage` uses the "Structured Clone Algorithm." Even for a "Tiny" update, the browser must serialize and deserialize the object. At 100,000 nodes, this cloning becomes more expensive than the actual computation.

## The L7 Scaling DNA: Shared Memory
1. **Shared Memory Allocation**: Allocating a single `SharedArrayBuffer` for all node positions.
2. **Atomic Updates**: Using `Atomics.store()` and `Atomics.load()` (if necessary) to ensure the Worker and Main Thread don't read partial data during a write.
3. **Zero Latency**: The Main Thread reads the new position *the exact nanosecond* the Worker writes it. No message passing required for the data itself.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Data Transfer | Structured Clone (Copy) | Zero-Copy (Shared) |
| Performance | $O(N)$ overhead | $O(0)$ overhead |
| Sync Model | Message-based | Memory-based |

## Implementation Roadmap
- [ ] Create a `SharedNodeStore` using `SharedArrayBuffer`.
- [ ] Implement a handshake to pass the buffer to the Worker.
- [ ] Verify that updates in the Worker are visible in the Main Thread without `postMessage`.
