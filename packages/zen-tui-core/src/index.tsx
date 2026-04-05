/**
 * @zen-tui/core: ZenTUI Core Foundation (Hardened Edition)
 */
/// <reference path="./jsx.d.ts" />

import {
    type ZenNode,
    registry,
    type ZenPainter,
    type ZenEngine
} from '@zen-tui/node';

import { Zen as ZenReactivity, createRoot, createSignal, batch } from './engine/reactivity';
import { render, createComponent } from './engine/universal';
import { setEngine, startPipeline, requestFrame } from './engine/pipeline';
import { Theme } from './engine/theme';

export interface ZenHost {
    getSize(): [number, number];
    commitFrame(buffer: ArrayBuffer): void;
    pollInput(): string | null;
    getLog(limit: number): string;
    getStatus(): string;
    getBranches(): string;
    getDiff(hash: string): string;
    exit(): void;
}

// ╼ Global Preamble: Sovereign Lifecycle Clocks
const timers: { cb: () => void, ms: number, last: number }[] = [];
const timeouts: { cb: () => void, ms: number, start: number }[] = [];

// [INDUSTRIAL] Polfilling the browser-like environment for Solid.js reactivity
(globalThis as any).window = globalThis;
(globalThis as any).setInterval = (cb: () => void, ms: number) => {
    const id = timers.length;
    timers.push({ cb, ms, last: Date.now() });
    return id;
};
(globalThis as any).clearInterval = (id: number) => {
    if (timers[id]) (timers as any)[id] = null;
};
(globalThis as any).setTimeout = (cb: () => void, ms: number) => {
    const id = timeouts.length;
    timeouts.push({ cb, ms, start: Date.now() });
    return id;
};
(globalThis as any).clearTimeout = (id: number) => {
    if (timeouts[id]) (timeouts as any)[id] = null;
};
(globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    const id = timers.length;
    timers.push({ cb: () => cb(Date.now()), ms: 16, last: Date.now() });
    return id;
};

let _currentHost: ZenHost | null = null;
let _inputListener: ((key: string) => void) | null = null;
let _disposer: (() => void) | null = null;
let _internalPainter: ZenPainter | null = null;

// [REACTIVE] Viewport Dimensions
const [_width, _setWidth] = createSignal(0);
const [_height, _setHeight] = createSignal(0);

// [MEMORY] Triple-Buffer Alignment (12-byte per cell)
let _contentBuffer: Uint32Array | null = null;
let _fgBuffer: Uint32Array | null = null;
let _bgBuffer: Uint32Array | null = null;
let _rawBuffer: ArrayBuffer | null = null;
let _lockedW = 0;
let _lockedH = 0;

export interface ZenFramework {
    ignite(AppRoot: () => JSX.Element, host: ZenHost, headless?: boolean): void;
    terminate(): void;
    pulse(force?: boolean): Promise<void>;
    dispatchInput(evStr: string): void;
    createRoot<T>(fn: (dispose: () => void) => T): T;
    render(code: () => any, element: ZenNode): () => void;
    createZenInput(): { startPolling(callback: (event: string) => void): void };
    StoreContext: any;
    [key: string]: any;
}

export {
    createSignal, createEffect, createMemo, createResource, onMount, onCleanup, useContext, createContext, batch, untrack, splitProps, Show, For, Index, Switch, Match, Suspense
} from './engine/reactivity';

export const Zen: ZenFramework = {
    ...ZenReactivity,
    createRoot,
    render,

    StoreContext: (() => {
        const key = Symbol.for("__ZENTUI_STORE_CONTEXT__");
        const globalStore = (globalThis as any);
        if (!globalStore[key]) globalStore[key] = ZenReactivity.createContext<any>(null);
        return globalStore[key];
    })(),

    ignite(AppRoot: () => JSX.Element, host?: ZenHost, headless: boolean = false) {
        // [INDUSTRIAL] The Native Host binary exposes itself as __ZEN_HOST__ in the JS environment
        _currentHost = host || (globalThis as any).__ZEN_HOST__;
        if (!_currentHost) throw new Error("[ZenTUI] Ignite Failure: No host bridge detected.");

        const [w, h] = _currentHost.getSize();
        
        batch(() => {
            _setWidth(w); _setHeight(h);
            registry.root.props.width = w;
            registry.root.props.height = h;
            allocate(w, h);
        });

        // [BRIDGE] Assigning high-performance callbacks that the Native Host will invoke per frame/input
        (globalThis as any).__ZENTUI_TICK = () => Zen.pulse(true);
        (globalThis as any).__ZENTUI_INPUT_CALLBACK = (evStr: string) => Zen.dispatchInput(evStr);

        const tickLoop = (force: boolean = false) => {
            const now = Date.now();
            for (let i = 0; i < timers.length; i++) {
                const t = timers[i];
                if (t && (force || now - t.last >= t.ms)) { t.cb(); t.last = now; }
            }
            for (let i = 0; i < timeouts.length; i++) {
                const t = timeouts[i];
                if (t && (force || now - t.start >= t.ms)) { t.cb(); timeouts[i] = null as any; }
            }
        };

        const painter: ZenPainter = {
            clear: () => { 
                if (!_contentBuffer || !_fgBuffer || !_bgBuffer) return;
                const bgRGB = getRGB(Theme.Colors.Background);
                _contentBuffer.fill(32); _fgBuffer.fill(bgRGB); _bgBuffer.fill(bgRGB);
            },
            flush: () => { if (_rawBuffer && _currentHost) _currentHost.commitFrame(_rawBuffer); },
            getWidth: () => _width(),
            getHeight: () => _height(),
            drawText: (x, y, text, fg, bg, bold, width) => {
                if (!_contentBuffer) return;
                const limit = width !== undefined ? Math.min(text.length, width) : text.length;
                const fgRGB = getRGB(fg || Theme.Colors.TextMain);
                for (let i = 0; i < limit; i++) {
                    const idx = (y * _lockedW) + (x + i);
                    if (idx < _contentBuffer.length) {
                        _contentBuffer[idx] = (text.charCodeAt(i) & 0x1FFFFF) | (bold ? 0x80000000 : 0);
                        if (_fgBuffer) _fgBuffer[idx] = fgRGB;
                        if (bg && _bgBuffer) _bgBuffer[idx] = getRGB(bg);
                    }
                }
            },
            fillRect: (x, y, width, height, bg) => {
                if (!_contentBuffer) return;
                const bgRGB = getRGB(bg);
                for (let cy = y; cy < y + height; cy++) {
                    for (let cx = x; cx < x + width; cx++) {
                        const idx = (cy * _lockedW) + cx;
                        if (idx < _contentBuffer.length) {
                            _contentBuffer[idx] = 32;
                            // [INDUSTRIAL] Only update background if not transparent
                            if (bgRGB !== 0xFF000000 && _bgBuffer) _bgBuffer[idx] = bgRGB;
                        }
                    }
                }
            },
            drawBorder: (x, y, width, height, fg, style) => {
                if (width <= 1 || height <= 1 || !_contentBuffer) return;
                const chars = style === 'rounded' ? '─│╭╮╰╯' : '─│┌┐└┘';
                const fgRGB = getRGB(fg || Theme.Colors.Border);
                const rx = Math.max(0, x + width - 1);
                const by = Math.max(0, y + height - 1);
                const write = (cx: number, cy: number, c: string) => {
                    const idx = cy * _lockedW + cx;
                    if (idx < _contentBuffer!.length) {
                         _contentBuffer![idx] = c.charCodeAt(0) & 0x1FFFFF;
                         if (_fgBuffer) _fgBuffer[idx] = fgRGB;
                    }
                };
                for (let cx = x + 1; cx < rx; cx++) { write(cx, y, chars[0]); write(cx, by, chars[0]); }
                for (let cy = y + 1; cy < by; cy++) { write(x, cy, chars[1]); write(rx, cy, chars[1]); }
                write(x, y, chars[2]); write(rx, y, chars[3]); write(x, by, chars[4]); write(rx, by, chars[5]);
            }
        };

        _internalPainter = painter;
        const engine = { root: registry.root, painter };
        setEngine(engine);
        painter.clear();

        createRoot((dispose) => {
            _disposer = dispose;
            render(() => createComponent(AppRoot, {}), engine.root);
        });
        startPipeline();
        requestFrame();
        
        Zen.pulse = (force: boolean = false) => { 
            tickLoop(force); painter.flush();
            return Promise.resolve(); 
        };
        if (headless) Zen.pulse(true);
    },

    terminate() {
        if (_disposer) _disposer();
        _disposer = null; _currentHost = null; _inputListener = null; _internalPainter = null;
        registry.clear();
    },

    dispatchInput(evStr: string) {
        const ev = JSON.parse(evStr);
        if (ev.name === 'resize') {
            const w = ev.width || 0;
            const h = ev.height || 0;
            if (w > 0 && h > 0 && (w !== _lockedW || h !== _lockedH)) {
                batch(() => {
                    _setWidth(w); _setHeight(h);
                    allocate(w, h);
                });
                if (_internalPainter) _internalPainter.clear();
                requestFrame();
            }
        }
        if (_inputListener) _inputListener(ev.name);
    },

    createZenInput() { return { startPolling: (cb: (e: string) => void) => { _inputListener = cb; } }; },
    pulse: () => Promise.resolve(),
};

/**
 * 🧱 Buffer Locked Allocation
 * Ensures memory-bound dimensions are used for indexing
 */
function allocate(w: number, h: number) {
    const size = w * h;
    _rawBuffer = new ArrayBuffer(size * 12);
    _contentBuffer = new Uint32Array(_rawBuffer, 0, size);
    _fgBuffer = new Uint32Array(_rawBuffer, size * 4, size);
    _bgBuffer = new Uint32Array(_rawBuffer, size * 8, size);
    _lockedW = w; _lockedH = h;
}

function getRGB(c: string | undefined): number {
    // [INDUSTRIAL] Return Transparency Token (0xFF000000) for null, undefined, or 'transparent'
    if (!c || c === 'transparent') return 0xFF000000;
    if (c.startsWith('#')) return parseInt(c.slice(1), 16);
    const colors: Record<string, number> = {
        black: 0x000000, red: 0xFF0000, green: 0x00FF00, yellow: 0xFFFF00,
        blue: 0x0000FF, magenta: 0xFF00FF, cyan: 0x00FFFF, white: 0xFFFFFF,
        grey: 0x808080, gray: 0x808080, transparent: 0xFF000000
    };
    const color = colors[c.toLowerCase()];
    return color !== undefined ? color : 0xFF000000;
}

export const GitProvider = {
    getCommitLog: (limit = 50) => { if (!_currentHost) return []; try { return JSON.parse(_currentHost.getLog(limit)); } catch(e) { return []; } },
    getStatus: () => { if (!_currentHost) return []; try { return JSON.parse(_currentHost.getStatus()); } catch(e) { return []; } },
    getBranches: () => { if (!_currentHost) return []; try { return JSON.parse(_currentHost.getBranches()); } catch(e) { return []; } },
    getCommitDiff: (hash: string) => { if (!_currentHost) return ""; try { return _currentHost.getDiff(hash); } catch(e) { return ""; } },
    exit: () => { if (_currentHost) _currentHost.exit(); }
};

export type { ZenNode, ZenProps, ZenNodeType, CommitData, ZenPainter, ZenEngine } from '@zen-tui/node';
export * from './engine/layout';
export * from './engine/index';
export * from './ui/index';
export * from './components/index';
export * from './components/index';
