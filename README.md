# Sovereign Zen-TUI (Git TUI) ◉

A high-performance, topologically-accurate Git terminal user interface built with **SolidJS** and a **Native C++ / Rust Layout Engine**.

## ⧉ Windows Installation Guide

To build and run Sovereign Zen-TUI on a Windows machine, you need to set up the native build environment.

### 1. Requisite Toolchain

| Tool | Purpose | Installation |
| :--- | :--- | :--- |
| **Bun** | JS Runtime & Package Manager | `powershell -c "irm bun.sh/install.ps1 | iex"` |
| **Rust** | Native Layout & Painter Modules | [rustup.rs](https://rustup.rs/) (Stable) |
| **MSVC** | C++ Linker & Build Tools | [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) |
| **Git CLI** | Local Repository Bridge | [git-scm.com](https://git-scm.com/) |

> [!IMPORTANT]
> When installing **Visual Studio Build Tools**, ensure the **"Desktop development with C++"** workload is selected. This provides the necessary `cl.exe` and `link.exe` for the Windows-MSVC target.

### 2. Repository Setup

Clone the repository and install dependencies:

```powershell
# Install project dependencies (This also builds the Native Engine automatically)
pnpm install
```

> [!NOTE]
> The native modules (Core, Layout, Painter) are automatically compiled via a `postinstall` script. You do not need to build them manually.

### 3. Running the TUI

Once the installation is complete, you can start the TUI in development mode:

```powershell
# Start the Sovereign TUI
pnpm dev
```

### 4. Layout Verification (Audit)

To verify the layout engine without starting the full app, run:

```powershell
# Perform a visual audit of the layout tree
bun packages/zen-tui-core/src/layout-verify.ts
```

## ▟ Troubleshooting (Windows)

- **`cargo` not recognized**: Ensure `~\.cargo\bin` is in your system environment PATH.
- **`link.exe` not found**: You are missing the MSVC build tools. Re-run the Visual Studio Installer and add the C++ workload.
- **Empty Logs**: Ensure you are running the TUI within a valid Git repository root.

---
**SOVEREIGN | ZEN-TUI v1.0.0**
