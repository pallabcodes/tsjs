/**
 * Zen-TUI: Git Status View (Industrial Art)
 */

import { For } from "solid-js";

const FILES = [
  { name: "renderer.ts", status: "M", color: "#fab387", icon: "󰛄" },
  { name: "plugin.ts", status: "A", color: "#a6e3a1", icon: "" },
  { name: "App.tsx", status: "M", color: "#fab387", icon: "󰛄" },
  { name: "node.ts", status: "M", color: "#fab387", icon: "󰛄" },
];

export default function StatusView(props: { selectedIndex: number }) {
  return (
    <box flexDirection="column" gap={0}>
      <For each={FILES}>
        {(f, i) => (
          <box flexDirection="row" height={1} gap={2} padding={0} bg={props.selectedIndex === i() ? "#313244" : undefined}>
            {/* Status Pill Badge */}
            <box width={3} bg={f.color} paddingX={1}>
              <text bold fg="#1e1e2e">{f.status}</text>
            </box>
            <box flexDirection="row" gap={1}>
              <text fg={props.selectedIndex === i() ? "#fab387" : f.color}>{props.selectedIndex === i() ? "󰄬" : f.icon}</text>
              <text fg={props.selectedIndex === i() ? "#ffffff" : "#cdd6f4"}>{f.name}</text>
            </box>
          </box>
        )}
      </For>
    </box>
  );
}
