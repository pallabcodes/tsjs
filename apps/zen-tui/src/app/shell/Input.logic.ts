/**
 * Zen-TUI: Input Orchestrator (Solid-js)
 * 
 * Maps raw terminal keys to logical User Intents.
 */

import { ShellState } from "./Shell.logic.js";

/**
 * Global Keyboard Handler
 */
export const createInputOrchestrator = (
    state: ShellState,
    actions: {
        navigate: (f: any) => void,
        togglePalette: () => void,
        selectNext: () => void,
        selectPrev: () => void,
    }
) => {

    const handleKey = (key: string) => {
        // 1. Modal Context: Command Palette
        if (state.isPaletteOpen) {
            if (key === 'esc') return actions.togglePalette();
            // In a real app, we'd pass letters to state.palette.query
            return;
        }

        // 2. Navigation Context
        switch (key) {
            case 'j':
            case 'down':
                actions.selectNext();
                break;
            case 'k':
            case 'up':
                actions.selectPrev();
                break;
            case '/':
                actions.togglePalette();
                break;
            case 'l':
                actions.navigate('log');
                break;
            case 's':
                actions.navigate('status');
                break;
        }
    };

    return { handleKey };
};
