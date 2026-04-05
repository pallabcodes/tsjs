/**
 * @zen-tui/core/engine: Pipeline Synchronization
 */
import { type ZenEngine } from '@zen-tui/node';
import { reconcile } from './reconciler';

let engine: ZenEngine;
let pending = false;
let frameCount = 0;

export function setEngine(e: ZenEngine) {
    engine = e;
}

export function getEngine(): ZenEngine {
    return engine;
}

export function requestFrame() {
    if (!pending) {
        pending = true;
        (globalThis as any).setTimeout(pulse, 16);
    }
}

/**
 * 🧱 Sovereign Heartbeat: 
 * Every pulse must be routed through the globally-seated Zen.pulse
 * to ensure Clear -> Reconcile -> Flush atomicity.
 */
export async function pulse() {
    pending = false;
    frameCount++;

    const ZenGlobal = (globalThis as any).Zen;
    if (ZenGlobal && ZenGlobal.pulse) {
        // Enforce the synchronized heartbeat sequence
        await ZenGlobal.pulse();
    } else {
        // Fallback for bootstrap phase or standalone tests
        if (engine) {
            engine.painter.clear();
            reconcile(engine.root, engine);
            engine.painter.flush();
        }
    }
}

export function startPipeline() {
    // Pipeline ignition seated.
}

export function getFrameCount() {
    return frameCount;
}
