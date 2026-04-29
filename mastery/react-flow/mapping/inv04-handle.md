# INV-04: Handle & Connection Logic — xyflow Mapping

## Purpose
Map the logic for finding, validating, and snapping to connection points (Handles).

## Key Discovery: The Spatial Search
`xyflow` doesn't just check the handle under the mouse. It performs a **Spatial Snapping** search. It finds nodes within a radius and then iterates through their handles to find the mathematically closest valid connection point.

## Production Source Mapping

### 1. The Snapping Engine
- **File**: `packages/system/src/xyhandle/utils.ts`
- **Function**: `getClosestHandle(position, connectionRadius, nodeLookup, fromHandle)`
- **Logic**:
    1. `getNodesWithinDistance`: Quickly filters nodes using an overlapping area check (Invariant: Performance).
    2. Iterate `allHandles` on those nodes.
    3. Calculate Euclidean distance: `Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2))`.
    4. Store the closest one that is within `connectionRadius`.
- **Insight**: This explains why connections feel "magnetic" in ReactFlow.

### 2. Validation Logic
- **File**: `packages/system/src/xyhandle/XYHandle.ts`
- **Function**: `isValidHandle(event, params)`
- **Logic**:
    - Checks `ConnectionMode.Strict` (Source -> Target only) vs `ConnectionMode.Loose`.
    - Prevents self-connections (`handleNodeId !== fromNodeId`).
    - Merges internal validation with user-provided `isValidConnection` callback.
- **Insight**: The system separates "Geometric Validity" (is it close enough?) from "Logical Validity" (are these types allowed to connect?).

### 3. Handle Representation
- **File**: `packages/system/src/types/nodes.ts`
- **Structure**: `NodeHandleBounds` stores `source` and `target` handles as arrays.
- **Insight**: Handles are not just CSS points; they are registered data structures with pre-calculated bounds.

## The Handle DNA (The Essence)
1.  **Geometric Snapping**: Magnetic behavior via distance thresholding.
2.  **Mode-based Filtering**: Enforcing graph rules (Directed vs Undirected).
3.  **Reference Identity**: Each handle has a unique `(nodeId, handleId, type)` tuple.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Snapping | Basic Euclidean distance | Euclidean + `ADDITIONAL_DISTANCE` buffer |
| Validation | Strict/Loose switch | Complex CSS selector + attribute checks |
| Handle Lookup | Array search | `internals.handleBounds` optimized lookup |
| Connection Mode | Enum-based | Mode + User Middleware |

## Gaps to Close
- [ ] Implement `getClosestHandle` using Euclidean distance.
- [ ] Implement `isValidConnection` supporting both Strict and Loose modes.
- [ ] Verify that handles on the same node are excluded from snapping by default.
