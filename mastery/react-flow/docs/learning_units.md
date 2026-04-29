# 🎫 Learning Units: ReactFlow Mastery (Invariant-Sequential)

Work these units in order. Each unit builds upon the understanding and codebase of the previous one.

---

## INV-01: Graph State Model (Nodes & Edges)

- [x] **LU-01.1**: Define the core `Node` and `Edge` types and create a simple `Store` (using Zustand or similar) to manage them.
    - **DoD**: Store supports `addNode`, `addEdge`, and `updateNodePosition` with basic validation.
- [ ] **LU-01.2**: Implement a `useGraph` hook that provides access to the state.
    - **DoD**: Component can subscribe to specific node changes without re-rendering the whole graph.
- [x] **LU-01.3**: Map to xyflow — locate where `xyflow` defines its core types and store.
    - **DoD**: Written comparison in `mapping/inv01-model.md`.

## INV-02: Viewport Transformation

- [ ] **LU-02.1**: Implement a `Zoom/Pan` math module that calculates the `transform` string for a CSS container.
    - **DoD**: Correctly calculates (x, y, zoom) based on wheel and drag events.
- [x] **LU-02.2**: Implement "Zoom towards mouse" logic.
    - **DoD**: The point under the cursor stays fixed during zoom.
- [x] **LU-02.3**: Map to xyflow — locate the viewport management logic (d3-zoom or custom).
    - **DoD**: Written analysis in `mapping/inv02-viewport.md`.

## INV-03: Reactive Updates

- [ ] **LU-03.1**: Create a rendering loop that updates node positions at 60fps during a drag.
    - **DoD**: Smooth movement without jank; store is updated efficiently.
- [x] **LU-03.2**: Map to xyflow — analyze how `xyflow` batches updates to avoid React render bottlenecks.
    - **DoD**: Documentation in `mapping/inv03-reactivity.md`.

## INV-04: Handle & Connection Logic

- [ ] **LU-04.1**: Implement a `Handle` component that registers its absolute position in the store.
    - **DoD**: Handle coordinates update when the parent node moves.
- [ ] **LU-04.2**: Implement a "Connection Line" that follows the mouse when dragging from a handle.
    - **DoD**: Line snaps to valid target handles within a radius.

## INV-05: Coordinate Projection

- [x] **LU-05.1**: Implement `project` and `unproject` functions that account for the current zoom/pan.
    - **DoD**: Mouse coordinates in the browser correctly map to node positions in the canvas.

## INV-06–12: (Defining after INV-01–05 are complete)

Subsequent units will cover:
- Path algorithms (Bézier curves)
- Sub-flows and grouping
- Selection logic and collision detection
- Virtualization for large graphs
- Extension API
