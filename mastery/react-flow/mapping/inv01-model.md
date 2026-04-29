# INV-01: Graph Model — xyflow Mapping

## Purpose
Directly map the core Graph State representation and reconciliation logic from the `xyflow` production repository.

## Key Discovery: The Change-Based Reconciliation
Unlike a simple state container, `xyflow` treats graph state as a **Reconciled Stream**. The source of truth is an array of items, but mutations are performed via explicit `Change` objects.

## Production Source Mapping

### 1. The Core Data Model (The "What")
- **File**: `packages/system/src/types/nodes.ts`
- **Invariant Essence**:
    - `NodeBase`: The logical data (id, position, data).
    - `InternalNodeBase`: The spatial data (internals, measured dimensions, absolute position).
    - **Insight**: `xyflow` separates "User Intent" from "System Reality".

### 2. The Change Stream (The "How")
- **File**: `packages/system/src/types/changes.ts`
- **Invariant Essence**:
    - A union type `NodeChange` (`position`, `dimensions`, `select`, `add`, `remove`, `replace`).
    - **Insight**: Every mutation is an event, not a direct state overwrite.

### 3. The Reconciliation Logic (The "Essence of Update")
- **File**: `packages/react/src/utils/changes.ts`
- **Function**: `applyChanges(changes, elements)`
- **Core Algorithm**:
    ```ts
    // 1. Group changes by ID for O(1) lookup
    const changesMap = new Map<id, Change[]>();
    
    // 2. Iterate elements once
    for (const element of elements) {
      const changes = changesMap.get(element.id);
      if (!changes) {
        updatedElements.push(element); // No change? No copy. (Perf)
        continue;
      }
      
      const updatedElement = { ...element }; // Shallow copy once
      for (const change of changes) {
        applyChange(change, updatedElement); // Mutate the copy
      }
      updatedElements.push(updatedElement);
    }
    ```
- **Insight**: This is a production-grade optimization. It minimizes re-renders by preserving object references for unchanged nodes while ensuring React sees a new object for changed ones.

## Comparison Table

| Aspect | My Generic Version | xyflow Production Essence |
|--------|--------------------|---------------------------|
| State Structure | `Map<id, Node>` | `Node[]` + `InternalNode[]` |
| Mutation | `updateNodePosition(id, pos)` | `applyNodeChanges(changes[])` |
| Reactivity | Subscriber notified on any set | Reference stability via change-only shallow copies |
| Transformation | None | `InternalNode` manages derived spatial state |

## Gaps to Close
- [ ] Move from `Map`-based storage to `Array`-based reconciliation.
- [ ] Implement the `applyChanges` algorithm to handle reference stability.
- [ ] Define the `InternalNode` vs `Node` split.
