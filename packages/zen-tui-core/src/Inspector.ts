import { ZenNode, ZenTextNode } from '@zen-tui/node';
import type { IZenBuffer } from '@zen-tui/painter';

/**
 * SovereignTarget: Universal Drawing Interface
 */
interface SovereignTarget {
  width: number;
  height: number;
  setCell(x: number, y: number, char: string, fg?: string, bg?: string, bold?: boolean, dim?: boolean): void;
}

/**
 * ZenInspector: Sovereign ASCII Layout Painter & Visualizer
 */
export class ZenInspector {
  /**
   * paintToBuffer: High-fidelity native terminal rendering
   */
  public static paintToBuffer(root: ZenNode, buffer: IZenBuffer) {
    const target: SovereignTarget = {
      width: buffer.get_width(),
      height: buffer.get_height(),
      setCell: (x, y, char, fg, bg, bold, dim) => {
        // IZenBuffer doesn't support dim directly in set_cell, so we might need to handle it or omit
        buffer.set_cell(x, y, char, fg, bg, bold);
      }
    };
    this.renderTree(root, target);
  }

  /**
   * visualize: string-based ASCII visualization (for verification)
   */
  public static visualize(root: ZenNode, width: number, height: number): string {
    type Cell = { c: string; fg?: string; bg?: string; bold?: boolean; dim?: boolean };
    const grid: Cell[][] = Array.from({ length: height }, () => 
      Array.from({ length: width }, () => ({ c: ' ', bg: '#0f172a' }))
    );

    const target: SovereignTarget = {
      width,
      height,
      setCell: (x, y, char, fg, bg, bold, dim) => {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const cell = grid[y][x];
           cell.c = char;
           if (fg) cell.fg = fg;
           if (bg) cell.bg = bg;
           if (bold) cell.bold = true;
           if (dim) cell.dim = true;
        }
      }
    };

    this.renderTree(root, target);

    // ── ANSI RENDERING ──
    const hexToFg = (hex?: string): string => {
      if (!hex || hex === "transparent") return "";
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `\x1b[38;2;${r};${g};${b}m`;
    };

    const hexToBg = (hex?: string): string => {
      if (!hex || hex === "transparent") return "";
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `\x1b[48;2;${r};${g};${b}m`;
    };

    let result = "";
    for (let y = 0; y < height; y++) {
      let currentFg = "";
      let currentBg = "";
      let currentBold = false;
      let currentDim = false;
      for (let x = 0; x < width; x++) {
        const cell = grid[y][x];
        const fg = hexToFg(cell.fg);
        const bg = hexToBg(cell.bg);
        
        if (cell.bold !== currentBold || cell.dim !== currentDim) {
           result += "\x1b[0m"; // Reset to apply new intensity
           if (cell.bold) result += "\x1b[1m";
           if (cell.dim) result += "\x1b[2m";
           currentBold = cell.bold || false;
           currentDim = cell.dim || false;
           currentFg = ""; currentBg = ""; // Force color re-apply after reset
        }

        if (bg !== currentBg) {
          result += bg || "\x1b[48;2;15;23;42m"; // Default Slate bg
          currentBg = bg || "default";
        }
        if (fg !== currentFg) {
          result += fg || "\x1b[39m";
          currentFg = fg || "default";
        }
        result += cell.c;
      }
      result += "\x1b[0m\n";
    }
    return result.trimEnd();
  }

  private static renderTree(root: ZenNode, target: SovereignTarget) {
    const bitGrid = Array.from({ length: target.height }, () => new Int8Array(target.width).fill(0));
    const textNodes: Array<{ node: ZenTextNode, x: number, y: number }> = [];

    const drawNode = (node: ZenNode | ZenTextNode, parentX: number = 0, parentY: number = 0) => {
      const fp = (node instanceof ZenNode) ? node.props?.fixedPosition : undefined;
      const absX = fp ? (parentX + fp.x) : (parentX + node.layout.x);
      const absY = fp ? (parentY + fp.y) : (parentY + node.layout.y);
      const w = fp ? fp.w : node.layout.width;
      const h = fp ? fp.h : node.layout.height;
      
      if (node instanceof ZenNode) {
        const props = node.props || {};

        if (props.bg && props.bg !== 'transparent') {
          for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
              target.setCell(Math.floor(absX + i), Math.floor(absY + j), ' ', undefined, props.bg);
            }
          }
        }

        if (props.border) {
          const x1 = Math.round(absX);
          const x2 = Math.round(absX + w - 1);
          const y1 = Math.round(absY);
          const y2 = Math.round(absY + h - 1);
          
          const BORDER_STYLES: any = {
            solid:   { 1: '╵', 2: '╶', 3: '└', 4: '╷', 5: '│', 6: '┌', 7: '├', 8: '╴', 9: '┘', 10: '─', 11: '┴', 12: '┐', 13: '┤', 14: '┬', 15: '┼' },
            rounded: { 1: '╵', 2: '╶', 3: '╰', 4: '╷', 5: '│', 6: '╭', 7: '├', 8: '╴', 9: '╯', 10: '─', 11: '┴', 12: '╮', 13: '┤', 14: '┬', 15: '┼' },
            thick:   { 1: '╹', 2: '╺', 3: '┗', 4: '╻', 5: '┃', 6: '┏', 7: '┣', 8: '╸', 9: '┛', 10: '━', 11: '┻', 12: '┓', 13: '┫', 14: '┳', 15: '╋' }
          };
          const CHAR_MAP = BORDER_STYLES[props.borderStyle as string] || BORDER_STYLES.solid;
          const borderFg = props.focused ? "#60a5fa" : (props.borderColor || "#3f3f46");

          const setBit = (gy: number, gx: number, mask: number) => {
            if (gx >= 0 && gx < target.width && gy >= 0 && gy < target.height) {
              bitGrid[gy][gx] |= mask;
              target.setCell(gx, gy, CHAR_MAP[bitGrid[gy][gx]] || ' ', borderFg);
            }
          };

          for (let i = 0; i < w; i++) {
            let mask = 0;
            if (i < w - 1) mask |= 2;
            if (i > 0) mask |= 8;
            setBit(y1, x1 + i, mask);
            setBit(y2, x1 + i, mask);
          }
          for (let j = 0; j < h; j++) {
            let mask = 0;
            if (j < h - 1) mask |= 4;
            if (j > 0) mask |= 1;
            setBit(y1 + j, x1, mask);
            setBit(y1 + j, x2, mask);
          }

          const tagProp = props.tag;
          if (tagProp && tagProp !== 'box' && tagProp !== 'text') {
            const label = ` ${tagProp} `;
            for (let i = 0; i < label.length; i++) {
              const gx = x1 + 2 + i;
              if (gx > x1 && gx < x2 && y1 >= 0 && y1 < target.height) {
                target.setCell(gx, y1, label[i], props.focused ? "#e4e4e7" : "#52525b");
                bitGrid[y1][gx] = 0;
              }
            }
          }
        }
        node.children.forEach((child: any) => drawNode(child, absX, absY));
      } else if (node instanceof ZenTextNode) {
        textNodes.push({ node, x: absX, y: absY });
      }
    };

    drawNode(root);

    for (const { node, x, y } of textNodes) {
      const text = node.text;
      const props = node.parent?.props || {};
      for (let i = 0; i < text.length; i++) {
        target.setCell(Math.floor(x + i), Math.floor(y), text[i], props.fg, props.bg, props.bold, props.dim);
      }
    }
  }
}
