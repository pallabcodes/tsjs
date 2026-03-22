/**
 * Zen-TUI: Engine Orchestration (Full Control Edition)
 * 
 * Connects the renderer, Rust layout, and SolidJS reactive tree.
 * Updated for the Sovereign Architecture.
 */

import { ZenRenderer } from './hardware.js';
import { ZenNode, ZenTextNode } from './node.js';
import { ZenLayoutEngine, IZenLayoutEngine } from './native.js';
import { setupNativeInput } from './input.js';
import { setLayoutEngine } from '@zen-tui/solid';
import fs from 'fs';

export interface ZenInputEvent {
  name: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
}

export class ZenApp {
  public renderer: ZenRenderer;
  public root: ZenNode;
  public onInput?: (event: ZenInputEvent) => void;
  public layout: IZenLayoutEngine;
  public activeFocusId: number | null = null;
  public focusableNodes: number[] = [];
  private nodeMap = new Map<number, ZenNode | ZenTextNode>();
  private cleanupInput?: () => void;

  constructor() {
    this.renderer = new ZenRenderer();
    this.layout = new ZenLayoutEngine();
    
    // Wire up Incremental Reconciler pushes
    setLayoutEngine(this.layout);

    // Industrial root node
    this.root = new ZenNode('box', { width: '100%', height: '100%' });
    
    // Create native node for root manually as boot strap
    this.root.nativeId = this.layout.createNode("column", -100, -100, 0, 0, 0, 0, 0, 0, null, null, null, null, null);
    this.nodeMap.set(this.root.nativeId!, this.root);

    this.setup();
  }

  private setup() {
    this.renderer.enterAltScreen();
    this.renderer.hideCursor();

    this.cleanupInput = setupNativeInput((event) => {
      fs.appendFileSync('/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/zen-input.log', `[ENGINE] EVENT: ${event.name}\n`);
      this.handleInput(event);
      if (this.onInput) this.onInput(event);
    });

    this.run(); // Call the new run method

    process.on('SIGINT', () => this.destroy());
    process.on('exit', () => this.destroy());
  }

  public run() {
    setInterval(() => {
      const { width: termW, height: termH } = this.renderer.getSize();
      
      const MIN_W = 40;
      const MIN_H = 10;
      const isTooSmall = termW < MIN_W || termH < MIN_H;

      if (isTooSmall) {
        this.renderer.clear();
        const msg = ` RESIZE WINDOW (MIN ${MIN_W}x${MIN_H}) `;
        this.renderer.paint(
          Math.floor((termW - msg.length) / 2),
          Math.floor(termH / 2),
          msg,
          { fg: "#f87171", bg: "#000000", bold: true }
        );
        this.renderer.flush();
        return;
      }

      // INCREMENTAL SYNC: Just refresh nodeMap pointers, do not recreate Rust nodes
      this.nodeMap.clear();
      this.focusableNodes = []; // Reset on frame pass
      this.syncLayoutTree(this.root);

      fs.appendFileSync('zen-verify.log', `[LAYOUT] Frame root children: ${this.root.children.length}\n`);
      const results = this.layout.computeLayout(this.root.nativeId!, termW, termH);
      this.applyLayout(results);

      // 3. Paint (Double Buffered)
      this.renderer.clear();

      const rootBg = (this.root.props as any).bg || '#020202';
      for (let py = 0; py < termH; py++) {
        for (let px = 0; px < termW; px++) {
          this.renderer.paint(px, py, ' ', { bg: rootBg });
        }
      }

      this.paintNode(this.root, 0, 0);
      this.renderer.flush();
    }, 32);
  }

  private handleInput(event: ZenInputEvent) {
    if (event.name === 'q' || (event.name === 'c' && event.ctrl)) {
      this.destroy();
    }

    if (event.name === 'tab') {
      if (this.focusableNodes.length === 0) return;
      const currentIndex = this.activeFocusId ? this.focusableNodes.indexOf(this.activeFocusId) : -1;
      const nextIndex = (currentIndex + 1) % this.focusableNodes.length;
      this.activeFocusId = this.focusableNodes[nextIndex]!;
      
      for (const id of this.focusableNodes) {
         const n = this.nodeMap.get(id);
         if (n instanceof ZenNode) {
            n.props.focused = (id === this.activeFocusId);
         }
      }
    }

    if (this.activeFocusId) {
      const node = this.nodeMap.get(this.activeFocusId);
      if (node instanceof ZenNode && node.tag === 'input') {
         if (event.name === 'return' && node.props.onSubmit) {
            node.props.onSubmit((node.props as any).value || "");
         } else if (event.name === 'backspace') {
            const v = (node.props as any).value || "";
            (node.props as any).value = v.slice(0, -1);
         } else if (event.name.length === 1) {
            (node.props as any).value = ((node.props as any).value || "") + event.name;
         }
      }
    }
  }

  private syncLayoutTree(node: ZenNode | ZenTextNode) {
    if (node.nativeId) {
      this.nodeMap.set(node.nativeId, node);
      if (node instanceof ZenNode && (node.tag === 'input' || node.props.onSubmit)) {
         this.focusableNodes.push(node.nativeId);
         if (!this.activeFocusId) this.activeFocusId = node.nativeId; // Auto-focus first input
      }
    }
    
    if (node instanceof ZenNode) {
      for (const child of node.children) {
        this.syncLayoutTree(child);
      }
    }
  }

  private applyLayout(results: number[]) {
    for (let i = 0; i < results.length; i += 5) {
      const id = results[i]!;
      const node = this.nodeMap.get(id);
      if (node) {
        node.layout = {
          x: results[i + 1]!,
          y: results[i + 2]!,
          width: results[i + 3]!,
          height: results[i + 4]!,
        };
      }
    }
  }

  private paintNode(node: ZenNode | ZenTextNode, absX: number, absY: number, clip?: { x: number, y: number, w: number, h: number }) {
    let { x: relX, y: relY, width, height } = node.layout;
    
    if (node instanceof ZenNode && node.props.fixedPosition) {
      const { x: fx, y: fy, w: fw, h: fh } = node.props.fixedPosition;
      relX = fx ?? relX;
      relY = fy ?? relY;
      width = fw ?? width;
      height = fh ?? height;
    }

    const x = relX + absX;
    const y = relY + absY;
    const currentClip = clip || { x: 0, y: 0, w: this.renderer.getSize().width, h: this.renderer.getSize().height };

    if (node instanceof ZenTextNode) {
      this.paintText(x, y, node.text, node.parent?.props || {}, currentClip);
      return;
    }

    if (node instanceof ZenNode) {
      if (node.tag === 'input') {
         const val = (node.props as any).value || "";
         const ph = node.props.placeholder || "";
         const text = val ? val : ph;
         const fg = val ? "#ffffff" : "#555555";
         this.paintText(x, y, text, { ...node.props, fg }, currentClip);
         
         if (node.props.focused) {
            this.renderer.paint(x + text.length, y, '█', { fg: "#ffffff" });
         }
         return;
      }

      if (node.props.bg) {
        this.fillRect(x, y, width, height, node.props.bg, currentClip);
      }

      if (node.props.border) {
        this.drawBorder(x, y, width, height, node.props.borderColor, currentClip);
      }

      const borderSize = node.props.border ? 1 : 0;
      const innerClip = {
        x: Math.max(currentClip.x, Math.floor(x + borderSize)),
        y: Math.max(currentClip.y, Math.floor(y + borderSize)),
        w: Math.max(0, Math.min(currentClip.w, Math.floor(width - (borderSize * 2)))),
        h: Math.max(0, Math.min(currentClip.h, Math.floor(height - (borderSize * 2))))
      };

      for (const child of node.children) {
        this.paintNode(child, x, y, innerClip);
      }
    }
  }

  private paintText(x: number, y: number, text: string, style: any, clip: any) {
    for (let i = 0; i < text.length; i++) {
      const cx = Math.floor(x + i);
      const cy = Math.floor(y);
      if (cx >= clip.x && cx < clip.x + clip.w && cy >= clip.y && cy < clip.y + clip.h) {
        this.renderer.paint(cx, cy, text[i]!, style);
      }
    }
  }

  private fillRect(x: number, y: number, w: number, h: number, bg: string, clip: any) {
    const ix = Math.floor(x), iy = Math.floor(y), iw = Math.floor(w), ih = Math.floor(h);
    for (let dy = 0; dy < ih; dy++) {
      for (let dx = 0; dx < iw; dx++) {
        const cx = ix + dx;
        const cy = iy + dy;
        if (cx >= clip.x && cx < clip.x + clip.w && cy >= clip.y && cy < clip.y + clip.h) {
          this.renderer.paint(cx, cy, ' ', { bg });
        }
      }
    }
  }

  private drawBorder(x: number, y: number, w: number, h: number, color?: string, clip?: any) {
    const style = { fg: color || "#203243" };
    const ix = Math.floor(x), iy = Math.floor(y), iw = Math.floor(w), ih = Math.floor(h);
    if (iw <= 1 || ih <= 1) return;

    const paintSafe = (px: number, py: number, char: string) => {
       if (px >= clip.x && px < clip.x + clip.w && py >= clip.y && py < clip.y + clip.h) {
          this.renderer.paint(px, py, char, style);
       }
    };

    for (let i = 1; i < iw - 1; i++) {
      paintSafe(ix + i, iy, "─");
      paintSafe(ix + i, iy + ih - 1, "─");
    }
    for (let i = 1; i < ih - 1; i++) {
      paintSafe(ix, iy + i, "│");
      paintSafe(ix + iw - 1, iy + i, "│");
    }
    paintSafe(ix, iy, "╭");
    paintSafe(ix + iw - 1, iy, "╮");
    paintSafe(ix, iy + ih - 1, "╰");
    paintSafe(ix + iw - 1, iy + ih - 1, "╯");
  }

  public destroy() {
    this.renderer.showCursor();
    this.renderer.exitAltScreen();
    this.cleanupInput?.();
    process.exit(0);
  }
}
