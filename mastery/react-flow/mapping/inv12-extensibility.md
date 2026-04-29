# INV-12: Extensibility — xyflow Mapping

## Purpose
Map the architecture for custom node/edge types and plugin integration.

## Key Discovery: The Lookup Invariant
ReactFlow's extensibility is deceptively simple. It doesn't use a complex plugin registry. Instead, it uses **Direct Component Mapping**. The user provides a dictionary of types (`nodeTypes`), and the system performs a constant-time lookup during the render loop.

## Production Source Mapping

### 1. Component Resolution
- **File**: `packages/react/src/components/NodeWrapper/index.tsx`
- **Logic**: 
    ```ts
    let NodeComponent = nodeTypes?.[nodeType] || builtinNodeTypes[nodeType];
    ```
- **Insight**: This allows users to override builtin types (like 'default') by simply providing their own version in the `nodeTypes` prop.

### 2. Plugin Integration (Context Consumers)
- **Example**: `MiniMap` or `Controls`.
- **Logic**: Plugins are React components that use `useStore` to access the shared graph state.
- **Insight**: Because the state is centralized in a Zustand store, any component placed inside the `ReactFlowProvider` can function as a "Plugin" without any explicit registration.

## The Extensibility DNA (The Essence)
1.  **Registry via Props**: Using a plain object to map strings to components.
2.  **Hook-first Plugins**: Leveraging shared state hooks to create decoupled extensions.
3.  **Graceful Fallback**: Reverting to a known 'default' type when a custom type is missing.

## Comparison Table

| Aspect | Super Tiny Version | xyflow Production |
|--------|-------------------|-------------------|
| Custom Types | Object Lookup | Object Lookup |
| Plugin System | Shared Store | Hook-based Store Access |
| Built-ins | Hardcoded Map | Modular `builtinNodeTypes` |

## Gaps to Close
- [ ] Implement a `resolveComponent` utility with fallback logic.
