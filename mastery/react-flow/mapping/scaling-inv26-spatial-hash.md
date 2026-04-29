# SCALING-INV-26: Bit-Packed Spatial Hashing

## Purpose
Eliminate heap-based tree structures by using a flat, bit-packed integer array for O(1) spatial lookups at extreme scales.

## The Limitation of xyflow (Production)
`xyflow` uses no spatial index (O(N)). Our previous QuadTree (INV-14) is $O(\log N)$ but uses objects for every branch.
- **The Bottleneck**: A QuadTree for 1 million nodes creates millions of "Quadrant" objects. This causes massive GC pauses and memory overhead.

## The L7 Scaling DNA: The Grid Hash
1. **Spatial Quantization**: Dividing the world into a fixed-size grid.
2. **The Bit-Packed Key**: Converting an `(x, y)` coordinate into a single `uint32` key using bit-shifting: `(gridX << 16) | gridY`.
3. **Flat Bucket Store**: Using a single `Uint32Array` where each index represents a grid cell, containing a pointer to the nodes in that cell.
4. **O(1) Access**: Finding nodes in a viewport becomes a simple array index calculation.

## Evolutionary Step
| Feature | INV-14 QuadTree | L7 Mastery Scaling |
|---------|-----------------|-------------------|
| Structure | Tree (Objects) | Hash (Flat Array) |
| Memory | High (Scattered) | Ultra-Low (Contiguous) |
| Query Complexity | $O(\log N)$ | $O(1)$ |

## Implementation Roadmap
- [ ] Implement a `SpatialHash` using a `Uint32Array`.
- [ ] Implement `getBucket(x, y)` and `query(rect)`.
