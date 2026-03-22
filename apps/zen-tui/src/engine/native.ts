/**
 * Zen-TUI: Native Bridge
 * 
 * Loads the Rust-compiled N-API module with strict typing.
 */

import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const NATIVE_PATH = join(__dirname, './native.node');

export interface IZenLayoutEngine {
  new (): IZenLayoutEngine;
  createNode(
    flexDirection: string,
    width: number | null,
    height: number | null,
    flexGrow: number,
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number,
    gap: number
  ): number;
  addChild(parent: number, child: number): void;
  computeLayout(root: number, width: number, height: number): number[];
}

export interface IZenInput {
  new (): IZenInput;
  pollEvent(timeout: number): string | null;
}

interface NativeModule {
  ZenLayoutEngine: IZenLayoutEngine;
  ZenInput: IZenInput;
  zenTest: () => string;
}

let native: NativeModule;

try {
  native = require(NATIVE_PATH);
} catch (e) {
  console.error("Failed to load native ZenEngine binary at:", NATIVE_PATH);
  console.error(e);
  process.exit(1);
}

export const { ZenLayoutEngine, ZenInput, zenTest } = native;

if (zenTest() !== "ZEN_OK") {
  throw new Error("Native ZenEngine link verification failed!");
}
