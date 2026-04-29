# SCALING-INV-14: Spatial Indexing (QuadTree)

## Purpose
Elevate graph performance from $O(N)$ to $O(\log N)$ for spatial queries (Selection, Virtualization, Proximity).

## The Limitation of xyflow (Production)
`xyflow` uses linear scans to find nodes in a rectangle (e.g., `getNodesInSelection` iterates over the entire `nodes` array).
- **The Bottleneck**: At 10,000+ nodes, every "Selection Box" drag becomes expensive ($O(N)$).
- **The Symptom**: Increasing lag as the graph grows.

## The L7 Scaling DNA: The QuadTree
A QuadTree recursively partitions the 2D space into 4 quadrants.
1.  **Insertion**: Nodes are placed into the smallest quadrant that contains them.
2.  **Querying**: Instead of checking every node, we only check quadrants that intersect our query rectangle.
3.  **Pruning**: We discard entire branches of the tree that are outside the query area.

## Evolutionary Step: From xyflow to L7
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Spatial Query | $O(N)$ (Linear Scan) | $O(\log N)$ (QuadTree) |
| Max Stable Nodes | ~1,000 | $100,000+$ |
| Intersection | AABB on all | Pruned Tree Traversal |

## Implementation Roadmap
- [ ] Implement a recursive `QuadTree` structure.
- [ ] Add `insert(node)` and `query(rect)` methods.
- [ ] Integrate with the `getVisibleNodes` (INV-09) and `getNodesInSelection` (INV-07) logic.
