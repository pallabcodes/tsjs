# 🧬 ZenTUI Contributing (Sovereign Engineering)

ZenTUI is an industrial-grade TUI engine. To maintain its bit-perfect stability, please adhere to our architectural constraints.

## 🧱 The Sovereign Reconciler (Force-Bake)

Every pulse in ZenTUI must follow the strict **Clear -> Reconcile -> Flush** sequence. 

- **Clear**: The native frame-buffer is wiped. 
- **Reconcile**: The UI tree is traversed via `reconciler.ts`, which invokes `syncNativeNode()` for every component. This re-projects the binary atoms into the freshly cleared buffer, eradicating ghost text.
- **Flush**: The bit-perfect buffer is committed to the hardware TTY. 

## ⚡ Fast-Path Fingerprinting 

The toolchain uses a mathematical fingerprint (MD5/SHA of source directories) located in `.zen_cache`. 

- To bypass build checks: Run `./zen dev`. If no files have changed, the TUI ignites in **<10ms**.
- To force a rebuild: Run `./zen build --force`.

## ╼ Codebase Hygiene

- **`apps/zentui-host`**: Native Rust core (Bin). Seizes the hardware TTY and provides the JS runtime.
- **`packages/zen-tui-native`**: Terminal drawer (Lib). Provides Alternate Screen and bitwise primitives. 
- **`packages/zen-tui-core`**: The engine (Pipeline, Layout, Theme).
- **`apps/zen-tui`**: The Sovereign UI Application (Solid.js).

## ╼ macOS Hardening 

The native host requires ad-hoc code signing for local execution on arm64 (M1/M2/M3). The `zen` script handles this via `codesign -s - --force`. Do not remove this pass.
