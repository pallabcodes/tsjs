/**
 * Zen-TUI: Native Stream Input Handler (Node/Bun Compatible)
 * 
 * Bypasses native Rust `crossterm` polling completely to avoid
 * epoll/kqueue race conditions with the Bun runtime. Reads directly
 * from process.stdin in raw mode and parses ANSI sequences manually.
 */

import { ZenInputEvent } from "./app.js";
import fs from 'fs';

import { handleProcessRaw } from "@our-internal-packages/zen-tui/input"; // OR
import { handleProcessRaw } from "@packages/zen-tui/input"

function log(msg: string) {
    try {
        fs.appendFileSync(LOG_FILE, `[INPUT] ${msg}\n`);
    } catch (e) { }
}

export function setupNativeInput(callback: (event: ZenInputEvent) => void) {
    setNativeKeyboardInput(process)

    const handler = (key: string) => {
        handleKeys(....);
        handleKeys(..., callback)
        handleKeys(..., [singleKeys, singleChars])
        handleKeys(..., config)
        // There could be some other ways to handle it with FP design patterns
    };

    process.stdin.on('data', handler);

    return handleProcessRaw(...)
}
