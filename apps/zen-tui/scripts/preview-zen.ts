/**
 * Zen-TUI: Preview Script (Relative Path Version)
 * 
 * Demonstrates the Log View UI without alias-related loading issues.
 */

import { createZenLogView } from "../src/features/log/LogModule.zen.concept.js";
import { NativeZenRenderer, PaintCommand } from "../../src/shared/renderer.concept.js";

/**
 * Mock Native Renderer (Terminal Output)
 */
class MockNativeRenderer implements NativeZenRenderer {
  private buffer: string[][] = Array.from({ length: 25 }, () => Array(100).fill(' '));

  submitCommands(commands: PaintCommand[]) {
    // Clear buffer visually for each batch
    this.buffer = Array.from({ length: 25 }, () => Array(100).fill(' '));
    
    for (const cmd of commands) {
      if (cmd.type === 'text' && cmd.value) {
        const y = cmd.y;
        let x = cmd.x;
        for (const char of cmd.value) {
          if (this.buffer[y] && x < 100) {
            this.buffer[y][x] = char;
            x++;
          }
        }
      }
    }
  }

  flush() {
    process.stdout.write('\x1Bc'); // Clear terminal effectively
    console.log(this.buffer.map(line => line.join('')).join('\n'));
    console.log("\n--- [ ZEN-TUI GOD-MODE PREVIEW ] ---");
  }
}

// 1. Initialize Mock Native
const mockNative = new MockNativeRenderer();

// 2. Initialize the Zen View
const { select } = createZenLogView(mockNative);

// 3. Simulate high-speed reactivity
let i = 0;
// Populate mock data for the preview
import { createLogLogic } from "../src/features/log/LogModule.logic.concept.js";
// We cheat a bit for the preview by simulating state outside the engine
setInterval(() => {
    select(i % 5);
    i++;
}, 500);
