/**
 * Zen-TUI — Rebase View (Dynamic Resize + Demo-Ready)
 * 
 *  My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

import { For } from "solid-js";
import { C } from "../../app/App.js";

const PLAN = [
  { act: "pick", hash: "a3f7c21", msg: "feat: add sovereign layout engine" },
  { act: "squash", hash: "8d4e1b9", msg: "fix: viewport fill prevents terminal bleed" },
  { act: "drop", hash: "c92fa03", msg: "refactor: extract StandardView component" },
  { act: "pick", hash: "1e8b4d6", msg: "feat: add interactive rebase workflow" },
];

function fit(s: string, len: number): string {
  if (len <= 0) return "";
  if (s.length > len) return s.substring(0, len - 1) + "~";
  return s.padEnd(len);
}

const HDivider = () => (
  <Zen.Box flexDirection="row" width="100%" height={1} bg={C.bg}>
    <Zen.Box height={1} flexGrow={1} bg={C.border} />
  </Zen.Box>
);

export default function RebaseView(props: { sel: number }) {
  return (
    <Zen.Box flexDirection="row" width="100%" height="100%" bg={C.bg}>

      {/* LEFT: Rebase Plan */}
      <Zen.Box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <Zen.Box height={1} width="100%" bg={C.bg} paddingX={1}>
          <Zen.Text fg={C.dim}>ACTION    HASH     COMMIT MESSAGE</Zen.Text>
        </Zen.Box>
        <HDivider />

        <Zen.Box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <Zen.For each={PLAN}>
            {(it, i) => {
              const actColor = it.act === "drop" ? C.red : (it.act === "squash" ? C.yellow : C.green);
              return (
                <Zen.Box flexDirection="row" width="100%" height={1} bg={props.sel === i() ? C.activeBg : C.bg} paddingX={1}>
                  <Zen.Text fg={props.sel === i() ? C.blue : C.bg}>{props.sel === i() ? ">" : " "}</Zen.Text>
                  <Zen.Text bold fg={actColor}>{fit(it.act.toUpperCase(), 10)}</Zen.Text>
                  <Zen.Text fg={C.yellow}>{it.hash} </Zen.Text>
                  <Zen.Text fg={C.text}>{fit(it.msg, 45)}</Zen.Text>
                </Zen.Box>
              );
            }}
          </Zen.For>
          <Zen.Box height={2} bg={C.bg} />
          <Zen.Box flexDirection="row" bg={C.bg} paddingX={2}>
            <Zen.Text fg={C.dim}>Rebasing </Zen.Text>
            <Zen.Text bold fg={C.blue}>feat/sovereign </Zen.Text>
            <Zen.Text fg={C.dim}>onto </Zen.Text>
            <Zen.Text bold fg={C.green}>main </Zen.Text>
            <Zen.Text fg={C.dim}>(4 commits)</Zen.Text>
          </Zen.Box>
        </Zen.Box>
      </Zen.Box>

      {/* RIGHT: Rebase Tools */}
      <Zen.Box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Zen.Text bold fg={C.text}>REBASE TOOLS</Zen.Text>
        <Zen.Box height={1} bg={C.bg} />
        <HDivider />
        <Zen.Box height={1} bg={C.bg} />

        <Zen.Box flexDirection="column" bg={C.bg}>
          <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text bold fg={C.green}>p </Zen.Text><Zen.Text fg={C.dim}>pick   - use commit as-is</Zen.Text></Zen.Box>
          <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text bold fg={C.yellow}>s </Zen.Text><Zen.Text fg={C.dim}>squash - meld into previous</Zen.Text></Zen.Box>
          <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text bold fg={C.red}>d </Zen.Text><Zen.Text fg={C.dim}>drop   - discard commit</Zen.Text></Zen.Box>
          <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text bold fg={C.blue}>r </Zen.Text><Zen.Text fg={C.dim}>reword - edit message</Zen.Text></Zen.Box>
          <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text bold fg={C.orange}>e </Zen.Text><Zen.Text fg={C.dim}>edit   - stop for amending</Zen.Text></Zen.Box>
          <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text bold fg={C.cyan}>f </Zen.Text><Zen.Text fg={C.dim}>fixup  - squash silently</Zen.Text></Zen.Box>
        </Zen.Box>

        <Zen.Box height={1} bg={C.bg} />
        <HDivider />
        <Zen.Box height={1} bg={C.bg} />

        <Zen.Box flexDirection="column" bg={C.bg}>
          <Zen.Text fg={C.subtext}>[Enter] Execute rebase plan</Zen.Text>
          <Zen.Text fg={C.dim}>[Esc]   Abort and restore</Zen.Text>
          <Zen.Box height={1} bg={C.bg} />
          <Zen.Text fg={C.dim}>Move commits with j/k</Zen.Text>
          <Zen.Text fg={C.dim}>Change action with hotkey</Zen.Text>
        </Zen.Box>
      </Zen.Box>

    </Zen.Box>
  );
}
