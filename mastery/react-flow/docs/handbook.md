# 🕸️ ReactFlow Mastery Handbook: The Graph Invariants

> **"A node-based editor is a reactive system that maps a logical graph (nodes and edges) 
> to a zoomable, interactive coordinate space, maintaining spatial consistency 
> across high-frequency mutations."**

This handbook defines the **12 Universal Invariants** of a production-grade node-based UI engine. 
These principles apply whether you are using ReactFlow, SvelteFlow, LiteGraph, or building a custom engine.

> [!IMPORTANT]
> **Invariants describe the PROBLEM, not the solution.**
> "Bézier Curve" is NOT an invariant — "Edge Path Routing" IS.
> "Zustand" is NOT an invariant — "Synchronized Graph State" IS.
> "SVG" is NOT an invariant — "Spatial Rendering Pipeline" IS.

---

## The Reactive Graph Loop

Unlike standard UI components, a graph engine must reconcile a logical model with a physical coordinate space:

```text
        ┌──────────┐
        │  Store   │ ← Invariant 01 (Logical Model)
        └────┬─────┘
             ↓
     ┌────────────────┐
     │ Transformation  │ ← Invariant 02 (Viewport Matrix)
     └───────┬────────┘
             ↓
    ┌─────────────────┐
    │ Spatial Indexing │ ← Invariant 03 (Efficient Lookup)
    └──┬────┬────┬────┘
       ↓    ↓    ↓
   Collision Handle Edge Routing ← Invariants 04, 05, 08
       ↓    ↓       ↓
       └──→ Reconciler ←──┘ ← Invariant 06
                ↓
         Interaction Layer ← Invariants 07, 10
                ↓
         Rendering Pipeline ← Invariant 09
                ↓
         Persistence ← Invariant 11
                ↓
         Extensibility ← Invariant 12
```

---

## 🧱 The 12 Universal Invariants

### INV-01: Graph Model & Reconciliation
> The system maintains a logical set of nodes/edges and reconciles state changes via a stream of discrete events.
- **Data Split**: Separates `Node` (User state) from `InternalNode` (Calculated system state).
- **Change Stream**: Mutations are not direct but flow through `NodeChange` objects.
- **Reference Stability**: The reconciliation algorithm MUST preserve object references for unchanged items to prevent unnecessary UI re-renders.
- **Invariant**: Every mutation MUST result in a new array, but individual node references only change if the node itself was mutated.

### INV-02: Viewport Transformation (The Infinite Canvas)
> The system maps a normalized coordinate space to a viewable area via a transformation matrix (Zoom, Pan).
- Supports translation (x, y) and scale (k).
- **Invariant**: Zooming must center on a specific point (e.g., mouse cursor) by adjusting both scale and translation.

### INV-03: Reactive Synchronization
> Changes in graph state must propagate to the UI without losing spatial or selection consistency.
- High-frequency updates (dragging) vs. batch updates.
- Decoupling state changes from render cycles where necessary.

### INV-04: Handle & Port Logic
> Nodes interact via discrete connection points (Handles).
- Handles have types (source/target), positions, and validation rules.
- **Invariant**: An edge can only originate from a source handle and end at a target handle.

### INV-05: Coordinate Projection
> The system provides bidirectional mapping between screen space (pixels) and canvas space (units).
- `project(pixelX, pixelY) -> canvasX, canvasY`
- `unproject(canvasX, canvasY) -> pixelX, pixelY`
- Essential for dragging, selection boxes, and context menus.

### INV-06: Layout Constraints & Nesting
> The engine supports spatial hierarchies and alignment rules.
- Parent/child relationships (Sub-flows).
- Relative vs. Absolute positioning within groups.

### INV-07: Interaction Control Plane
> User gestures (drag, select, scroll) are translated into graph mutations.
- Multi-selection logic.
- Snap-to-grid.
- Interaction inhibitors (e.g., "readonly" mode).

### INV-08: Edge Path Routing
> The visual connection between handles follows a calculated geometric path.
- Path algorithms: Linear, Bézier, Step, Smoothstep.
- **Invariant**: The path must dynamically update when either the source or target node moves.

### INV-09: Spatial Rendering Pipeline
> The hybrid mix of DOM elements (Nodes) and SVG elements (Edges) is orchestrated as a single view.
- Layering (Z-index management).
- Virtualization of off-screen nodes/edges for performance.

### INV-10: Collision & Intersection Detection
> The system detects overlaps between nodes, selection boxes, and edges.
- Used for marquee selection and "magnetic" handles.

### INV-11: Serialization & Persistence
> The graph state can be snapshot into a portable format (JSON) and restored exactly.
- Handling of ephemeral state vs. persistent state.

### INV-12: Component Extensibility
> The engine allows injecting custom logic and UI for nodes, edges, and UI overlays.
- Plugin architecture (MiniMap, Controls, Background).

---

## 🧭 Mastery Progress

| # | Invariant | Status |
|---|-----------|--------|
| 01 | Graph Model | `[x]` Complete |
| 02 | Viewport Matrix | `[x]` Complete |
| 03 | Reactive Updates | `[x]` Complete |
| 04 | Handle Logic | `[x]` Complete |
| 05 | Coordinate Mapping | `[x]` Complete |
| 06 | Nesting/Layout | `[x]` Complete |
| 07 | Interaction Plane | `[x]` Complete |
| 08 | Path Routing | `[x]` Complete |
| 09 | Rendering Pipeline | `[x]` Complete |
| 10 | Collision Detection | `[x]` Complete |
| 11 | Persistence | `[x]` Complete |
| 12 | Extensibility | `[x]` Complete |

## Phase 4: Dimensional Scaling (L7 Elevation)

| # | Invariant | Status |
|---|---|---|
| 13 | Worker Reconciliation | `[x]` Complete |
| 14 | Spatial Indexing | `[ ]` Not started |
| 15 | Hybrid Rendering | `[ ]` Not started |
