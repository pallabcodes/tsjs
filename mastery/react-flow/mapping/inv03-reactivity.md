# INV-03: Reactive Updates — xyflow Mapping

## Purpose
Map the orchestration of high-frequency updates (e.g., dragging) to our theoretical invariants.

## Key Discovery: The Middleware Pattern
`xyflow` uses a central Store (Zustand) to manage the loop. The "Essence" isn't just the update, but how it **collects** changes across multiple nodes and **propagates** them in a single batch.

## Production Source Mapping

### 1. The Entry Point: updateNodePositions
- **File**: `packages/react/src/store/index.ts` (line 210)
- **Logic**:
    - Iterates over `nodeDragItems`.
    - Creates a `NodeChange` of type `position`.
    - Handles **Parent Expansion** logic (if a node is dragged out of its parent).
    - Collects all changes into a `changes` array.
- **Insight**: This proves that even for single-node drags, the system treats it as a potential multi-node change event.

### 2. The Dispatcher: triggerNodeChanges
- **File**: `packages/react/src/store/index.ts` (line 264)
- **Logic**:
    - If `hasDefaultNodes` (uncontrolled mode), it calls `applyNodeChanges` (INV-01) to update internal state.
    - It then calls the user-provided `onNodesChange` callback.
- **Insight**: This is the "Control Plane" of the reactivity. It ensures both internal and external states are synchronized.

## The Reactive DNA (The Essence)
1.  **Batching**: Collect high-frequency events (Mouse move -> Drag) into a discrete `Change[]`.
2.  **Validation Middleware**: Allow intercepting/modifying changes before they hit the store.
3.  **Dual-Sync**: Update internal system state *and* notify external user state.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Update Trigger | Manual `triggerUpdate(changes)` | `XYDrag` calling `updateNodePositions` |
| Middleware | None | `onNodesChangeMiddlewareMap` |
| Batching | Simple array push | Complex logic handling `expandParent` and `connection` |
| Side Effects | Synchronous callback | Async `resolveFitView` and `updateNodeInternals` |

## Gaps to Close
- [ ] Implement a `ReactiveEngine` that can batch multiple `NodeChange` objects.
- [ ] Simulate a "Drag Loop" that emits high-frequency updates and verifies the reconciler (INV-01) handles them correctly.
