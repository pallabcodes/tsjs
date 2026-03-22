/**
 * Zen-TUI — Rebase View (Dynamic Resize + Demo-Ready)
 */

import { For } from "solid-js";
import { C } from "../../app/App.js";

const PLAN = [
  { act: "pick",   hash: "a3f7c21", msg: "feat: add sovereign layout engine" },
  { act: "squash", hash: "8d4e1b9", msg: "fix: viewport fill prevents terminal bleed" },
  { act: "drop",   hash: "c92fa03", msg: "refactor: extract StandardView component" },
  { act: "pick",   hash: "1e8b4d6", msg: "feat: add interactive rebase workflow" },
];

function fit(s: string, len: number): string {
  if (len <= 0) return "";
  if (s.length > len) return s.substring(0, len - 1) + "~";
  return s.padEnd(len);
}

const HDivider = () => (
  <box flexDirection="row" width="100%" height={1} bg={C.bg}>
     <box height={1} flexGrow={1} bg={C.border} />
  </box>
);

export default function RebaseView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      
      {/* LEFT: Rebase Plan */}
      <box width="65%" flexDirection="column" height="100%" bg={C.bg}>
         <box height={1} width="100%" bg={C.bg} paddingX={1}>
           <text fg={C.dim}>ACTION    HASH     COMMIT MESSAGE</text>
         </box>
         <HDivider />
         
         <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
           <For each={PLAN}>
             {(it, i) => {
               const actColor = it.act === "drop" ? C.red : (it.act === "squash" ? C.yellow : C.green);
               return (
                 <box flexDirection="row" width="100%" height={1} bg={props.sel === i() ? C.activeBg : C.bg} paddingX={1}>
                    <text fg={props.sel === i() ? C.blue : C.bg}>{props.sel === i() ? ">" : " "}</text>
                    <text bold fg={actColor}>{fit(it.act.toUpperCase(), 10)}</text>
                    <text fg={C.yellow}>{it.hash} </text>
                    <text fg={C.text}>{fit(it.msg, 45)}</text>
                 </box>
               );
             }}
           </For>
           <box height={2} bg={C.bg} />
           <box flexDirection="row" bg={C.bg} paddingX={2}>
              <text fg={C.dim}>Rebasing </text>
              <text bold fg={C.blue}>feat/sovereign </text>
              <text fg={C.dim}>onto </text>
              <text bold fg={C.green}>main </text>
              <text fg={C.dim}>(4 commits)</text>
           </box>
         </box>
      </box>

      {/* RIGHT: Rebase Tools */}
      <box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
         <text bold fg={C.text}>REBASE TOOLS</text>
         <box height={1} bg={C.bg} />
         <HDivider />
         <box height={1} bg={C.bg} />
         
         <box flexDirection="column" bg={C.bg}>
            <box flexDirection="row" bg={C.bg}><text bold fg={C.green}>p </text><text fg={C.dim}>pick   - use commit as-is</text></box>
            <box flexDirection="row" bg={C.bg}><text bold fg={C.yellow}>s </text><text fg={C.dim}>squash - meld into previous</text></box>
            <box flexDirection="row" bg={C.bg}><text bold fg={C.red}>d </text><text fg={C.dim}>drop   - discard commit</text></box>
            <box flexDirection="row" bg={C.bg}><text bold fg={C.blue}>r </text><text fg={C.dim}>reword - edit message</text></box>
            <box flexDirection="row" bg={C.bg}><text bold fg={C.orange}>e </text><text fg={C.dim}>edit   - stop for amending</text></box>
            <box flexDirection="row" bg={C.bg}><text bold fg={C.cyan}>f </text><text fg={C.dim}>fixup  - squash silently</text></box>
         </box>
         
         <box height={1} bg={C.bg} />
         <HDivider />
         <box height={1} bg={C.bg} />
         
         <box flexDirection="column" bg={C.bg}>
            <text fg={C.subtext}>[Enter] Execute rebase plan</text>
            <text fg={C.dim}>[Esc]   Abort and restore</text>
            <box height={1} bg={C.bg} />
            <text fg={C.dim}>Move commits with j/k</text>
            <text fg={C.dim}>Change action with hotkey</text>
         </box>
      </box>

    </box>
  );
}
