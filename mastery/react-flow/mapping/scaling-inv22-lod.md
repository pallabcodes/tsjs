# SCALING-INV-22: Level of Detail (LoD) Aggregation

## Purpose
Maintain performance at extreme zoom levels by aggregating clusters of nodes into a single, low-fidelity representative.

## The Limitation of xyflow (Production)
In `xyflow`, if you zoom out to 1%, every node is still a separate React component in the virtualizer.
- **The Bottleneck**: Drawing 10,000 "dots" is more expensive than drawing 10 "clouds."

## The L7 Scaling DNA: Spatial Decimation
1. **The Grid/Cluster Index**: Grouping nodes into spatial buckets (using the QuadTree from INV-14).
2. **LoD Thresholds**: If `zoom < 0.2`, stop rendering individual nodes.
3. **The Cluster Surrogate**: Render a single "Cluster Node" that represents the average position and density of its children.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Zoom Detail | Full Detail (Always) | Adaptive (LoD) |
| Render Load | $O(N)$ elements | $O(\text{Viewport Density})$ |

## Implementation Roadmap
- [ ] Implement a `ZoomAggregator`.
- [ ] Add logic to the QuadTree to return "Clusters" instead of "Nodes" at low detail levels.
