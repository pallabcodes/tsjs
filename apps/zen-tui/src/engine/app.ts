/**
 * Zen-TUI: Engine Orchestration (Full Control Edition)
 * 
 * Connects the renderer, Rust layout, and SolidJS reactive tree.
 * Updated for the Sovereign Architecture.
 */

import { ZenRenderer } from './hardware.js';
import { ZenNode, ZenTextNode } from './node.js';
import { ZenLayoutEngine, ZenInput, IZenLayoutEngine, IZenInput } from './native.js';

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
  private layout: IZenLayoutEngine;
  private input: IZenInput;
  private nodeMap = new Map<number, ZenNode | ZenTextNode>();

  constructor() {
    this.renderer = new ZenRenderer();
    this.layout = new ZenLayoutEngine();
    this.input = new ZenInput();

    // Industrial root node
    this.root = new ZenNode('box', { width: '100%', height: '100%' });

    this.setup();
  }

  private setup() {
    this.renderer.enterAltScreen();
    this.renderer.hideCursor();

    this.run(); // Call the new run method

    process.on('SIGINT', () => this.destroy());
    process.on('exit', () => this.destroy());
  }

  public run() {
    setInterval(() => {
      const { width: termW, height: termH } = this.renderer.getSize();
      const isTooSmall = termW < 80 || termH < 20;

      // 1. Process Input
      const eventJson = this.input.pollEvent(16);
      if (eventJson) {
        try {
          const event = JSON.parse(eventJson) as ZenInputEvent;
          this.handleInput(event);
          if (this.onInput) this.onInput(event);
        } catch (e) {
          // Silent fail
        }
      }

      // 2. Compute Layout (Rust Taffy)
      if (isTooSmall) {
        // Render Safety View (Industrial Shield)
        this.renderer.clear();
        const msg = ` TERMINAL_SIZE_ERROR: MIN (80x20) REQ: CUR (${termW}x${termH}) `;
        this.renderer.paint(Math.floor((termW - msg.length) / 2), Math.floor(termH / 2), msg, { bg: "#FF5252", fg: "#FFFFFF", bold: true });
        this.renderer.flush();
        return;
      }

      // STATE CLEAN: Fresh layout every frame (Zero-Ghost-Node Architecture)
      this.layout = new ZenLayoutEngine();
      this.nodeMap.clear();

      this.syncLayoutTree(this.root);
      const results = this.layout.computeLayout(this.root.nativeId!, termW, termH);
      this.applyLayout(results);

      // 3. Paint (Double Buffered)
      this.renderer.clear();
      this.paintNode(this.root, 0, 0);
      this.renderer.flush();
    }, 32);
  }

  private handleInput(event: ZenInputEvent) {
    if (event.name === 'q' || (event.name === 'c' && event.ctrl)) {
      this.destroy();
    }
  }

  private syncLayoutTree(node: ZenNode | ZenTextNode) {
    const { width: termW, height: termH } = this.renderer.getSize();

    const parseSize = (val: any, max: number) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string' && val.endsWith('%')) {
        return Math.floor((parseFloat(val) / 100) * max);
      }
      return null;
    };

    if (node instanceof ZenNode) {
      const style = node.props;
      const padding = typeof style.padding === 'number' ? style.padding : 0;
      const borderPadding = style.border ? 1 : 0;

      node.nativeId = this.layout.createNode(
        style.flexDirection || "column",
        parseSize(style.width, termW),
        parseSize(style.height, termH),
        style.flexGrow ?? 0,
        padding + borderPadding,
        style.gap ?? 0
      );
      this.nodeMap.set(node.nativeId!, node);

      if (node.parent && node.parent.nativeId) {
        this.layout.addChild(node.parent.nativeId, node.nativeId);
      }

      for (const child of node.children) {
        this.syncLayoutTree(child);
      }
    } else if (node instanceof ZenTextNode) {
      // MEASURE & REVEAL: Text nodes are layout leaves
      node.nativeId = this.layout.createNode(
        "row",
        node.text.length,
        1,
        0,
        0,
        0
      );
      this.nodeMap.set(node.nativeId!, node);

      if (node.parent && node.parent.nativeId) {
        this.layout.addChild(node.parent.nativeId, node.nativeId);
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
    const { x: relX, y: relY, width, height } = node.layout;
    const x = relX + absX;
    const y = relY + absY;
    const currentClip = clip || { x: 0, y: 0, w: this.renderer.getSize().width, h: this.renderer.getSize().height };

    if (node instanceof ZenTextNode) {
      this.paintText(x, y, node.text, node.parent?.props || {}, currentClip);
      return;
    }

    if (node instanceof ZenNode) {
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
      paintSafe(ix + i, iy, "═");
      paintSafe(ix + i, iy + ih - 1, "═");
    }
    for (let i = 1; i < ih - 1; i++) {
      paintSafe(ix, iy + i, "║");
      paintSafe(ix + iw - 1, iy + i, "║");
    }
    paintSafe(ix, iy, "╔");
    paintSafe(ix + iw - 1, iy, "╗");
    paintSafe(ix, iy + ih - 1, "╚");
    paintSafe(ix + iw - 1, iy + ih - 1, "╝");
  }

  public destroy() {
    this.renderer.showCursor();
    this.renderer.exitAltScreen();
    process.exit(0);
  }
}
