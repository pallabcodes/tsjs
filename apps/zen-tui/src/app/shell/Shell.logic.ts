/**
 * Zen-TUI: Shell Logic (Solid-js)
 * 
 * Orchestrates global application state:
 * - Active Feature (Navigation)
 * - Global Status (Drift, Mutation locks)
 * - Command Palette visibility
 */

import { createStore } from "solid-js/store";

export type ActiveFeature = 'log' | 'status' | 'rebase' | 'stash';

export interface ShellState {
    activeFeature: ActiveFeature;
    isPaletteOpen: boolean;
    bannerMessage: string | null;
    upstreamStatus: 'synced' | 'behind' | 'ahead';
    driftCount: number;
}

/**
 * Shell Controller
 */
export const createShellLogic = () => {
    const [state, setState] = createStore<ShellState>({
        activeFeature: 'log',
        isPaletteOpen: false,
        bannerMessage: null,
        upstreamStatus: 'synced',
        driftCount: 0
    });

    const navigate = (feature: ActiveFeature) => {
        setState("activeFeature", feature);
    };

    const togglePalette = () => {
        setState("isPaletteOpen", !state.isPaletteOpen);
    };

    const showBanner = (msg: string) => {
        setState("bannerMessage", msg);
        setTimeout(() => setState("bannerMessage", null), 3000);
    };

    const updateDrift = (status: 'synced' | 'behind' | 'ahead', count: number) => {
        setState({ upstreamStatus: status, driftCount: count });
    };

    return {
        state,
        navigate,
        togglePalette,
        showBanner,
        updateDrift
    };
};
