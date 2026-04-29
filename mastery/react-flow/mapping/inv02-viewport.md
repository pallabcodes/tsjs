# INV-02: Viewport Transformation — xyflow Mapping

## Purpose
Map the mathematical transformation logic (Zoom/Pan) from `xyflow` to our theoretical invariants.

## Key Discovery: d3-zoom as the Engine
`xyflow` does not implement the raw matrix math for zooming and panning from scratch. Instead, it delegates this to `d3-zoom`, which is a industry-standard implementation of the **Zoom toward Point** invariant.

## Production Source Mapping

### 1. The Viewport Model
- **File**: `packages/system/src/types/general.ts`
- **Structure**: `Viewport = { x: number, y: number, zoom: number }`
- **Insight**: This is the standard 2D transformation representation (Translate X, Translate Y, Scale K).

### 2. The Implementation (The Engine)
- **File**: `packages/system/src/xypanzoom/XYPanZoom.ts`
- **Logic**:
    - Uses `d3-zoom` instance (line 57).
    - `d3ZoomInstance.scaleExtent([minZoom, maxZoom])` handles the clamping invariant.
    - `d3ZoomInstance.translateExtent(translateExtent)` handles the boundary invariant.
- **Insight**: `xyflow` wraps `d3-zoom` to provide a higher-level API (e.g., `setViewportConstrained`) that works with its internal graph state.

### 3. Transformation Helpers
- **File**: `packages/system/src/xypanzoom/utils.ts`
- **Logic**:
    - `viewportToTransform`: Converts `{ x, y, zoom }` to `d3-zoom`'s `ZoomTransform`.
    - `transformToViewport`: The inverse conversion.
- **Insight**: The transformation is stored as a `ZoomTransform` object, which represents the matrix math internally.

## The Mathematical DNA (The Essence)
Even though `xyflow` uses a library, the invariant it solves is:
1.  **Point under cursor stays fixed** during zoom.
2.  **Screen to Canvas mapping**: `canvasX = (screenX - x) / k`.
3.  **Canvas to Screen mapping**: `screenX = canvasX * k + x`.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Zoom Math | Explicit `x' = screen - (screen - x) * (k'/k)` | Handled by `d3.zoom()` |
| Event Handling | Native Wheel/Pointer events | `d3-selection` + `d3-zoom` handlers |
| Animations | Simple interpolation | `d3-transition` + `d3-interpolate` |
| Constraints | Manual `clamp()` | `translateExtent` in d3-zoom |

## Gaps to Close
- [ ] Implement the raw math for "Zoom toward mouse" to internalize the DNA.
- [ ] Build a `CoordinateProjection` helper (`project/unproject`) to prove the math works.
