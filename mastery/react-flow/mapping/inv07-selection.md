# INV-07: Interaction Plane — xyflow Mapping

## Purpose
Map the logic for area selection (Selection Box) and multi-node interaction.

## Key Discovery: The Geometry of Selection
Selection in `xyflow` is a two-phase process:
1.  **Geometric Rect Calculation**: Tracking mouse movement to define a screen-space rectangle.
2.  **Spatial Query**: Mapping that rectangle to canvas space (using INV-05 Projection) and querying the node lookup to find intersections.

## Production Source Mapping

### 1. The Selection Box Logic
- **File**: `packages/react/src/container/Pane/index.tsx`
- **Logic**:
    - `onPointerDownCapture`: Captures the start point (`startX`, `startY`).
    - `onPointerMove`: Calculates `width` and `height` dynamically.
- **Insight**: The box is always calculated in **Screen Space** (pixels relative to the container).

### 2. The Spatial Query (getNodesInside)
- **File**: `packages/system/src/utils/graph.ts` (line 257)
- **Logic**:
    - Converts the screen-space selection rect to canvas space using `pointToRendererPoint`.
    - Iterates over all nodes and checks for intersection via `getOverlappingArea`.
- **Insight**: This logic is agnostic of the selection tool; it just asks "What nodes are in this 2D area?".

### 3. Selection Synchronization
- **File**: `packages/react/src/container/Pane/index.tsx` (line 225)
- **Logic**:
    - Compares `prevSelectedNodeIds` with new results using `areSetsEqual`.
    - Only triggers `triggerNodeChanges` if the selection set actually changed.
- **Insight**: This is a performance optimization (Invariant: Efficiency) to avoid spamming the change stream.

## The Interaction DNA (The Essence)
1.  **Stateful Drag**: Capturing a Start Point and an End Point.
2.  **Projection-Aware Query**: Projecting the search area into the graph's coordinate system.
3.  **Delta-only Updates**: Only emitting `select` changes when the membership of the selection group changes.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Overlap Check | AABB (Axis-Aligned Bounding Box) | `getOverlappingArea` (handles partial/full) |
| Performance | Simple loop | `nodeLookup` iteration |
| Edge Selection | Included | Automatically selects connected edges |
| Pointer Capture | Standard browser API | `setPointerCapture` for robust dragging |

## Gaps to Close
- [ ] Implement `getNodesInRect` utility.
- [ ] Implement a `SelectionEngine` that tracks a start/end point and emits `id[]` of selected nodes.
