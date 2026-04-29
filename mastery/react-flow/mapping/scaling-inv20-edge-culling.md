# SCALING-INV-20: Incremental Edge Culling (Spatial Edges)

## Purpose
Optimize edge rendering by indexing edges in the QuadTree, ensuring we only process edges that are visible in the current viewport.

## The Limitation of xyflow (Production)
`xyflow` (and almost every other library) iterates over ALL edges to determine which ones to render.
- **The Bottleneck**: Edges don't have a fixed "Position." They are defined by two points. Calculating a bounding box for every edge on every frame is expensive.
- **The Symptom**: A graph with 1,000 nodes but 10,000 edges will lag during panning, even if only 5 edges are visible.

## The L7 Scaling DNA: Spatial Edge Indexing
1. **Edge AABB**: Calculating the Bounding Box of an edge (minX, minY, maxX, maxY of its endpoints).
2. **QuadTree Edge Storage**: Inserting the edge's AABB into the QuadTree.
3. **Spatial Query**: When the viewport moves, we query the QuadTree for both **Visible Nodes** AND **Visible Edges**.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Edge Rendering | $O(E)$ Linear | $O(\log E)$ Spatial |
| Scalability | Limited by total edges | Limited only by visible edges |

## Implementation Roadmap
- [ ] Extend the QuadTree to handle `SpatialEdge` objects.
- [ ] Implement `calculateEdgeAABB(sourceNode, targetNode)`.
- [ ] Verify that querying the viewport returns only the necessary edges.
