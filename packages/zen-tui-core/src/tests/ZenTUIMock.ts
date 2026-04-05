/**
 * ZenTUIMock: Headless Native Host Emulator
 * 
 * Provides a high-fidelity JS-only implementation of the __ZEN_HOST__ interface
 * for headless verification and snapshot testing.
 */
export class ZenTUIMock {
    public cells: Map<string, { char: string, fg?: string, bg?: string, bold?: boolean }> = new Map();
    public width: number = 100;
    public height: number = 40;
    public flushes: number = 0;

    constructor(width = 100, height = 40) {
        this.width = width;
        this.height = height;
    }

    getSize(): [number, number] {
        return [this.width, this.height];
    }

    setCell(x: number, y: number, char: string, fg?: string, bg?: string, bold?: boolean) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.cells.set(`${x},${y}`, { char, fg, bg, bold });
    }

    pollInput(): string | null {
        return null;
    }

    flush() {
        this.flushes++;
    }

    // --- Mock Data Providers ---
    getLog(limit: number): string { 
        return JSON.stringify([
            { hash: 'abc1234', message: 'feat: industrial engine ignite', author: 'Zen', date: '2026-04-03' },
            { hash: 'def5678', message: 'fix: sovereign core buffer overflow', author: 'Zen', date: '2026-04-02' },
            { hash: 'ghi9012', message: 'chore: clean up singleton crap', author: 'Zen', date: '2026-04-01' }
        ]);
    }
    
    getDiff(hash: string): string { return "Industrial Diff Data Projection..."; }
    
    getStatus(): string { 
        return JSON.stringify([
            'modified: packages/core/src/index.tsx',
            'deleted: old/singleton/crap.ts',
            'new: packages/node/src/registry.ts'
        ]);
    }
    
    getBranches(): string { return JSON.stringify(["main", "feat/sovereign-reform"]); }
    stageFile(path: string): void { console.log(`[ZenHost] Staged: ${path}`); }
    unstageFile(path: string): void { console.log(`[ZenHost] Unstaged: ${path}`); }
    commit(message: string): void { console.log(`[ZenHost] Committed: ${message}`); }
    exit(): void { console.log("[ZenHost] Termination Signal Received."); }

    // --- Test Utilities ---
    getCell(x: number, y: number) {
        return this.cells.get(`${x},${y}`);
    }

    /**
     * snapshot: Generates a text representation of a buffer region.
     */
    snapshot(x: number, y: number, w: number, h: number): string {
        let out = "";
        for (let cy = y; cy < y + h; cy++) {
            for (let cx = x; cx < x + w; cx++) {
                const cell = this.getCell(cx, cy);
                out += cell ? cell.char : " ";
            }
            if (cy < y + h - 1) out += "\n";
        }
        return out;
    }

    /**
     * dump: Visual Projection for Sovereign Verification
     */
    dump(): string {
        let out = `╼ Sovereign Buffer Dump (${this.width}x${this.height})\n`;
        out += "╭" + "─".repeat(this.width) + "╮\n";
        for (let y = 0; y < this.height; y++) {
            out += "│";
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                out += cell ? cell.char : " ";
            }
            out += "│\n";
        }
        out += "╰" + "─".repeat(this.width) + "╯\n";
        return out;
    }
}
