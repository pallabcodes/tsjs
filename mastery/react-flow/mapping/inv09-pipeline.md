# INV-09: Rendering Pipeline — xyflow Mapping

## Purpose
Map the performance-critical invariants for stacking (Z-Index), layering, and spatial pruning (Virtualization).

## Key Discovery: The $O(1)$ Update Invariant
`xyflow` avoids the "Loop Re-render" trap. The `NodeRenderer` does not loop over all nodes; it maps over an array of **Node IDs**. Each `NodeWrapper` then independently subscribes to its own state in the store. This ensures that dragging a node only triggers a re-render for that specific node component, even if the graph has 1,000 elements.

## Production Source Mapping

### 1. Spatial Pruning (Virtualization)
- **File**: `packages/react/src/hooks/useVisibleNodeIds.ts`
- **Logic**: 
    ```ts
    getNodesInside(nodeLookup, viewportRect, transform)
    ```
- **Insight**: ReactFlow uses the same spatial query engine for both selection and rendering. If a node's bounding box is outside the current viewport, its ID is omitted from the render list.

### 2. The Elevation Invariant (Z-Index)
- **File**: `packages/system/src/utils/store.ts`
- **Logic**:
    - `SELECTED_NODE_Z = 1000`.
    - `calculateZ`: `zIndex + (selected ? 1000 : 0)`.
- **Insight**: Selection isn't just a visual highlight; it's a structural layer change.

### 3. Layer Ordering
- **File**: `packages/react/src/container/GraphView/index.tsx`
- **Order**:
    1. `EdgeRenderer` (SVG layer, bottom).
    2. `ConnectionLine` (SVG layer, mid).
    3. `NodeRenderer` (HTML layer, top).
- **Insight**: Nodes are always rendered above edges because they are in separate DOM containers.

## The Pipeline DNA (The Essence)
1.  **Component Isolation**: Using IDs to decouple the renderer from individual node updates.
2.  **Spatial Visibility**: Rendering = $f(\text{Viewport}, \text{NodeBounds})$.
3.  **Logical Stacking**: Elevating interaction targets (selected nodes) to the top of the stack.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Visibility | Simple AABB pruning | `useVisibleNodeIds` with ResizeObserver |
| Stacking | Selected = Top | Multi-level `z` with parent/child offsets |
| Render Order | SVG < HTML | Strict container separation |
| Performance | Individual subscriptions | Zustand shallow selectors |

## Gaps to Close
- [ ] Implement a `useVisibleItems` logic that prunes a list based on a rect.
- [ ] Implement a `calculateZ` utility that handles selection elevation.
