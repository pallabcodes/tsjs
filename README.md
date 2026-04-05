# 🧱 ZenTUI: Sovereign TUI Dashboard

ZenTUI is a high-performance, bit-perfect TUI framework and git dashboard built with **Solid.js** and a **Native Rust Bridge**. It is designed for absolute immersion, zero-flash transitions, and industrial-grade stability.

## ⚡ Swift Ignition (Quickstart)

Assuming you have **Rust**, **Node.js**, and **pnpm** installed:

```bash
# 1. Clone the Sovereign Core
git clone https://github.com/pallabcodes/tsjs.git
cd tsjs

# 2. Seize the dependencies
pnpm install

# 3. Hardened Ignition (Build & Start)
./zen dev      # Full build + start sequence (Default)
./zen build    # Hardens the binary context (Fast-Path enabled)
./zen start    # Seizes the TTY and projects the TUI
```

## ⌨️ Shell Integration (Optional)

For rapid dashboard access, you can add an alias to your `.zshrc` or `.bashrc`:

```bash
# Industrial Shorthand
alias zen='./zen'

# Or use the absolute path for global access:
# alias zen='/path/to/zen' e.g. alias zen="/path/path/Downloads/tui/zen/"
```

## 🛠️ The zen Toolchain

The `zen` script is the sovereign driver of the ZenTUI environment:

- **`./zen dev`**: The primary entry point. Silently builds the native host and JS bundle, then ignites the TUI.
- **`./zen build`**: Hardens the binary context. Includes the **Fast-Path Checksum Gate**—subsequent builds take **<10ms** if no source changes are detected.
- **`./zen start`**: Seizes the hardware TTY and projects the TUI in the **Alternate Screen Buffer**.

## 🧬 Sovereign Architecture

- **High-Performance Binary Bridge**: Uses an atomic `Uint32Array` frame-buffer handoff to eliminate JS-to-Native context switching overhead.
- **Sovereign Pulse Synchronization**: Follows a strict `Clear -> Reconcile -> Flush` loop to ensure zero-flash, zero-ghost artifacts.
- **Absolute Scroll-Lock**: Automatically purges the terminal scrollback (`\x1b[3J`) and swaps into the alternate buffer for a professional dashboard experience.
- **Industrial Stability**: Hardened against macOS security policies and memory pressure through ad-hoc code signing and stack normalization.

## ╼ Environment Notes
- **macOS**: Ad-hoc code signing is performed automatically during the build phase.
- **Linux**: Standard binary execution; ensures raw mode and TTY parity.
