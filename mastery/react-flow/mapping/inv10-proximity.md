# INV-10: Collision & Proximity — xyflow Mapping

## Purpose
Map the logic for reactive interactions based on spatial proximity (Auto-Panning and Magnetic Attraction).

## Key Discovery: The Velocity Gradient Invariant
`xyflow` uses a gradient-based approach for auto-panning. Instead of a binary "on/off" pan when you hit the edge, it calculates a **Velocity Factor** based on how deep the cursor is within the "edge zone" (the `distance` threshold).

## Production Source Mapping

### 1. Auto-Pan Velocity
- **File**: `packages/system/src/utils/general.ts`
- **Function**: `calcAutoPanVelocity(value, min, max)`
- **Logic**: 
    ```ts
    if (value < min) return clamp(Math.abs(value - min), 1, min) / min;
    ```
- **Insight**: This creates a linear ramp. If the threshold is 40px and you are at 39px, the velocity is low. If you are at 1px, the velocity is maximum.

### 2. Snap Proximity (Magnetic Handles)
- **File**: `packages/system/src/xyhandle/utils.ts`
- **Logic**: Uses a `connectionRadius` (default 20px).
- **Insight**: This is a radial collision check. If `distance(mouse, handle) < connectionRadius`, the connection snaps.

## The Proximity DNA (The Essence)
1.  **Threshold Zones**: Defining areas (edges or handle radii) where the system state changes.
2.  **Continuous Feedback**: Scaling the response (velocity or attraction strength) based on the distance within the threshold.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Auto-Pan | Gradient ramp | Linear gradient with configurable speed |
| Snapping | Boolean radius | Boolean radius + Euclidean search |
| Physics | None | None (External libraries like `d3-force` recommended) |

## Gaps to Close
- [ ] Implement `calculateAutoPanDelta` with a proximity threshold.
