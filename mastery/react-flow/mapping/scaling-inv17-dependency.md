# SCALING-INV-17: Incremental Dependency Tracking

## Purpose
Evolve the engine from $O(N)$ re-evaluation to $O(1)$ incremental updates by tracking specific relationships (Parent/Child, Node/Edge).

## The Limitation of xyflow (Production)
`xyflow` uses a monolithic "Nodes" array. When something changes, React and the internal logic often have to reconcile the entire array or a large subset.
- **The Bottleneck**: Moving a node that is deeply nested or has 100 edges requires finding those dependencies in a linear or filtered way.

## The L7 Scaling DNA: The Dependency Map
1. **Adjacency Tracking**: Storing an inverse mapping of `nodeId -> connectedEdges` and `parentId -> children`.
2. **Dirty Marking**: Instead of rebuilding the state, we mark only the affected sub-tree as "Dirty."
3. **Targeted Reconciliation**: Only the dirty elements are passed to the scaling pipeline (INV-13/14).

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Dependency Lookup | $O(E)$ or $O(N)$ filter | $O(1)$ Hash Map lookup |
| Re-evaluation | Array-wide | Incremental (Dirty-only) |

## Implementation Roadmap
- [ ] Create a `DependencyManager` that indexes node/edge/parent relations.
- [ ] Implement `markDirty(nodeId)` which propagates to connected edges.
- [ ] Integrate with the `ChangeBatcher` (INV-16) to only flush dirty changes.
