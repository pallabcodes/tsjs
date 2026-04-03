# ZenTUI: Definitive Product Architecture (V8)

This is the **ZenTUI Source of Truth** for the ZenTUI architecture. It matures the project from "using a library" to "owning a product interface." We use a simplified, layered approach that prioritizes readability, strict typing, and high-performance terminal rendering.

---

## 🏛️ 1. Layered Product Architecture

ZenTUI is organized into 5 definitive layers, each with a single, clear responsibility.

| Layer | Directory | Responsibility |
| :--- | :--- | :--- |
| **Model** | `@zen-tui/node` | **The Core Contract**: Definitive types for `ZenNode`, `ZenProps`, and Native `ZenPainter` interfaces. No logic, only structural finality. |
| **Engine** | `@zen-tui/core/engine` | **The ZenTUI Core**: Reconciler, Pipeline, Compositor, and **ZenTUI Reactivity (`Zen.signal`, `Zen.effect`)**. |
| **UI Elements** | `@zen-tui/core/ui` | **The Primitives**: Basic building blocks like `Box`, `Text`, and `Layout`. Zero business logic. |
| **Components** | `@zen-tui/core/components` | **The Experience Layer**: High-level Git-specific components like `App`, `Status`, `Commit.Graph`, and `Diff.View`. |
| **Application** | `apps/zen-tui` | **The Product Layer**: Final assembly of business state, feature-specific logic, and the `Zen.ignite` bootstrapper. |

---

## 🚀 2. ZenTUI Entry Point (`Zen.ignite`)

We meaningfully clean the application entrance by encapsulating infrastructure noise (terminal resets, lifecycle signals, rendering pipelines) into a single, product-first call.

```typescript
// apps/zen-tui/src/init.ts
import { Zen } from '@zentui/core';
import AppRoot from './app/App';

Zen.ignite(AppRoot);
```

---

## 🏗️ 3. Structural Workflow

We define a clear, readable folder structure so that any engineer can follow the flow from entry to final cell rendering.

```text
apps/zen-tui/src/
├── init.ts             # 1. Entry Point: ZenTUI Zen.ignite
├── app/                # 2. Product Layer: Business State & Features
│   ├── App.tsx         # Root View Component (High-Fidelity)
│   ├── state/          # Global Reactive State (ZenStore.ts)
│   └── features/       # Collocated Features (UI + Logic + Types)
├── engine/             # 3. Integration Layer: Bridge to Native
│   └── painter.ts      # Mapping RUC nodes to Native cells
```

---

## 🛡️ 4. Industrial Verification

Everything is unit and integration testable before terminal execution:

1.  **Static Tree Verification**: Assert that the output `ZenNode` tree reflects the correct structure and properties (`bun test src/tests/StaticTree.test.tsx`).
2.  **Environment ZenTUIty**: Using `--conditions=browser` ensures that the universal reactivity system is consistently used across tests and production.
3.  **Absolute Zero-Any Policy**: Enforced by strict TypeScript generics across all model and property layers.

---

## 🎨 5. Product DX (Pure JSX)

Target DX is a declarative, composable API without any `@jsx` directives or fragile imports.

```tsx
import { App, Layout, Commit, Diff, Status } from '@zentui/core';

export default function AppRoot() {
  return (
    <App.Container>
      <Layout.Grid cols={[1, 3]}>
        <Layout.Pane title="History">
          <Commit.Graph commits={state.commits()} />
        </Layout.Pane>
        <Layout.Pane title="Inspection">
          <Diff.View content={state.selectedDiff()} />
        </Layout.Pane>
      </Layout.Grid>
    </App.Container>
  );
}
```
