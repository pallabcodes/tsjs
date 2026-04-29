# SCALING-INV-15: Spatial Virtualization

## Purpose
Optimize the Rendering Pipeline (INV-09) by using the QuadTree (INV-14) to prune non-visible nodes.

## The Limitation of xyflow (Production)
`xyflow` uses `nodes.filter()` to determine which nodes to render. 
- While it handles thousands of nodes well, the **Main Thread** still has to iterate over every node object to check its bounds.
- At 50,000+ nodes, this iteration alone can exceed the 16ms frame budget.

## The L7 Scaling DNA: The Spatial Render List
Instead of filtering an array, we query the QuadTree.
1. **Input**: Current Viewport Rect.
2. **Process**: `quadTree.query(viewport)`.
3. **Complexity**: $O(\log N + K)$ where $K$ is the number of visible nodes.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Visibility Check | $O(N)$ filter | $O(\log N)$ tree query |
| Framerate Stability | Degrades with total node count | Stable (based only on visible nodes) |

## Implementation Roadmap
- [ ] Create a `Virtualizer` class that maintains the QuadTree.
- [ ] Sync the QuadTree with the node state.
- [ ] Implement `getVisibleNodes` using the QuadTree query.
