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
  createSignal, onMount, createEffect, batch, Show, h, requestFrame, type ZenInputEvent, type TreeNode
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

// --- Domain Mappers ---
function mapFilesToNodes(files: FileItem[]): TreeNode[] {
  return files.map(f => ({
    name: f.name,
    path: f.name, // Simplified for now
    indent: f.indent || 1,
    isDir: f.isDir,
    status: f.status
  }));
}

function parseDiffLines(lines: string[]): any[] {
  return lines.map(line => {
    if (line.startsWith('+')) return { type: '+', content: line.slice(1) };
    if (line.startsWith('-')) return { type: '-', content: line.slice(1) };
    if (line.startsWith('@@')) return { type: 'header', content: line };
    return { type: ' ', content: line };
  });
}

export default function App() {
  // --- UI State Strategy ---
  const [focusedPanel, setFocusedPanel] = createSignal<number>(1); 
  const [selectedFileIdx, setSelectedFileIdx] = createSignal<number>(0);
  const [selectedCommitIdx, setSelectedCommitIdx] = createSignal<number>(0);
  
  const [terminalDimensions, setTerminalDimensions] = createSignal({
    width: process.stdout.columns || 160,
    height: process.stdout.rows || 50
  });

  // --- Repository Data State ---
  const [files, setFiles] = createSignal<FileItem[]>(getGitStatus());
  const [commits, setCommits] = createSignal<CommitItem[]>(getGitLogSync(40));
  const [diffLines, setDiffLines] = createSignal<any[]>([]);
  const [commandBuffer, setCommandBuffer] = createSignal("");
  const [notification, setNotification] = createSignal<string | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = createSignal(false);

  // --- Derived Layout State ---
  const W = () => terminalDimensions().width;
  const H = () => terminalDimensions().height;
  // --- Commercial Grade Layout Logic (Keynote Tuned) ---
  const sidebarWidth = () => Math.floor(W() * 0.24);
  const mainWidth = () => Math.floor(W() * 0.44);
  const inspectorWidth = () => W() - sidebarWidth() - mainWidth() - 2;

  // --- Effects & Side-Effects ---
  createEffect(async () => {
    const currentCommits = commits();
    const idx = selectedCommitIdx();
    if (currentCommits[idx]) {
      const diff = await getCommitDiff(currentCommits[idx].hash);
      setDiffLines(parseDiffLines(diff));
    }
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
    (globalThis as any).zenEngine?.requestFrame();
  };

  onMount(() => {
    // Sync initial dimensions with precise engine state
    const engine = (globalThis as any).getEngine?.();
    if (engine?.terminal?.size) {
      setTerminalDimensions({ 
        width: engine.terminal.size.width || 140, 
        height: engine.terminal.size.height || 50 
      });
    }
  });

  useInput((e: ZenInputEvent) => {
    if (e.name === "resize") {
      setTerminalDimensions({ width: e.width || 140, height: e.height || 50 });
      requestFrame();
      return;
    }

    if (isBranchModalOpen()) {
      if (e.name === "escape") setIsBranchModalOpen(false);
    } else if (e.name === "tab") {
          setFocusedPanel((prev: number) => (prev + 1) % 3);
        } else if (e.name === "escape") {
          setFocusedPanel(1);
        } else if (focusedPanel() === 0) {
          // EXPLORER navigation
          if (e.name === "j" || e.name === "down") {
            setSelectedFileIdx(prev => Math.min(prev + 1, files().length - 1));
          } else if (e.name === "k" || e.name === "up") {
            setSelectedFileIdx(prev => Math.max(prev - 1, 0));
          }
        } else if (focusedPanel() === 1) {
          // REVISION GRAPH navigation
          if (e.name === "j" || e.name === "down") {
            setSelectedCommitIdx(prev => Math.min(prev + 1, commits().length - 1));
          } else if (e.name === "k" || e.name === "up") {
            setSelectedCommitIdx(prev => Math.max(prev - 1, 0));
          }
        }
    requestFrame();
  });

  const [currentTime, setCurrentTime] = createSignal(new Date().toLocaleTimeString());
  createEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  });  // --- Commercial Grade Layout Logic (Keynote Tuned) ---

  const mockMetrics = [
    { label: "ENGINE L0", value: "0.4ms", fg: "#22c55e", data: [10, 12, 11, 14, 10, 12, 9, 11] },
    { label: "MEMORY", value: "42MB", fg: "#3b82f6", data: [40, 41, 42, 42, 43, 42, 42, 42] },
    { label: "THREADS", value: "12", fg: "#a855f7", data: [8, 10, 12, 12, 11, 12, 12, 12] },
    { label: "I/O OPS", value: "2.4k", fg: "#fbbf24", data: [20, 24, 22, 28, 24, 26, 22, 24] },
  ];

  return (
    <Box fixedPosition={{ x: 0, y: 0, w: W(), h: H() }} bg="#020617">
      
      {/* 1. Global Background Mask (Master Integrity) */}
      <Box fixedPosition={{ x: 0, y: 0, w: W(), h: H() }} bg="#020617" />

      {/* 2. Metrics Header (Commercial Grade) */}
      <Box 
        fixedPosition={{ x: 0, y: 0, w: W(), h: 4 }} 
        border={true} 
        borderColor="#1e293b"
        bg="#020617"
      >
        <PulseDashboard 
          title="SOVEREIGN RUC ENGINE" 
          time={currentTime()} 
          metrics={mockMetrics} 
        />
      </Box>

      {/* 3. Main Dashboard Islands (Pixel-Perfect Symmetry) */}
      
      {/* Left: Component Explorer */}
      <Panel 
         fixedPosition={{ x: 0, y: 4, w: sidebarWidth(), h: H() - 6 }}
         title="EXPLORER" 
         focused={focusedPanel() === 0}
         bg="#020617"
      >
          <FileTree 
            files={mapFilesToNodes(files())} 
            selectedIdx={selectedFileIdx()}
            width={sidebarWidth() - 2} 
            focused={focusedPanel() === 0} 
          />
      </Panel>

      {/* Center: Logic Stream / Graph */}
      <Panel 
        fixedPosition={{ x: sidebarWidth() + 1, y: 4, w: mainWidth(), h: H() - 6 }}
        title="REVISION GRAPH" 
        focused={focusedPanel() === 1}
        bg="#020617"
      >
          <GitGraph 
            commits={commits()} 
            selectedIdx={selectedCommitIdx()}
            width={mainWidth() - 2} 
            focused={focusedPanel() === 1}
          />
      </Panel>

      {/* Right: Inspector / Diff */}
      <Panel 
        fixedPosition={{ x: sidebarWidth() + mainWidth() + 2, y: 4, w: inspectorWidth(), h: H() - 6 }}
        title="COMMIT DETAILS & DIFF" 
        focused={focusedPanel() === 2}
        bg="#020617"
      >
          <DiffViewer 
            filename={commits()[selectedCommitIdx()]?.msg || "Changes"} 
            lines={diffLines()} 
            context={commits()[selectedCommitIdx()] ? {
              hash: commits()[selectedCommitIdx()].hash,
              author: commits()[selectedCommitIdx()].author,
              date: commits()[selectedCommitIdx()].date,
              message: commits()[selectedCommitIdx()].msg
            } : undefined}
            width={inspectorWidth() - 2} 
          />
      </Panel>

      {/* 4. Sovereign Status Bar (Isolated Bottom) */}
      <StatusBar 
        fixedPosition={{ x: 0, y: H() - 1, w: W(), h: 1 }}
        branch="main"
        status={notification() || "Sovereign Engine: Nominal"}
        position={`0/0`}
        bg="#020617"
      />
    </Box>
  );
}
