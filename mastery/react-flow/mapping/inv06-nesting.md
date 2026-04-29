# INV-06: Nesting & Layout — xyflow Mapping

## Purpose
Map the logic for nested coordinate spaces (Sub-flows) and automatic parent expansion.

## Key Discovery: The Relative Offset Invariant
`xyflow` maintains a strict separation between `position` (User-provided, relative to parent) and `positionAbsolute` (System-calculated, relative to the canvas origin).

## Production Source Mapping

### 1. Absolute Position Calculation
- **File**: `packages/system/src/utils/store.ts`
- **Function**: `updateAbsolutePositions` -> `updateChildNode` -> `calculateChildXYZ` (line 278)
- **DNA**: 
    ```ts
    const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
    let absolutePosition = { x: parentX + childRelativeX, y: parentY + childRelativeY };
    ```
- **Insight**: The absolute position of a child is always the sum of its parent's absolute position and its own relative position.

### 2. Parent Constraint (extent: 'parent')
- **File**: `packages/system/src/utils/general.ts`
- **Function**: `clampPositionToParent` (line 32)
- **Logic**: Clamps the child's `positionAbsolute` within the `parent.positionAbsolute` + `parent.dimensions` box.

### 3. Parent Expansion (expandParent)
- **File**: `packages/system/src/utils/store.ts`
- **Function**: `handleExpandParent` (line 313)
- **Logic**:
    1. Calculate the union of the parent rect and the child's absolute rect (`getBoundsOfRects`).
    2. If the union is larger than the parent, update the parent's `width`/`height`.
    3. **The Compensation**: If the parent's top-left corner (`x`, `y`) shifts, all other children must have their relative `position` adjusted so they don't appear to move.
- **Insight**: This is a complex interaction between position and dimensions.

## The Nesting DNA (The Essence)
1.  **Recursive Coordinates**: `Absolute = ParentAbsolute + Relative`.
2.  **Boundary Enforcement**: Clamping children to parent bounds.
3.  **Elastic Container**: Growing the parent and compensating child offsets to maintain visual stability.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Nesting Depth | Unlimited (Recursive) | Unlimited |
| Coordinate Storage | Relative + Absolute | Relative + Absolute |
| Expansion | Recursive expansion | Batched `handleExpandParent` |
| Compensation | Manual offset adjustment | Part of `handleExpandParent` loop |

## Gaps to Close
- [ ] Implement `calculateAbsolutePosition` supporting nested parents.
- [ ] Implement `expandParent` logic with relative offset compensation.
