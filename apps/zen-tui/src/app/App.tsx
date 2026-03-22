/**
 * Zen-TUI — Demo-Ready Git Workflow Application (Dynamic Resize)
 * 
 * Green bleed: FIXED at renderer level (never emits ANSI 49m).
 * Resize: Passes terminal width to all child views for dynamic column calculation.
 * Every box explicitly sets bg={C.bg}.
 */

import { createSignal } from "solid-js";
import { JSX } from "../engine/jsx-runtime.js";
import StandardView from "../features/views/StandardView.js";
import RebaseView from "../features/views/RebaseView.js";
import ResetModal from "../features/modals/ResetModal.js";

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

export default function App(props: { onInput?: (e: any) => void }) {
  const [tab, setTab] = createSignal(0);
  const [showReset, setShowReset] = createSignal(false);
  const [sel, setSel] = createSignal(0);

  const maxSel = () => tab() === 0 ? 9 : tab() === 1 ? 4 : tab() === 2 ? 5 : 4;

  const handleInput = (e: any) => {
    if (showReset()) {
      if (e.name === "escape" || e.name === "q") setShowReset(false);
      return;
    }
    if (e.name === "q") process.exit(0);
    if (e.name === "1") { setTab(0); setSel(0); }
    if (e.name === "2") { setTab(1); setSel(0); }
    if (e.name === "3") { setTab(2); setSel(0); }
    if (e.name === "4") { setTab(3); setSel(0); }
    if (e.name === "tab") { setTab(t => (t + 1) % 4); setSel(0); }
    if (e.name === "R" || e.name === "r") setShowReset(true);
    if (e.name === "up" || e.name === "k") setSel(s => Math.max(0, s - 1));
    if (e.name === "down" || e.name === "j") setSel(s => Math.min(maxSel() - 1, s + 1));
  };

  const isT = (n: number) => tab() === n;

  const hotkeys = () => {
    if (tab() === 3) return "p:pick  s:squash  r:reword  d:drop  e:edit  Enter:apply  Esc:abort";
    if (tab() === 1) return "s:stage  u:unstage  d:discard  a:stage-all  c:commit  p:push  q:quit";
    if (tab() === 2) return "Enter:checkout  n:new  d:delete  m:merge  r:rebase  q:quit";
    return "Enter:detail  c:cherry-pick  r:revert  R:reset  i:rebase-i  q:quit";
  };

  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg}>
      
      {/* ROW 1: Header */}
      <box height={1} width="100%" flexDirection="row" bg={C.bg} paddingX={1}>
        <text bold fg={C.blue}>zen </text>
        <text fg={C.dim}>| </text>
        <text fg={C.subtext}>my-project </text>
        <text fg={C.dim}>on </text>
        <text bold fg={C.green}>main </text>
        <text fg={C.dim}>| </text>
        <text fg={C.subtext}>+2 ~4 -0 </text>
        <box flexGrow={1} bg={C.bg} />
        <text fg={C.dim}>synced </text>
        <text fg={C.green}>origin/main</text>
      </box>

      {/* ROW 2: Tabs */}
      <box height={1} width="100%" flexDirection="row" bg={C.bg} paddingX={1}>
        <text bold fg={isT(0) ? C.text : C.dim}>{isT(0) ? "[" : " "}1:Log{isT(0) ? "]" : " "} </text>
        <text bold fg={isT(1) ? C.text : C.dim}>{isT(1) ? "[" : " "}2:Files{isT(1) ? "]" : " "} </text>
        <text bold fg={isT(2) ? C.text : C.dim}>{isT(2) ? "[" : " "}3:Branches{isT(2) ? "]" : " "} </text>
        <text bold fg={isT(3) ? C.text : C.dim}>{isT(3) ? "[" : " "}4:Stash{isT(3) ? "]" : " "} </text>
        <box flexGrow={1} bg={C.bg} />
        {tab() === 3 && <text bold fg={C.red}>REBASE ACTIVE</text>}
      </box>

      {/* ROW 3: Divider */}
      <box height={1} width="100%" flexDirection="row" bg={C.bg}>
        <box flexGrow={1} height={1} bg={C.border} />
      </box>

      {/* ROW 4+: Main Content */}
      <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
        {tab() === 3 ? <RebaseView sel={sel()} /> : <StandardView tab={tab()} sel={sel()} />}
      </box>

      {/* FOOTER: Divider */}
      <box height={1} width="100%" flexDirection="row" bg={C.bg}>
        <box flexGrow={1} height={1} bg={C.border} />
      </box>

      {/* FOOTER: Hotkeys */}
      <box height={1} width="100%" flexDirection="row" bg={C.bg} paddingX={1}>
        <text fg={C.dim}>{hotkeys()}</text>
      </box>

      {/* MODAL OVERLAY */}
      {showReset() && (
        <box style={{ position: "absolute" }} flexDirection="column" width="100%" height="100%">
           <ResetModal />
        </box>
      )}

      <box display="none">{(() => { if (props.onInput) props.onInput(handleInput); return null; })()}</box>
    </box>
  );
}
