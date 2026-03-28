/**
 * Zen-TUI: Command Palette Logic (Solid-js)
 * 
 * High-speed fuzzy filtering for global orchestration.
 */

import { createStore } from "solid-js/store";

export interface Command {
    id: string;
    label: string;
    description: string;
    action: () => void;
}

export interface PaletteState {
    query: string;
    commands: Command[];
    filtered: Command[];
    selectedIndex: number;
}

/**
 * Palette Controller
 */
export const createPaletteLogic = (initialCommands: Command[]) => {
    const [state, setState] = createStore<PaletteState>({
        query: "",
        commands: initialCommands,
        filtered: initialCommands,
        selectedIndex: 0
    });

    const setQuery = (q: string) => {
        const lowerQ = q.toLowerCase();
        const results = state.commands.filter(c => 
            c.label.toLowerCase().includes(lowerQ) || 
            c.description.toLowerCase().includes(lowerQ)
        );
        setState({
            query: q,
            filtered: results,
            selectedIndex: 0
        });
    };

    const next = () => {
        setState("selectedIndex", (i) => (i + 1) % Math.max(1, state.filtered.length));
    };

    const prev = () => {
        setState("selectedIndex", (i) => (i - 1 + state.filtered.length) % Math.max(1, state.filtered.length));
    };

    const execute = () => {
        const selected = state.filtered[state.selectedIndex];
        if (selected) {
            selected.action();
            return true;
        }
        return false;
    };

    return {
        state,
        setQuery,
        next,
        prev,
        execute
    };
};
