/** @jsx h */
/**
 * Zen-TUI: Palette View (Zen-Renderer)
 * 
 * Renders as a floating overlay box in the center of the terminal.
 */

// @ts-ignore
import { PaintCommand } from "../../shared/renderer.concept.js";
// @ts-ignore
import { PaletteState } from "./Palette.logic.js";

/**
 * Palette Overlay Template
 */
export const paletteTemplate = (state: PaletteState): PaintCommand[] => {
    const commands: PaintCommand[] = [];
    const width = 60;
    const height = 10;
    const startX = 10;
    const startY = 5;

    // 1. Modal Border (Drawing a simple box for the Taste)
    commands.push({
        type: 'text', x: startX, y: startY,
        value: "┏" + "━".repeat(width - 2) + "┓",
        style: { color: 'blue' }
    });

    // 2. Search Input
    commands.push({
        type: 'text', x: startX + 2, y: startY + 1,
        value: `❯ ${state.query}_`,
        style: { color: 'white', bold: true }
    });

    // 3. Separator
    commands.push({
        type: 'text', x: startX, y: startY + 2,
        value: "┣" + "━".repeat(width - 2) + "┫",
        style: { color: 'blue' }
    });

    // 4. Command List
    state.filtered.slice(0, 5).forEach((cmd, idx) => {
        const isSelected = idx === state.selectedIndex;
        commands.push({
            type: 'text', x: startX + 2, y: startY + 3 + idx,
            value: `${isSelected ? "❯" : " "} ${cmd.label.padEnd(20)} | ${cmd.description.slice(0, 30)}`,
            style: { color: isSelected ? 'cyan' : 'gray' }
        });
    });

    // 5. Bottom Border
    commands.push({
        type: 'text', x: startX, y: startY + height - 1,
        value: "┗" + "━".repeat(width - 2) + "┛",
        style: { color: 'blue' }
    });

    return commands;
};
