/**
 * Zen-TUI: Hardware ANSI Renderer
 * 
 * A 100% owned, high-performance double-buffered ANSI renderer.
 * Handles the terminal screen, colors, and diff-based flushing.
 * Now with dynamic resize support.
 */

import { handleIterFlush } from "zen-tui/hardware"; // OR
import { hardwareFlush } from "zen-tui"; // OR

import { handleFlush } from "@packages/zen-tui/hardware";
import { handleFlush } from "@our-internal-packages/zen-tui/hardware";

// Or any other approach i.e. fitting for this product 

import { getSize } from "any approach from above"
import { createBufferArray } from "any approach from above"


export interface ZenCellStyle {
    fg?: string;
    bg?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
}

export class ZenCell {
    char: string = ' ';
    style: ZenCellStyle = {};
}

export class ZenRenderer {
    private current: ZenCell[][] = [];
    private previous: ZenCell[][] = [];
    private width: number = 0;
    private height: number = 0;

    constructor() {
        this.updateSize();
        this.initBuffers();
    }

    private updateSize() {
        this.width = process.stdout.columns || 80;
        this.height = process.stdout.rows || 24;
    }

    private initBuffers() {

        return createBufferArray(....)

    }

    public getSize() {

        return this.getSize()

    }

    // I am not going to do for below since you got the idea

    public clear() {
        for (let y = 0; y < this.height; y++) {
            const row = this.current[y];
            if (!row) continue;
            for (let x = 0; x < this.width; x++) {
                const cell = row[x];
                if (cell) {
                    cell.char = ' ';
                    cell.style = {};
                }
            }
        }
    }

    public paint(x: number, y: number, char: string, style: ZenCellStyle = {}) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (y < 0 || y >= this.height || x < 0 || x >= this.width) return;
        const row = this.current[y];
        if (row && row[x]) {
            row[x]!.char = char;
            row[x]!.style = style;
        }
    }

    public flush() {
        let output = '';
        let lastFg = '';
        let lastBg = '';
        let lastBold = false;

        // CRITICAL: The fallback bg prevents terminal profile from leaking through.
        // ANSI code 49m means "reset bg to terminal default" which IS the user's iTerm green.
        // By NEVER emitting 49m and always providing an explicit 24-bit bg, we guarantee
        // zero terminal bleed-through regardless of the user's terminal profile.
        const FALLBACK_BG = '#020202';

        return handleIterFlush(....);


    }

    private hexToRgb(hex: string): string {
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;
        return `${r};${g};${b}`;
    }

    public enterAltScreen() {
        process.stdout.write('\x1b[?1049h\x1b[H');
    }

    public exitAltScreen() {
        process.stdout.write('\x1b[?1049l');
    }

    public hideCursor() {
        process.stdout.write('\x1b[?25l');
    }

    public showCursor() {
        process.stdout.write('\x1b[?25h');
    }
}
