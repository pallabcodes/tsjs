/**
 * Zen-Renderer: Solid-js Driver (Concept)
 * 
 * Maps Solid's fine-grained signals to atomic "Paint" commands.
 */

import { createEffect, onCleanup } from "solid-js";

/**
 * The "Paint" instruction sent to the Rust buffer.
 */
export interface PaintCommand {
    type: 'text' | 'rect' | 'clear';
    x: number;
    y: number;
    value?: string;
    style?: {
        color?: string;
        bold?: boolean;
        italic?: boolean;
    };
}

/**
 * Zen-Renderer Interface (Native Bridge)
 */
export interface NativeZenRenderer {
    submitCommands(batch: PaintCommand[]): void;
    flush(): void;
}

/**
 * Create a reactive Zen Component.
 * Automatically tracks all signals inside the 'template' and pushes deltas.
 */
export function createZenComponent(native: NativeZenRenderer, template: () => PaintCommand[]) {
    // Solid's high-speed effect tracking
    createEffect(() => {
        const commands = template();
        native.submitCommands(commands);
        native.flush();
    });

    onCleanup(() => {
        // Clear the component's region on unmount
    });
}
