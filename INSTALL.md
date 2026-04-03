# 🛠️ ZenTUI: Industrial Setup Guide

Follow these steps to configure the ZenTUI development environment on any Unix-like system (Linux, macOS, WSL).

## 1. Prerequisites

Ensure the following toolchains are installed on your system:

- **Rust (Cargo)**: Required for the native rendering engine. [Install Rust](https://rustup.rs/)
- **Node.js (LTS)**: JavaScript runtime.
- **pnpm**: Fast, disk space efficient package manager. `npm i -g pnpm`
- **Bun**: Required for the high-performance test runner. `curl -fsSL https://bun.sh/install | bash`
- **C++ Toolchain**: `gcc` or `clang` for N-API native bindings.

## 2. Installation

Clone the repository and install all monorepo dependencies:

```bash
pnpm install
```

## 3. Native Core Compilation

ZenTUI uses a high-performance Rust backend. You must compile the native bridge before running the app:

```bash
cd packages/zen-tui-native
pnpm run build
```

*Note: This uses `@napi-rs/cli` to generate optimized binaries for your specific architecture.*

## 4. Development

To launch the ZenTUI application in development mode (HMR enabled):

```bash
cd apps/zen-tui
pnpm run dev
```

## 5. Verification & Testing

ZenTUI uses Bun for industrial-grade unit and integration testing:

```bash
# Run all core and app tests
bun test
```

---

## 🏗️ Monorepo Structure

- `apps/zen-tui`: The main Git TUI application (SolidJS).
- `packages/zen-tui-core`: The framework reconciler and layout engine.
- `packages/zen-tui-native`: The Rust-powered rendering backend.
- `packages/zen-tui-node`: Shared product models and data types.
