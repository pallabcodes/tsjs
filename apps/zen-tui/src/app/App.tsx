/**
 * Zen-TUI — Complete Git Workflow Application
 * 
 * Modal Architecture:
 *   null      → Base views (Log, Files, Branches, Stash)
 *   "commit"  → Stage → message → push
 *   "rebase"  → Mode picker → plan editor → abort/continue
 *   "cherry"  → Commit picker → apply → resolve
 *   "merge"   → Branch picker → merge → conflict resolution
 *   "reset"   → Mode picker (soft/mixed/hard) → confirm
 *   "amend"   → Edit last commit message/author
 *   "submod"  → Submodule management
 *   "stash"   → Stash/pop/apply/drop
 */

import { createSignal, onMount, memo, Zen } from "@zen-tui/solid";
import StandardView from "../features/views/StandardView.tsx";
import WorkflowOverlay from "../features/workflows/WorkflowOverlay.tsx";

export const C = {
  bg:       "#020202",
  activeBg: "#161622",
  border:   "#282838",
  text:     "#e2e4e9",
  subtext:  "#8b8fa3",
  dim:      "#484c5e",
  blue:     "#5b9df9",
  green:    "#4ade80",
  red:      "#f87171",
  yellow:   "#fbbf24",
  cyan:     "#67e8f9",
  orange:   "#fb923c",
};

export type WorkflowMode = null | "commit" | "rebase" | "cherry" | "merge" | "reset" | "amend" | "submod" | "stash";

export default function App(props: { onInput?: (e: any) => void }) {
  const [tab, setTab] = createSignal(0);
  const [mode, setMode] = createSignal<WorkflowMode>(null);
  const [sel, setSel] = createSignal(0);

  onMount(() => {
    if (props.onInput) {
      props.onInput(handleInput);
    }
  });

  const maxSel = () => tab() === 0 ? 9 : tab() === 1 ? 4 : tab() === 2 ? 5 : 4;

  const handleInput = (e: any) => {
    if (mode() !== null) {
      if (e.name === "escape" || e.name === "q") setMode(null);
      return;
    }
    if (e.name === "q") process.exit(0);
    if (e.name === "1") { setTab(0); setSel(0); }
    if (e.name === "2") { setTab(1); setSel(0); }
    if (e.name === "3") { setTab(2); setSel(0); }
    if (e.name === "4") { setTab(3); setSel(0); }
    if (e.name === "tab") { setTab((t: number) => (t + 1) % 4); setSel(0); }

    if (e.name === "c") setMode("commit");
    if (e.name === "r") setMode("rebase");
    if (e.name === "C") setMode("cherry");
    if (e.name === "m") setMode("merge");
    if (e.name === "R") setMode("reset");
    if (e.name === "a") setMode("amend");
    if (e.name === "S") setMode("submod");
    if (e.name === "z") setMode("stash");

    if (e.name === "up" || e.name === "k") setSel((s: number) => Math.max(0, s - 1));
    if (e.name === "down" || e.name === "j") setSel((s: number) => Math.min(maxSel() - 1, s + 1));
  };

  const isT = (n: number) => tab() === n;

  const hotkeys = () => {
    if (mode() !== null) return "Esc:back";
    return "c:commit  r:rebase  C:cherry-pick  m:merge  R:reset  a:amend  S:submodule  z:stash  q:quit";
  };

  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg}>
      
      <Zen.Box height={1} width="100%" flexDirection="row" bg={C.bg} paddingX={1}>
        <Zen.Text bold fg={C.blue}>zen</Zen.Text>
        <Zen.Text fg={C.dim}>  </Zen.Text>
        <Zen.Text fg={C.text}>my-project</Zen.Text>
        <Zen.Text fg={C.dim}>  </Zen.Text>
        <Zen.Text bold fg={C.green}>main</Zen.Text>
        <Zen.Text fg={C.dim}>  </Zen.Text>
        <Zen.Text fg={C.subtext}>+2 ~4</Zen.Text>
        <Zen.Box flexGrow={1} bg={C.bg} />
        {mode() !== null && (
          <Zen.Text bold fg={C.orange}>{mode()!.toUpperCase()} </Zen.Text>
        )}
        <Zen.Text fg={C.green}>synced</Zen.Text>
      </Zen.Box>

      <Zen.Box height={1} width="100%" flexDirection="row" bg={C.bg} paddingX={1}>
        <Zen.Text bold fg={isT(0) ? C.text : C.dim}>{isT(0) ? "[" : " "}1:Log{isT(0) ? "]" : " "} </Zen.Text>
        <Zen.Text bold fg={isT(1) ? C.text : C.dim}>{isT(1) ? "[" : " "}2:Files{isT(1) ? "]" : " "} </Zen.Text>
        <Zen.Text bold fg={isT(2) ? C.text : C.dim}>{isT(2) ? "[" : " "}3:Branches{isT(2) ? "]" : " "} </Zen.Text>
        <Zen.Text bold fg={isT(3) ? C.text : C.dim}>{isT(3) ? "[" : " "}4:Stash{isT(3) ? "]" : " "} </Zen.Text>
        <Zen.Box flexGrow={1} bg={C.bg} />
      </Zen.Box>

      <Zen.Box height={1} width="100%" flexDirection="row" bg={C.bg}>
        <Zen.Box flexGrow={1} height={1} bg={C.border} />
      </Zen.Box>

      <Zen.Box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
        {memo(() => {
          const m = mode();
          if (m !== null) return <WorkflowOverlay mode={mode} />;
          return <StandardView tab={tab} sel={sel} />;
        })()}
      </Zen.Box>

      <Zen.Box height={1} width="100%" flexDirection="row" bg={C.bg}>
        <Zen.Box flexGrow={1} height={1} bg={C.border} />
      </Zen.Box>

      <Zen.Box height={1} width="100%" flexDirection="row" bg={C.bg} paddingX={1}>
        <Zen.Text fg={C.dim}>{hotkeys()}</Zen.Text>
      </Zen.Box>
    </Zen.Box>
  );
}
