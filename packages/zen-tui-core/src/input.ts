/**
 * Zen-TUI: Native Stream Input Handler (Node/Bun Compatible)
 * 
 * Bypasses native Rust `crossterm` polling completely to avoid
 * epoll/kqueue race conditions with the Bun runtime. Reads directly
 * from process.stdin in raw mode and parses ANSI sequences manually.
 */

import { ZenInputEvent } from "./app.js";
import fs from 'fs';

const LOG_FILE = '/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/zen-input.log';
function log(msg: string) { 
  try {
    fs.appendFileSync(LOG_FILE, `[INPUT] ${msg}\n`); 
  } catch (e) {}
}

export function setupNativeInput(callback: (event: ZenInputEvent) => void) {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
  }

  const handler = (key: string) => {
    log(`RAW: ${JSON.stringify(key)} (len=${key.length}, code=${key.charCodeAt(0)})`);

    // Basic keys
    if (key === '\u0003') { log('MATCH: ctrl+c'); return callback({ name: "c", ctrl: true, alt: false, shift: false }); }
    if (key === '\r' || key === '\n') { log('MATCH: return'); return callback({ name: "return", ctrl: false, alt: false, shift: false }); }
    if (key === '\u001b') { log('MATCH: escape'); return callback({ name: "escape", ctrl: false, alt: false, shift: false }); }
    if (key === '\x7f' || key === '\b') { log('MATCH: backspace'); return callback({ name: "backspace", ctrl: false, alt: false, shift: false }); }
    if (key === '\t') { log('MATCH: tab'); return callback({ name: "tab", ctrl: false, alt: false, shift: false }); }
    if (key === ' ') { log('MATCH: space'); return callback({ name: "space", ctrl: false, alt: false, shift: false }); }

    // Arrow keys (ANSI Escapes)
    if (key === '\u001b[A') { log('MATCH: up'); return callback({ name: "up", ctrl: false, alt: false, shift: false }); }
    if (key === '\u001b[B') { log('MATCH: down'); return callback({ name: "down", ctrl: false, alt: false, shift: false }); }
    if (key === '\u001b[C') { log('MATCH: right'); return callback({ name: "right", ctrl: false, alt: false, shift: false }); }
    if (key === '\u001b[D') { log('MATCH: left'); return callback({ name: "left", ctrl: false, alt: false, shift: false }); }

    // Single chars
    if (key.length === 1) {
      const isUpper = key >= 'A' && key <= 'Z';
      log(`MATCH: char=${key}`);
      return callback({ name: key, ctrl: false, alt: false, shift: isUpper });
    }

    // Ctrl+Char (1-26 mapped to ^A-^Z)
    const charCode = key.charCodeAt(0);
    if (key.length === 1 && charCode >= 1 && charCode <= 26) {
      const char = String.fromCharCode(charCode + 96); // 1 = a, 2 = b, 3 = c
      log(`MATCH: ctrl+${char}`);
      return callback({ name: char, ctrl: true, alt: false, shift: false });
    }
  };

  process.stdin.on('data', handler);

  return () => {
    process.stdin.removeListener('data', handler);
    process.stdin.pause();
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  };
}
