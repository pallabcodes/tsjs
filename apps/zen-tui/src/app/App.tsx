/**
 * Zen-TUI: The definitive "Stunning & Stable" Dashboard
 * 
 * Modular Design System with Catppuccin inspired tokens.
 */

import { createSignal, onMount } from "solid-js";
import { JSX } from "../engine/jsx-runtime.js";
import LogView from "../features/log/LogView.js";
import StatusView from "../features/status/StatusView.js";

// Design Token: Catppuccin (Mocha)
const THEME = {
  bg: "#1e1e2e",
  surface: "#313244",
  overlay: "#45475a",
  border: "#45475a", // Changed from #585b70
  text: "#cdd6f4",
  subtext: "#a6adc8",
  accent: "#f5c2e7",
  peach: "#fab387",
  green: "#a6e3a1",
  blue: "#89b4fa",
  lavender: "#b4befe", // New
  focus: "#fab387", // New
};

export default function App(props: { onInput?: (e: any) => void }) {
  const [activeTab, setActiveTab] = createSignal(1);
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  // Handle local focus and selection switching
  const handleInput = (e: any) => {
    if (e.name === "1") { setActiveTab(1); setSelectedIndex(0); }
    if (e.name === "2") { setActiveTab(2); setSelectedIndex(0); }
    if (e.name === "3") { setActiveTab(3); setSelectedIndex(0); }
    if (e.name === "4") { setActiveTab(4); setSelectedIndex(0); }

    if (e.name === "up") setSelectedIndex(prev => Math.max(0, prev - 1));
    if (e.name === "down") setSelectedIndex(prev => prev + 1);
  };

  return (
    <box flexDirection="column" height="100%" bg={THEME.bg}>
      
      {/* 1. INDUSTRIAL MARQUEE HUD (Powerline Style) */}
      <box height={1} flexDirection="row" bg={THEME.surface}>
        <box bg={THEME.peach} paddingX={1}>
          <text bold fg={THEME.bg}> ◈ ZEN_AUTONOMY </text>
        </box>
        <text fg={THEME.peach}></text>
        <text fg={THEME.subtext} italic> workflow:git_sovereign </text>
        <box flexGrow={1} />
        <text fg={THEME.green}></text>
        <box bg={THEME.green} paddingX={1}>
          <text bold fg={THEME.bg}>󰄬 ENGINE_READY </text>
        </box>
        <box bg={THEME.bg} paddingX={1}>
           <text fg={THEME.subtext}>20:45:50</text>
        </box>
      </box>

      {/* 2. MAIN QUADRANT GRID */}
      <box flexGrow={1} flexDirection="row" gap={0} padding={1}>
        
        {/* LEFT COLUMN (35%) */}
        <box width="35%" flexDirection="column" gap={1}>
          
          {/* PANEL 1: SOURCES */}
          <box flexGrow={2} flexDirection="column" border borderColor={activeTab() === 1 ? THEME.focus : THEME.border}>
            <box height={1} bg={activeTab() === 1 ? THEME.focus : THEME.surface} paddingX={1}>
              <text bold fg={activeTab() === 1 ? THEME.bg : THEME.text}> SOURCES [UNSTAGED]</text>
            </box>
            <box flexGrow={1} padding={1}>
               <StatusView selectedIndex={activeTab() === 1 ? selectedIndex() : -1} />
            </box>
          </box>

          {/* PANEL 2: BRANCHES */}
          <box flexGrow={1} flexDirection="column" border borderColor={activeTab() === 2 ? THEME.focus : THEME.border}>
            <box height={1} bg={activeTab() === 2 ? THEME.focus : THEME.surface} paddingX={1}>
              <text bold fg={activeTab() === 2 ? THEME.bg : THEME.text}> BRANCHES [LOCAL]</text>
            </box>
            <box flexGrow={1} padding={1}>
              <box flexDirection="column">
                <text fg={activeTab() === 2 && selectedIndex() === 0 ? THEME.focus : THEME.blue}> main</text>
                <text fg={activeTab() === 2 && selectedIndex() === 1 ? THEME.focus : THEME.subtext}>  feat/sovereign-layout</text>
                <text fg={activeTab() === 2 && selectedIndex() === 2 ? THEME.focus : THEME.subtext}>  fix/clipping-nesting</text>
              </box>
            </box>
          </box>

          {/* PANEL 3: TELEMETRY */}
          <box height={6} flexDirection="column" border borderColor={activeTab() === 3 ? THEME.focus : THEME.border}>
            <box flexGrow={1} padding={1}>
              <box flexDirection="column">
                <text bold fg={THEME.blue}>󰙅 GIT_TELEMETRY</text>
                <text fg={THEME.subtext}>Stash: 2 items</text>
                <text fg={THEME.subtext}>Remotes: origin</text>
              </box>
            </box>
          </box>
        </box>

        {/* RIGHT COLUMN (65%) */}
        <box width="65%" paddingLeft={1}>
          <box flexGrow={1} flexDirection="column" border borderColor={activeTab() === 4 ? THEME.focus : THEME.border}>
             <box height={1} bg={activeTab() === 4 ? THEME.focus : THEME.surface} paddingX={1}>
               <text bold fg={activeTab() === 4 ? THEME.bg : THEME.text}>󰋚 LOG_STREAM [/MAIN]</text>
             </box>
             <box flexGrow={1} padding={1}>
               <LogView />
             </box>
          </box>
        </box>
      </box>

      {/* 3. COMMAND FOOTER (Powerline Style) */}
      <box height={1} bg={THEME.surface} flexDirection="row">
        <box bg={THEME.peach} paddingX={1}>
          <text bold fg={THEME.bg}> COMMAND_HUD </text>
        </box>
        <text fg={THEME.peach}></text>
        <box flexDirection="row" gap={2} paddingX={1}>
           <text fg={THEME.peach}>[1-4] Nav</text>
           <text fg={THEME.green}>[S] Stage</text>
           <text fg={THEME.blue}>[C] Commit</text>
        </box>
        <box flexGrow={1} />
        <text fg={THEME.lavender}></text>
        <box bg={THEME.lavender} paddingX={1}>
          <text bold fg={THEME.bg}> main</text>
        </box>
      </box>

      {/* REACTION: Inject handleInput to global engine */}
      <box display="none">
        {(() => { if (props.onInput) props.onInput(handleInput); return null; })()}
      </box>
    </box>
  );
}
