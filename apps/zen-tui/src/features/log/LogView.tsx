/**
 * Zen-TUI: Git Log View (Industrial Art)
 */

import { For } from "solid-js";

const COMMITS = [
  { hash: "7c2e1f4", date: "2m ago", user: "picon", msg: "feat: achieve total architectural sovereignty", color: "#fab387" },
  { hash: "4d3b0c2", date: "5m ago", user: "picon", msg: "refactor: implement zen-transformer plugin", color: "#cdd6f4" },
  { hash: "2e9a8d4", date: "1h ago", user: "picon", msg: "fix: resolve ANSI style bleeding", color: "#cdd6f4" },
  { hash: "b5c7d8k", date: "2h ago", user: "picon", msg: "chore: finalize hardware renderer", color: "#cdd6f4" },
  { hash: "a1b2c3d", date: "1d ago", user: "picon", msg: "docs: update industrial plan", color: "#cdd6f4" },
];

export default function LogView() {
  return (
    <box flexDirection="column">
      <For each={COMMITS}>
        {(c) => (
          <box flexDirection="row" height={1} gap={1}>
            <text fg="#45475a">║</text>
            <text bold fg={c.color}>  {c.hash} </text>
            <box width={10}>
              <text fg="#89b4fa"> {c.date} </text>
            </box>
            <text fg="#a6e3a1"> {c.user} </text>
            <text fg="#cdd6f4"> {c.msg} </text>
          </box>
        )}
      </For>
    </box>
  );
}
