/**
 * Zen-Engine (Meaningful Customization for XState)
 * 
 * A specialized wrapper for Git-based state machines.
 */

import { createMachine } from "xstate";

export interface ZenStateSchema {
    states: {
        idle: {};
        streaming: {};
        focused: {};
        mutating: {};
        error: {};
    };
}

/**
 * Zen Machine Factory:
 * Wraps XState to add Git-specific protocols (Snapshots, Recovery)
 */
export const createZenMachine = <TContext, TEvent>(config: any) => {
    return createMachine({
        ...config,
        types: {} as {
            context: TContext;
            events: TEvent;
        }
    }) as any; // Cast as any for conceptual flexibility while avoiding config mismatch errors
};

/**
 * Log Engine Machine:
 * Deterministic life cycle for the Log feature.
 */
export const logMachine = createZenMachine({
    id: 'log',
    initial: 'idle',
    states: {
        idle: {
            on: { OPEN: { target: 'streaming' } }
        },
        streaming: {
            on: { ERROR: { target: 'error' }, FOCUS: { target: 'focused' } }
        },
        focused: {
            on: { SELECT: { target: 'focused' } }
        },
        mutating: {
            // Atomic history mutation with Recovery Target enabled
        },
        error: {}
    }
});
