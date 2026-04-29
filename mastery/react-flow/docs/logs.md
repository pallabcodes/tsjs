# 📒 ReactFlow Mastery: Research Logs

> This log captures the raw discovery process for mastering graph-based UI engines through the lens of ReactFlow (xyflow).

---

## Initial Thoughts on xyflow Architecture

ReactFlow is more than just a component; it's a **state-driven spatial engine**. 
It manages a complex relationship between a logical graph and a zoomable coordinate system.

### The Core Challenges:
1.  **Synchronization**: Keeping nodes, edges, and handles in sync during high-frequency dragging.
2.  **Coordinate Mapping**: Translating between pixel space and canvas space.
3.  **Performance**: Handling hundreds of nodes and edges without React render bottlenecks.
4.  **Layout**: Managing the spatial relationship (nesting, groups).

## The Invariant Mapping (Drafting)

We are looking for the "structural necessities" of a graph engine:

1.  **Logical State**: The source of truth for "what exists".
2.  **Transformation Matrix**: The "where am I looking" state.
3.  **Handle Registry**: The "where can I connect" database.
4.  **Routing Engine**: The "how do I get from A to B" geometry.

## Discovery: The Reconciliation Engine (INV-01 Pivot)

Initially, I hypothesized a generic `Map`-based Graph Store. This was a "guess" and a violation of the **Mastery Workflow**.

**Direct Extraction Discovery**: 
After diving into `packages/react/src/utils/changes.ts`, I discovered that the core essence of `xyflow` is its **Change Reconciliation Engine**. 

### Key Insights:
- **It's an Array, not a Map**: `xyflow` keeps nodes in an array and reconciles them.
- **Reference Stability is King**: The logic is explicitly designed to avoid copying objects unless they change. This is the "L7" performance optimization.
- **Internal State vs User State**: The `InternalNode` mapping is where the "System Reality" (absolute positions, measured dimensions) is calculated.

**Action**: I have deleted the generic store and replaced it with a **Tiny Model** that implements the `applyNodeChanges` and `InternalNode` invariants. This is now a true deconstruction of the production code.

---

### Discovery: The Nesting DNA (INV-06)
Nested nodes aren't just "inside" a container; they exist in a relative coordinate space. 

**The Aha! Moment**: When a parent expands because a child is dragged to negative coordinates, the parent's `x, y` shift. To prevent the *other* children from jumping, the system must perform a **Relative Offset Compensation**. I've implemented this in the `inv06-nesting` Tiny Model.

**Status**: 6/12 Invariants Mastered.
- [x] INV-01: Graph Model
- [x] INV-02: Viewport Matrix
- [x] INV-03: Reactive Updates
- [x] INV-04: Handle Logic
- [x] INV-05: Coordinate Mapping
- [x] INV-06: Nesting/Layout

