# INV-05: Coordinate Projection — xyflow Mapping

## Purpose
Map the bidirectional projection between Screen Space (pixels) and Canvas Space (graph units).

## Key Discovery: The Snap-Integrated Projection
`xyflow` doesn't just do matrix multiplication. Its projection utility is tightly coupled with the **Snapping Invariant**. When you project a mouse position onto the canvas, the system can optionally "snap" it to a grid immediately.

## Production Source Mapping

### 1. The Forward Projection (Screen -> Canvas)
- **File**: `packages/system/src/utils/general.ts`
- **Function**: `pointToRendererPoint(point, transform, snapToGrid, snapGrid)`
- **Logic**:
    ```ts
    const position = {
      x: (x - tx) / tScale,
      y: (y - ty) / tScale,
    };
    return snapToGrid ? snapPosition(position, snapGrid) : position;
    ```
- **Insight**: This is used whenever the user interacts with the canvas (dragging, creating edges).

### 2. The Backward Projection (Canvas -> Screen)
- **File**: `packages/system/src/utils/general.ts`
- **Function**: `rendererPointToPoint(point, transform)`
- **Logic**: `x * tScale + tx`
- **Insight**: This is used for calculating the screen-space bounding box or positioning overlays (like MiniMaps).

### 3. The Snapping Invariant
- **Function**: `snapPosition(position, snapGrid)`
- **Logic**: `snapGrid[0] * Math.round(position.x / snapGrid[0])`
- **Insight**: This is the "Super Tiny" way to implement grid alignment.

## The Projection DNA (The Essence)
1.  **Linear Transformation**: Mapping spaces using Translate and Scale.
2.  **Grid Constraint**: Integrating discretization (snapping) into the projection pipeline.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Matrix Math | Explicit formula | Part of `general.ts` utils |
| Snapping | Integrated in `project()` | Optional flag in `pointToRendererPoint` |
| Multiple Spaces | Screen vs Canvas | Includes `absolutePosition` for nested nodes |

## Gaps to Close
- [ ] Ensure our `project` function in `inv02-viewport` supports snapping as an optional invariant.
