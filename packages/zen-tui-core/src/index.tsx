/**
 * @zen-tui/core: ZenTUI Core Foundation
 */
/// <reference path="./jsx.d.ts" />

import {
    type ZenNode,
    registry,
    type ZenPainter,
    type ZenEngine
} from '@zen-tui/node';

import { Zen as ZenReactivity, createRoot } from './engine/reactivity';
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

let _frameBuffer: Uint32Array | null = null;
let _currentW = 0;
let _currentH = 0;

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
        if (!globalStore[key]) {
            globalStore[key] = ZenReactivity.createContext<any>(null);
        }
        return globalStore[key];
    })(),

    ignite(AppRoot: () => JSX.Element, host?: ZenHost, headless: boolean = false) {
        _currentHost = host || (globalThis as any).__ZEN_HOST__;
        if (!_currentHost) throw new Error("[ZenTUI] Ignite Failure: No host bridge detected.");

        const [w, h] = _currentHost.getSize();
        _currentW = w; _currentH = h;
        _frameBuffer = new Uint32Array(w * h);

        registry.root.props.width = w;
        registry.root.props.height = h;

        (globalThis as any).__ZENTUI_TICK = () => Zen.pulse(true);
        (globalThis as any).__ZENTUI_INPUT_CALLBACK = (evStr: string) => Zen.dispatchInput(evStr);

        const tickLoop = (force: boolean = false) => {
            const now = Date.now();
            for (let i = 0; i < timers.length; i++) {
                const t = timers[i];
                if (t && (force || now - t.last >= t.ms)) {
                    t.cb(); t.last = now;
                }
            }
            for (let i = 0; i < timeouts.length; i++) {
                const t = timeouts[i];
                if (t && (force || now - t.start >= t.ms)) {
                    t.cb(); timeouts[i] = null as any;
                }
            }
        };

        const painter: ZenPainter = {
            clear: () => { if (_frameBuffer) _frameBuffer.fill(0); },
            flush: () => { if (_frameBuffer && _currentHost) _currentHost.commitFrame(_frameBuffer.buffer); },
            getWidth: () => _currentW,
            getHeight: () => _currentH,
            drawText: (x, y, text, fg, bg, bold, width) => {
                const limit = width !== undefined ? Math.min(text.length, width) : text.length;
                const palette = getPalette(fg, bg, bold);
                for (let i = 0; i < limit; i++) {
                    const idx = (y * _currentW) + (x + i);
                    if (_frameBuffer && idx < _frameBuffer.length) {
                        _frameBuffer[idx] = (text.charCodeAt(i) & 0x1FFFFF) | palette;
                    }
                }
            },
            fillRect: (x, y, width, height, bg) => {
                const palette = getPalette(undefined, bg, false);
                const spaceCode = (' '.charCodeAt(0) & 0x1FFFFF);
                for (let cy = y; cy < y + height; cy++) {
                    for (let cx = x; cx < x + width; cx++) {
                        const idx = (cy * _currentW) + cx;
                        if (_frameBuffer && idx < _frameBuffer.length) {
                            _frameBuffer[idx] = spaceCode | palette;
                        }
                    }
                }
            },
            drawBorder: (x, y, width, height, fg, style) => {
                if (width <= 1 || height <= 1) return;
                const chars = style === 'rounded' ? '─│╭╮╰╯' : '─│┌┐└┘';
                const palette = getPalette(fg, undefined, false);
                if (!_frameBuffer) return;
                const rx = Math.max(0, x + width - 1);
                const by = Math.max(0, y + height - 1);
                const pack = (c: string) => (c.charCodeAt(0) & 0x1FFFFF) | palette;
                for (let cx = x + 1; cx < rx; cx++) {
                    _frameBuffer[y * _currentW + cx] = pack(chars[0]);
                    _frameBuffer[by * _currentW + cx] = pack(chars[0]);
                }
                for (let cy = y + 1; cy < by; cy++) {
                    _frameBuffer[cy * _currentW + x] = pack(chars[1]);
                    _frameBuffer[cy * _currentW + rx] = pack(chars[1]);
                }
                _frameBuffer[y * _currentW + x] = pack(chars[2]);
                _frameBuffer[y * _currentW + rx] = pack(chars[3]);
                _frameBuffer[by * _currentW + x] = pack(chars[4]);
                _frameBuffer[by * _currentW + rx] = pack(chars[5]);
            }
        };

        const engine = { root: registry.root, painter };
        setEngine(engine);

        createRoot((dispose) => {
            _disposer = dispose;
            render(() => createComponent(AppRoot, {}), engine.root);
        });
        startPipeline();
        requestFrame();
        
        Zen.pulse = (force: boolean = false) => { 
            // 🧱 SOVEREIGN SYNC: Clear -> Tick -> Flush
            painter.clear();
            tickLoop(force); 
            painter.flush();
            return Promise.resolve(); 
        };
        
        if (headless) Zen.pulse(true);
    },

    terminate() {
        if (_disposer) _disposer();
        _disposer = null; _currentHost = null; _inputListener = null;
        registry.clear();
    },

    dispatchInput(evStr: string) {
        const ev = JSON.parse(evStr);
        if (ev.name === 'resize') {
            const w = ev.width || 0;
            const h = ev.height || 0;
            if (w > 0 && h > 0) {
                _currentW = w; _currentH = h;
                _frameBuffer = new Uint32Array(w * h);
                requestFrame();
            }
        }
        if (_inputListener) _inputListener(ev.name);
    },

    createZenInput() { return { startPolling: (cb: (e: string) => void) => { _inputListener = cb; } }; },
    pulse: () => Promise.resolve(),
};

function getPalette(fg?: string, bg?: string, bold?: boolean): number {
    const parse = (c: string | undefined) => {
        if (!c) return 0;
        const colors: Record<string, number> = { 
            black: 0, red: 1, green: 2, yellow: 3, blue: 4, magenta: 5, cyan: 6, white: 7, 
            grey: 8, gray: 8, darkgray: 9, darkgrey: 9, 
            darkred: 10, darkgreen: 11, darkyellow: 12, darkblue: 13, darkmagenta: 14, darkcyan: 15 
        };
        const normalized = c.toLowerCase().replace(/[^a-z]/g, '');
        return colors[normalized] || 0;
    };
    return (parse(fg) << 21) | (parse(bg) << 25) | ((bold ? 1 : 0) << 29);
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
