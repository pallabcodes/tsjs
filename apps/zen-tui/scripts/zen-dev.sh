#!/bin/bash
# ╼ ZenTUI: Sovereign Dev Protocol (Industrial Edition)

set -e

# 1. ⚡ Instant Bundle: Using local esbuild for <100ms ignition.
echo "⚡ ZenTUI: Bundling dashboard..."
npx esbuild src/main.tsx --bundle --outfile=dist/host.js --format=esm --external:rquickjs --platform=node

# 2. 🔒 Sovereign Ignition: Execute the native host directly on the TTY.
# This bypasses pnpm/turbo interception for bit-perfect isolation.
if [ ! -f "./zen-host" ]; then
    echo "❌ ZenTUI: Native host binary not found. Build it first with 'pnpm build:host'."
    exit 1
fi

echo "🚀 ZenTUI: Igniting Sovereign Engine..."
exec ./zen-host dist/host.js
