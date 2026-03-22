/**
 * Zen-TUI — Sidebar List Component
 *
 * Renders different data based on `view` prop:
 *   files    → Unstaged/staged file list with M/A/D/U status
 *   branches → Local + remote branches with tracking status
 *   commits  → Commit history with short graph
 *   stash    → Stash entries
 * 
 *  My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

import { For } from "solid-js";

const FILES = [
  { label: "M  src/engine/app.ts", detail: "+42 -8" },
  { label: "M  src/app/App.tsx", detail: "+187 -95" },
  { label: "A  src/features/log.tsx", detail: "+52" },
  { label: "M  package.json", detail: "+3 -1" },
];

const BRANCHES = [
  { label: "* main", detail: "origin/main" },
  { label: "  feat/sovereign", detail: "behind 2" },
  { label: "  fix/clipping", detail: "ahead 1" },
];

const COMMITS = [
  { label: "* 7c2e1f4 feat: sovereignty", detail: "2m" },
  { label: "* 4d3b0c2 refactor: transformer", detail: "5m" },
  { label: "* 2e9a8d4 fix: ANSI bleeding", detail: "1h" },
  { label: "| b5c7d8k chore: renderer", detail: "2h" },
  { label: "* a1b2c3d docs: plan update", detail: "1d" },
];

const STASH = [
  { label: "stash@{0}: WIP on main", detail: "3h" },
  { label: "stash@{1}: experiment", detail: "2d" },
];

const C = {
  base: "#1e1e2e",
  crust: "#11111b",
  surface0: "#313244",
  text: "#cdd6f4",
  overlay0: "#6c7086",
  blue: "#89b4fa",
  green: "#a6e3a1",
  red: "#f38ba8",
  peach: "#fab387",
  yellow: "#f9e2af",
  teal: "#94e2d5",
};

const DATA: Record<string, Array<{ label: string; detail: string }>> = {
  files: FILES,
  branches: BRANCHES,
  commits: COMMITS,
  stash: STASH,
};

export default function StatusView(props: { selectedIndex: number; view: string }) {
  const items = () => DATA[props.view] || FILES;

  return (
    <Zen.Box flexDirection="column" width="100%" bg={C.base}>
      <Zen.For each={items()}>
        {(item, i) => {
          const isSel = () => props.selectedIndex === i();
          const lc = () => {
            if (isSel()) return C.crust;
            const c0 = item.label.charAt(0);
            if (c0 === "M" || c0 === "|") return C.peach;
            if (c0 === "A") return C.green;
            if (c0 === "D") return C.red;
            if (c0 === "*") return C.yellow;
            if (c0 === "s") return C.teal;
            return C.text;
          };
          return (
            <Zen.Box flexDirection="row" width="100%" height={1} bg={isSel() ? C.blue : C.base} paddingX={1}>
              <Zen.Text fg={lc()}>{item.label}</Zen.Text>
              <Zen.Box flexGrow={1} />
              <Zen.Text fg={isSel() ? C.crust : C.overlay0}>{item.detail}</Zen.Text>
            </Zen.Box>
          );
        }}
      </Zen.For>
    </Zen.Box>
  );
}
