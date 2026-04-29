# INV-11: Persistence — xyflow Mapping

## Purpose
Map the logic for serializing the graph state to a JSON-safe format and re-hydrating it.

## Key Discovery: The Minimum Sufficient State
`xyflow` follows a strict "Minimum Sufficient State" invariant. To perfectly recreate a flow, you only need three keys:
1.  **Nodes**: ID, Type, Data, and Position.
2.  **Edges**: ID, Source, and Target.
3.  **Viewport**: X, Y, and Zoom.

Everything else (measured dimensions, handle bounds, absolute positions) is **Derived State** that the system recalculates during hydration.

## Production Source Mapping

### 1. Serialization (toObject)
- **File**: `packages/react/src/hooks/useReactFlow.ts`
- **Function**: `toObject()` (line 150)
- **Logic**: 
    ```ts
    const { nodes = [], edges = [], transform } = store.getState();
    const [x, y, zoom] = transform;
    return { nodes, edges, viewport: { x, y, zoom } };
    ```
- **Insight**: It simply snapshots the current state of the store.

### 2. Hydration (Adoption)
- **File**: `packages/system/src/utils/store.ts`
- **Function**: `adoptUserNodes` (line 129)
- **Logic**: 
    - Iterates over the serialized `nodes`.
    - Creates an `InternalNode` for each, calculating the initial `positionAbsolute`.
    - Marks nodes as "uninitialized" if dimensions are missing, triggering the measurement pipeline.
- **Insight**: Hydration is just a high-speed "Adoption" phase where the system converts raw user data into "System Reality".

## The Persistence DNA (The Essence)
1.  **JSON-Safety**: The core state must be serializable without circular references.
2.  **Derived vs Core**: Separating what the user provides from what the system calculates.
3.  **Idempotent Hydration**: Re-initializing with the same data should produce the same graph.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Data Format | Flat JSON | Flat JSON |
| Hydration | `init(nodes, edges)` | `adoptUserNodes` + Store Sync |
| Viewport | `[x, y, zoom]` | `[x, y, zoom]` |
| Metadata | Ignored | Merged via `internals` |

## Gaps to Close
- [ ] Implement `serialize()` and `hydrate()` utilities.
