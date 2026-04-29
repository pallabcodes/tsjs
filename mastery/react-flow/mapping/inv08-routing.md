# INV-08: Path Routing — xyflow Mapping

## Purpose
Map the geometric logic for rendering smooth paths (Bézier curves) between handles.

## Key Discovery: The Curvature Invariant
`xyflow` uses **Cubic Bézier Curves** (represented by the `C` command in SVG paths). The "intelligence" isn't in the curve itself, but in the **Control Point Placement**. Control points are projected outward from the handle's face (Top, Bottom, Left, Right) to ensure the line starts perpendicular to the node.

## Production Source Mapping

### 1. The Path Generator
- **File**: `packages/system/src/utils/edges/bezier-edge.ts`
- **Function**: `getBezierPath`
- **DNA**: 
    ```ts
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`
    ```
- **Insight**: This is the standard SVG Path DNA for a cubic curve.

### 2. Control Point Projection
- **Function**: `getControlWithCurvature` (line 77)
- **Logic**: 
    - If `Position.Left`, the control point is shifted on the X-axis: `x1 - offset`.
    - If `Position.Top`, it's shifted on the Y-axis: `y1 - offset`.
- **Insight**: This ensures the curve has "breathing room" before it starts turning toward the target.

### 3. Dynamic Curvature (The sqrt Invariant)
- **Function**: `calculateControlOffset` (line 69)
- **Logic**: Uses `Math.sqrt(-distance)` when handles are "behind" each other.
- **Insight**: This prevents the curve from becoming too aggressive or loop-like when nodes are positioned awkwardly relative to their handles.

## The Routing DNA (The Essence)
1.  **Perpendicular Start**: Control points must be projected along the handle's normal vector.
2.  **Distance Scaling**: The distance of the control point from the handle scales with the distance between source and target.
3.  **Cubic Interpolation**: Using four points (Source, Control1, Control2, Target) to define the spline.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Curve Type | Cubic Bézier | Cubic Bézier |
| Control Logic | Fixed offset project | Dynamic `calculateControlOffset` |
| Labeling | Mid-point (t=0.5) | `getBezierEdgeCenter` |
| Other Styles | Straight/SmoothStep | Modularized path utils |

## Gaps to Close
- [ ] Implement `getBezierPath` with handle-direction-aware control points.
- [ ] Implement a basic `calculateCenter` for label placement.
