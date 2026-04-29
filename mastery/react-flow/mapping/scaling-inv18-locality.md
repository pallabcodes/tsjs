# SCALING-INV-18: Mechanical Sympathy (Flat Buffers)

## Purpose
Minimize Garbage Collection (GC) and maximize CPU Cache Locality by storing spatial data in contiguous memory (TypedArrays).

## The Limitation of xyflow (Production)
`xyflow` (and most React libraries) stores data as "Arrays of Objects."
- **The Bottleneck**: Each `Node` is a separate heap allocation. When the CPU iterates over nodes, it has to jump to different memory addresses (Pointer Chasing).
- **The Symptom**: "GC Thrashing" during high-frequency animations (like dragging or zooming) as thousands of temporary position objects are created and destroyed.

## The L7 Scaling DNA: The Flat Buffer Store
1. **Contiguous Allocation**: Using a `Float64Array` to store all `[x, y, w, h]` data for all nodes in a single block of memory.
2. **Index-based Access**: Nodes are referenced by their `index` in the buffer, not by an object reference.
3. **Zero-Allocation Updates**: Updating a node's position means changing a value in the `Float64Array`, creating zero new objects.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Data Structure | Array of Objects | TypedArray (Flat) |
| Memory Locality | Low (Scattered) | High (Contiguous) |
| GC Pressure | High (Object churn) | Zero (In-place updates) |

## Implementation Roadmap
- [ ] Create a `FlatNodeStore` using `Float64Array`.
- [ ] Implement `setPosition(index, x, y)` and `getPosition(index)`.
- [ ] Benchmark the iteration speed vs standard Object arrays.
