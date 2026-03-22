/**
 * Zen-TUI: Hardware ANSI Renderer
 * 
 * A 100% owned, high-performance double-buffered ANSI renderer.
 * Handles the terminal screen, colors, and diff-based flushing.
 * Now with dynamic resize support.
 */

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
    this.current = Array.from({ length: this.height }, () => 
      Array.from({ length: this.width }, () => new ZenCell())
    );
    this.previous = Array.from({ length: this.height }, () => 
      Array.from({ length: this.width }, () => new ZenCell())
    );
  }

  public getSize() {
    const oldW = this.width;
    const oldH = this.height;
    this.updateSize();
    
    // Check if resize happened
    if (this.width !== oldW || this.height !== oldH) {
      this.initBuffers();
    }
    
    return { width: this.width, height: this.height };
  }

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

    for (let y = 0; y < this.height; y++) {
      const rowCurr = this.current[y];
      const rowPrev = this.previous[y];
      if (!rowCurr || !rowPrev) continue;

      for (let x = 0; x < this.width; x++) {
        const curr = rowCurr[x]!;
        const prev = rowPrev[x]!;

        if (curr.char !== prev.char || curr.style.fg !== prev.style.fg || curr.style.bg !== prev.style.bg || curr.style.bold !== prev.style.bold) {
          output += `\x1b[${y + 1};${x + 1}H`;
          
          const fg = curr.style.fg || '';
          if (fg !== lastFg) {
            if (fg) {
              output += `\x1b[38;2;${this.hexToRgb(fg)}m`;
            } else {
              output += `\x1b[39m`;
            }
            lastFg = fg;
          }

          // NEVER emit \x1b[49m. Always use explicit 24-bit bg.
          const bg = curr.style.bg || FALLBACK_BG;
          if (bg !== lastBg) {
            output += `\x1b[48;2;${this.hexToRgb(bg)}m`;
            lastBg = bg;
          }

          if (curr.style.bold && !lastBold) {
            output += `\x1b[1m`;
            lastBold = true;
          } else if (!curr.style.bold && lastBold) {
            output += `\x1b[22m`;
            lastBold = false;
          }
          
          output += curr.char;
          prev.char = curr.char;
          prev.style = { ...curr.style };
        }
      }
    }

    if (output.length > 0) {
      process.stdout.write(output);
    }
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
