/** @jsx h */
/**
 * Zen-TUI: Shell View (Zen-Renderer)
 * 
 * Renders the global frame:
 * [ HEADER: Zen-TUI | Branch: master ]
 * [ --------------------------------- ]
 * [ CONTENT: ACTIVE FEATURE           ]
 * [ --------------------------------- ]
 * [ STATUS: Press '?' for help        ]
 */

// @ts-ignore
import { createZenComponent, PaintCommand, NativeZenRenderer } from "../../shared/renderer.concept.js";
// @ts-ignore
import { ShellState } from "./Shell.logic.js";
// @ts-ignore
import { paletteTemplate } from "./Palette.view.js";

/**
 * The Shell View Orchestrator
 */
export const createShellView = (
    native: NativeZenRenderer, 
    state: ShellState,
    contentTemplate: () => PaintCommand[] // Dynamic content from active feature
) => {
    
    // The Shell "Frame" Template
    const frameTemplate = (): PaintCommand[] => {
        const commands: PaintCommand[] = [];

        // 1. Header (Logo + Context)
        const driftLabel = state.upstreamStatus === 'behind' 
            ? `⚠️  BEHIND (${state.driftCount})` 
            : state.upstreamStatus === 'ahead' ? '🚀 AHEAD' : '✅ SYNCED';
        const driftColor = state.upstreamStatus === 'behind' ? 'amber' : 'green';

        commands.push({
            type: 'text', x: 2, y: 0,
            value: `[ ZEN-TUI ]  FEATURE: ${state.activeFeature.toUpperCase()}  |  FRESHNESS: ${driftLabel}`,
            style: { color: driftColor, bold: true }
        });

        // 2. Separator
        commands.push({
            type: 'text', x: 0, y: 1,
            value: "━".repeat(80),
            style: { color: 'gray' }
        });

        // 3. Inject Active Content
        commands.push(...contentTemplate());

        // 3.5 Command Palette Overlay
        if (state.isPaletteOpen) {
            // @ts-ignore (We pass a mock state for now)
            commands.push(...paletteTemplate({ 
                query: "br", 
                filtered: [{ id: '1', label: 'Switch Branch', description: 'Checkout a different branch', action: () => {} }], 
                selectedIndex: 0,
                commands: []
            }));
        }

        // 4. Status Bar (Bottom fixed)
        commands.push({
            type: 'text', x: 2, y: 23,
            value: "G: Log  S: Status  R: Rebase  ?: Help",
            style: { color: 'gray', italic: true }
        });

        // 5. Banner Overlay
        if (state.bannerMessage) {
            commands.push({
                type: 'text', x: 30, y: 1,
                value: `[ ${state.bannerMessage} ]`,
                style: { color: 'amber' }
            });
        }

        return commands;
    };

    // Bind the Shell Frame to the high-speed native loop
    createZenComponent(native, frameTemplate);
};
