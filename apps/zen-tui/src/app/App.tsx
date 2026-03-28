/** @jsx h */
/**
 * @zen-tui/app: Sovereign Git TUI
 * 
 * High-fidelity, professional Git interface for UNIX-based systems.
 * Orchestrates Sovereign library components into a high-density, 
 * performance-optimized dashboard.
 */

import {
  Box, Text, Panel, truncate, useInput, List, dispatchInput, StatusBar, Modal,
  PulseDashboard, FileTree, GitGraph, DiffViewer, CommandInput,
  createSignal, onMount, createEffect, batch, Show, h, type ZenInputEvent, type TreeNode
} from "@zen-tui/solid";

import { 
  getGitStatus, 
  getGitLogSync, 
  getCommitDiff, 
  type FileItem, 
  type CommitItem 
} from "@zen-tui/core";

// --- Domain Persistence Layer ---
const branches = ["main", "feat/sovereign-ui", "hotfix/arm64-linker", "release/v1.0", "docs/architecture"];

export default function App() {
  // --- UI State Strategy ---
  const [focusedPanel, setFocusedPanel] = createSignal<number>(1); 
  const [selectedFileIdx, setSelectedFileIdx] = createSignal<number>(0);
  const [selectedCommitIdx, setSelectedCommitIdx] = createSignal<number>(0);
  
  const [terminalDimensions, setTerminalDimensions] = createSignal({
    width: (globalThis as any).zenEngine?.terminal?.size?.width || 120,
    height: (globalThis as any).zenEngine?.terminal?.size?.height || 40
  });

  // --- Repository Data State ---
  const [files, setFiles] = createSignal<FileItem[]>(getGitStatus());
  const [commits, setCommits] = createSignal<CommitItem[]>(getGitLogSync(40));
  const [diffLines, setDiffLines] = createSignal<string[]>([]);
  const [commandBuffer, setCommandBuffer] = createSignal("");
  const [notification, setNotification] = createSignal<string | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = createSignal(false);

  // --- Derived Layout State ---
  const W = () => terminalDimensions().width;
  const H = () => terminalDimensions().height;
  const sidebarWidth = () => Math.floor(W() * 0.22);
  const mainWidth = () => Math.floor(W() * 0.38); // Adjusted for better balance
  const inspectorWidth = () => W() - sidebarWidth() - mainWidth() - 2;

  // --- Pulse Metrics (Mock Metadata matching Mockup) ---
  const pulseMetrics = [
    { label: "COMMITS", value: "425", fg: "#2dd4bf", data: [10, 20, 15, 30, 25, 45, 40, 60, 50, 80] },
    { label: "CONTRIBUTORS", value: "8", fg: "#3b82f6", data: [1, 2, 1, 3, 2, 4, 3, 5] },
    { label: "LINES +/-", value: "+1,234 / -850", fg: "#10b981", data: [100, 200, 150, 300, 250, 450] },
    { label: "PRS", value: "5", fg: "#fbbf24", data: [1, 2, 1, 3, 2, 4] },
  ];

  // --- Effects & Side-Effects ---
  createEffect(async () => {
    const currentCommits = commits();
    const idx = selectedCommitIdx();
    if (currentCommits[idx]) {
      const diff = await getCommitDiff(currentCommits[idx].hash);
      setDiffLines(diff);
    }
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
    (globalThis as any).zenEngine?.requestFrame();
  };

  onMount(() => {
    notify("SOVEREIGN: High-fidelity TUI initialized.");

    const engine = (globalThis as any).zenEngine;
    if (engine) {
      engine.onInput = (e: ZenInputEvent) => {
        // Handle Terminal Resizing
        if (e.name === "resize") {
          setTerminalDimensions({ width: e.width || 120, height: e.height || 40 });
          return;
        }

        // Global Orchestration Logic
        if (isBranchModalOpen()) {
          if (e.name === "escape") setIsBranchModalOpen(false);
        } else if (e.name === "tab") {
          setFocusedPanel((prev: number) => (prev + 1) % 4);
        } else if (e.name === ":" && focusedPanel() !== 3) {
          setFocusedPanel(3);
          setCommandBuffer("");
        } else if (e.name === "escape") {
          setFocusedPanel(1);
        } else if (focusedPanel() === 3) {
          if (e.name === "backspace") {
            setCommandBuffer((v: string) => v.slice(0, -1));
          } else if (e.name === "return" || e.name === "enter") {
            notify(`COMMAND: git ${commandBuffer()}`);
            setFocusedPanel(1);
          } else if (e.name.length === 1) {
            setCommandBuffer((v: string) => v + e.name);
          }
        }

        dispatchInput(e);
        engine.requestFrame();
      };
    }
  });

  const getClock = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour12: false });
  };

  return (
    <Box fixedPosition={{ x: 0, y: 0, w: W(), h: H() }} bg="#020617">
       {/* Header */}
       <Box height={3} border={true} borderStyle="rounded" bg="#0f172a" flexDirection="row">
        <Text fg="#38bdf8" bold margin={{ x: 2, y: 0 }}>SOVEREIGN GIT TUI | branch:main</Text>
        <Box flexGrow={1} />
        <Text fg="#94a3b8" margin={{ x: 2, y: 0 }}>{getClock()}</Text>
      </Box>

      {/* Main Content Area */}
      <Box flexDirection="row" height={H() - 5}>
        <Panel width={sidebarWidth()} title="EXPLORER" focused={focusedPanel() === 0}>
           <Box flexDirection="column" padding={{ left: 1, top: 1 }}>
             <Text fg="#94a3b8">v apps/zen-tui/src</Text>
             <Text fg="#60a5fa">  main.tsx</Text>
             <Text fg="#94a3b8">v app/</Text>
             <Text fg="#fde047" bold>    App.tsx</Text>
             <Box height={1} />
             <Text fg="#94a3b8">v packages/solid</Text>
             <Text fg="#60a5fa">  index.ts</Text>
           </Box>
        </Panel>

        <Panel width={mainWidth()} title="REVISION GRAPH" focused={focusedPanel() === 1}>
           <Box flexDirection="column" padding={{ left: 1, top: 1 }}>
             <Text fg="#22c55e">* 7f8a9c2 Refactor Sovereign RUC</Text>
             <Text fg="#94a3b8">| * 4d2e1f0 Fix native-id linkage</Text>
             <Text fg="#94a3b8">|/  </Text>
             <Text fg="#94a3b8">* 1a2b3c4 Initial Sovereign Design</Text>
           </Box>
        </Panel>

        <Panel width={inspectorWidth()} title="DIFF: App.tsx" focused={focusedPanel() === 2}>
           <Box flexDirection="column" padding={{ left: 1, top: 1 }}>
             <Text fg="#22c55e">+ { '<Box fixedPosition={{ x: 0, y: 0 ... }} />' }</Text>
             <Text fg="#ef4444">- { '<div className="fragile-legacy" />' }</Text>
             <Box height={1} />
             <Text fg="#94a3b8">@@ -120,5 +121,12 @@</Text>
           </Box>
        </Panel>
      </Box>

      {/* Status Bar */}
      <StatusBar 
        y={H() - 1} 
        width={W()} 
        branch="main"
        status={notification() || "Sovereign Engine: Nominal"}
        position={`${selectedCommitIdx() + 1}/${commits().length}`}
      />
    </Box>
  );
}
