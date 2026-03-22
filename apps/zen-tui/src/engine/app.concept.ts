/**
 * Zen-TUI: Engine Orchestration (Full Control Edition)
 * 
 * Connects the renderer, Rust layout, and SolidJS reactive tree.
 * Updated for the Sovereign Architecture.
 * 
 * My feedback: although these are suggestions, but moving everything to separate caueses extra stack frame which causes memory so we need to be attentive to that too
 */

import { ZenRenderer } from './hardware.js';
import { ZenNode, ZenTextNode } from './node.js';
import { ZenLayoutEngine, IZenLayoutEngine } from './native.js';
import { setupNativeInput } from './input.js';
import fs from 'fs';

// this interface is fine
export interface ZenInputEvent {
    name: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
}

// however since in the most of places we use function so we should use function but if using class helps strucutally then i.e. fine too 
// but that only means we could not do below implemantion with usual funciton compoentnes or such i.e. weird
export class ZenApp {
    public renderer: ZenRenderer;
    public root: ZenNode;
    public onInput?: (event: ZenInputEvent) => void;
    private layout: IZenLayoutEngine;
    private nodeMap = new Map<number, ZenNode | ZenTextNode>();
    private cleanupInput?: () => void;

    constructor() {
        this.renderer = new ZenRenderer();
        this.layout = new ZenLayoutEngine();

        // Industrial root node
        this.root = new ZenNode('box', { width: '100%', height: '100%' });

        this.setup();
    }

    private setup() {
        // so i see here we have sequential works so we can do through compose, steps etc.

        // 1. enterAltScreen()
        // 2. hideCursor()
        // 3. setupNativeInput()
        // 4. run()
        // 5. process.on('SIGINT', () => this.destroy());
        // 6. process.on('exit', () => this.destroy());

        // N.B: so, we can use adequate function design patterns to solve this thus write one-liner

        this.doAllZenSetup();
        this.run();

        process.on('SIGINT', () => this.destroy());
        process.on('exit', () => this.destroy());

    }

    public run() {
        setInterval(() => {
            const { width: termW, height: termH } = this.renderer.getSize();

            // const MIN_W = 40;
            // const MIN_H = 10;
            // const isTooSmall = termW < MIN_W || termH < MIN_H;

            // with knowing deault MIN_W, MIN_H we don't even need above three varaibles
            if (handleLayout(..., warnUserIfWindowTooSmall)) {
                return;
            }

            // STATE CLEAN: Fresh layout every frame (Zero-Ghost-Node Architecture)

            // this.handler(this.root, termW, termH);

            // this.handler(..., callback)

            // or we could handle it other way with different FP design patterns

        }, 32);
    }

    private handleInput(event: ZenInputEvent) {
        if (event.name === 'q' || (event.name === 'c' && event.ctrl)) {
            this.destroy();
        }
    }

    private syncLayoutTree(node: ZenNode | ZenTextNode) {
        const parseSize = (val: any) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string' && val.endsWith('%')) {
                return -parseFloat(val); // Hack: pass negative numbers to represent percentages in Rust
            }
            return null;
        };

        if (node instanceof ZenNode) {
            const { style, bp, px, pTop, pBottom, pLeft, pRight, gap } = handleNodeStyle(node);
            node.nativeId = handleNativeNode(...)
        } else if (node instanceof ZenTextNode) {
            node.nativeId = handleNativeTextNode(...)
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

        // below can be improved/fixed with adquate FP Design patterns

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

        // below can be improved/fixed with adquate FP Design patterns

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
