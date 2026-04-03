/**
 * @zen-tui/core: ZenTUI Core Foundation (Sovereign Edition)
 * 
 * The Unified Source of Truth for the ZenTUI framework.
 * Focus: Type Safety, Industrial Precision, and Native Portability.
 */
/// <reference path="./jsx.d.ts" />

import {
    type ZenNode,
    type ZenProps,
    type ZenNodeType,
    registry,
    type ZenPainter,
    type ZenEngine,
    type CommitData
} from '@zen-tui/node';

import { Zen as ZenReactivity, createRoot, useContext } from './engine/reactivity';
import { render, createComponent } from './engine/universal';
import { setEngine, startPipeline, requestFrame } from './engine/pipeline';
import { Theme } from './engine/theme';

/**
 * ZenHost: The Industrial Bridge Interface
 * 
 * Defines the contract between the JS Engine and the Sovereign Host (Rust/Mock).
 */
export interface ZenHost {
    getSize(): [number, number];
    setCell(x: number, y: number, char: string, fg?: string, bg?: string, bold?: boolean): void;
    flush(): void;
    
    // Git Domain Methods
    getLog(limit: number): string;
    getStatus(): string;
    getBranches(): string;
    getDiff(hash: string): string;
    stageFile(path: string): void;
    unstageFile(path: string): void;
    commit(message: string): void;
    exit(): void;
}

// ╼ Scoped Engine State
let _currentHost: ZenHost | null = null;
let _inputListener: ((key: string) => void) | null = null;
let _disposer: (() => void) | null = null;

const timers: { cb: () => void, ms: number, last: number }[] = [];
const timeouts: { cb: () => void, ms: number, start: number }[] = [];

/**
 * 🧱 ZenFramework: The Industrial Lifecycle Contract
 */
export interface ZenFramework {
    ignite(AppRoot: () => JSX.Element, host: ZenHost, headless?: boolean): void;
    terminate(): void;
    pulse(force?: boolean): Promise<void>;
    dispatchInput(evStr: string): void;
    createRoot<T>(fn: (dispose: () => void) => T): T;
    render(code: () => any, element: ZenNode): () => void;
    createZenInput(): { startPolling(callback: (event: string) => void): void };
    StoreContext: any;
    [key: string]: any; // Allow reactivity primitives from ZenReactivity
}

/**
 * 🧱 Zen: ZenTUI Reactivity & Lifecycle Namespace
 */
// ╼ Canonical Re-exports
export {
    createSignal,
    createEffect,
    createMemo,
    createResource,
    onMount,
    onCleanup,
    useContext,
    createContext,
    batch,
    untrack,
    splitProps,
    Show,
    For,
    Index,
    Switch,
    Match,
    Suspense
} from './engine/reactivity';

export const Zen: ZenFramework = {
    ...ZenReactivity,
    createRoot,
    render,

    // ╼ Industrial Context (Global Sovereign Anchor)
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

        if (!_currentHost) {
            throw new Error("[ZenSovereign] Ignite Failure: No host bridge detected.");
        }
        
        const [w, h] = _currentHost.getSize();
        registry.root.props.width = w;
        registry.root.props.height = h;

        // ╼ Native Lifecycle Hook Exposure (Protocol Alignment)
        (globalThis as any).__ZENTUI_TICK = () => Zen.pulse(true);
        (globalThis as any).__ZENTUI_INPUT_CALLBACK = (evStr: string) => Zen.dispatchInput(evStr);

        const tickLoop = (force: boolean = false) => {
            const now = Date.now();
            
            // Pulse Intervals
            for (let i = 0; i < timers.length; i++) {
                const t = timers[i];
                if (t && (force || now - t.last >= t.ms)) {
                    t.cb();
                    t.last = now;
                }
            }
 
            // Pulse Timeouts
            for (let i = 0; i < timeouts.length; i++) {
                const t = timeouts[i];
                if (t && (force || now - t.start >= t.ms)) {
                    t.cb();
                    timeouts[i] = null as any;
                }
            }
        };

        // ╼ Sovereign Polyfills (Scoped to the host environment)
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

        // ╼ Zenith Projection (Universal Reconciler Anchor)
        (globalThis as any).window = globalThis;
        (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
            const id = timers.length;
            timers.push({ 
                cb: () => cb(Date.now()), 
                ms: 16, 
                last: Date.now() 
            });
            return id;
        };
        (globalThis as any).cancelAnimationFrame = (id: number) => {
            if (timers[id]) (timers as any)[id] = null;
        };

        // ╼ Sovereign Painters (Native Projection)
        const painter: ZenPainter = {
            clear: () => {}, 
            flush: () => _currentHost!.flush(),
            getWidth: () => _currentHost!.getSize()[0],
            getHeight: () => _currentHost!.getSize()[1],
            drawText: (x, y, text, fg, bg, bold) => {
                for (let i = 0; i < text.length; i++) {
                    _currentHost!.setCell(x + i, y, text[i], fg, bg, bold);
                }
            },
            fillRect: (x, y, w, h, bg) => {
                for (let cy = y; cy < y + h; cy++) {
                    for (let cx = x; cx < x + w; cx++) {
                        _currentHost!.setCell(cx, cy, ' ', undefined, bg, false);
                    }
                }
            },
            drawBorder: (x, y, w, h, fg, style) => {
                if (w <= 1 || h <= 1) return;
                const chars = style === 'rounded' ? '─│╭╮╰╯' : '─│┌┐└┘';
                const right_x = Math.max(0, x + w - 1);
                const bottom_y = Math.max(0, y + h - 1);
                for (let cx = x + 1; cx < right_x; cx++) {
                    _currentHost!.setCell(cx, y, chars[0], fg, undefined, false);
                    _currentHost!.setCell(cx, bottom_y, chars[0], fg, undefined, false);
                }
                for (let cy = y + 1; cy < bottom_y; cy++) {
                    _currentHost!.setCell(x, cy, chars[1], fg, undefined, false);
                    _currentHost!.setCell(right_x, cy, chars[1], fg, undefined, false);
                }
                _currentHost!.setCell(x, y, chars[2], fg, undefined, false);
                _currentHost!.setCell(right_x, y, chars[3], fg, undefined, false);
                _currentHost!.setCell(x, bottom_y, chars[4], fg, undefined, false);
                _currentHost!.setCell(right_x, bottom_y, chars[5], fg, undefined, false);
            }
        };

        const engine = { root: registry.root, painter };
        setEngine(engine);

        // ╼ Aggressive Ignition Clear (Override Shell Clutter)
        painter.fillRect(0, 0, w, h, Theme.Colors.Background);
        painter.flush();

        createRoot((dispose) => {
            _disposer = dispose;
            render(() => createComponent(AppRoot, {}), engine.root);
        });
        startPipeline();

        // ╼ High-Priority Init Frame
        requestFrame();

        // ╼ Lifecycle Synchronization
        Zen.pulse = (force: boolean = false) => {
            tickLoop(force);
            return Promise.resolve().then(() => {}); 
        };

        if (headless) {
            // Initial Pulse for Headless Mode
            Zen.pulse(true);
            return;
        }
    },

    terminate() {
        if (_disposer) _disposer();
        _disposer = null;
        _currentHost = null;
        _inputListener = null;
        
        // ╼ Sovereign Registry Purge
        registry.clear();
    },

    dispatchInput(evStr: string) {
        const ev = JSON.parse(evStr);
        if (ev.name === 'resize') requestFrame();
        if (_inputListener) _inputListener(ev.name);
    },

    createZenInput() {
        return {
            startPolling: (callback: (event: string) => void) => {
                _inputListener = callback;
            }
        };
    },

    pulse: () => Promise.resolve(), // Initial value, overridden in ignite
};

/**
 * createZenInput: Reactive Input Allocation
 */
export function createZenInput() {
    return {
        startPolling: (callback: (event: string) => void) => {
            _inputListener = callback;
        }
    };
}

/**
 * GitProvider: Sovereign Repository Access
 */
export const GitProvider = {
    getCommitLog: (limit = 50) => {
        if (!_currentHost) return [];
        try { return JSON.parse(_currentHost.getLog(limit)); } catch(e) { return []; }
    },
    getStatus: () => {
        if (!_currentHost) return [];
        try { return JSON.parse(_currentHost.getStatus()); } catch(e) { return []; }
    },
    getBranches: () => {
        if (!_currentHost) return [];
        try { return JSON.parse(_currentHost.getBranches()); } catch(e) { return []; }
    },
    getCommitDiff: (hash: string) => {
        if (!_currentHost) return "";
        try { return _currentHost.getDiff(hash); } catch(e) { return ""; }
    },
    stageFile: (path: string) => { if (_currentHost) _currentHost.stageFile(path); },
    unstageFile: (path: string) => { if (_currentHost) _currentHost.unstageFile(path); },
    commit: (message: string) => { if (_currentHost) _currentHost.commit(message); },
    exit: () => { if (_currentHost) _currentHost.exit(); }
};

export type { ZenNode, ZenProps, ZenNodeType, CommitData, ZenPainter, ZenEngine } from '@zen-tui/node';

// --- Re-exports ---
export * from './engine/layout';
export * from './engine/index';
export * from './ui/index';
export * from './components/index';
