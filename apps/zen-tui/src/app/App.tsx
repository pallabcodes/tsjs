import { createSignal, onMount } from "solid-js";
import { Zen } from "@zen-tui/solid";
import { ZenPill } from "../ui/Pill.tsx";
import { ZenButton } from "../ui/Button.tsx";

export default function App(props: { onInput?: (e: any) => void }) {
  const [activeBtn, setActiveBtn] = createSignal(0);

  onMount(() => {
    if (props.onInput) {
      props.onInput(handleInput);
    }
  });

  const handleInput = (e: any) => {
    if (e.name === "q") process.exit(0);
    if (e.name === "tab" || e.name === "right") {
      setActiveBtn((s) => (s + 1) % 3);
    }
    if (e.name === "left") {
      setActiveBtn((s) => (s - 1 + 3) % 3);
    }
  };

  return Zen.Box({
    flexDirection: "column",
    width: "100%",
    height: "100%",
    bg: "#09090b",
    paddingX: 2,
    paddingY: 1,
    children: [
      // Header
      Zen.Box({
        flexDirection: "row", width: "100%", gap: 2, height: 1,
        children: [
          Zen.Text({ bold: true, fg: "#5b9df9", children: "ZEN Core" }),
          Zen.Text({ fg: "#71717a", children: "|" }),
          Zen.Text({ fg: "#e4e4e7", children: "Design System Beta" })
        ]
      }),

      // Spacing
      Zen.Box({ height: 1 }),

      // Composite Component row: Pills
      Zen.Box({
        flexDirection: "row", gap: 1, height: 1,
        children: [
          Zen.Text({ fg: "#a1a1aa", children: "Badges: " }),
          ZenPill({ text: "Stable", bg: "#064e3b", fg: "#10b981" }),
          ZenPill({ text: "V0.1.0", bg: "#1e3a8a", fg: "#60a5fa" }),
          ZenPill({ text: "Native", bg: "#78350f", fg: "#f59e0b" })
        ]
      }),

      Zen.Box({ height: 1 }),

      // Buttons container
      Zen.Box({
        flexDirection: "row", gap: 2, height: 1,
        children: [
          Zen.Text({ fg: "#a1a1aa", children: "Actions: " }),
          ZenButton({ label: "Commit", focused: activeBtn() === 0 }),
          ZenButton({ label: "Push", focused: activeBtn() === 1 }),
          ZenButton({ label: "Fetch", focused: activeBtn() === 2 })
        ]
      }),

      Zen.Box({ flexGrow: 1 }),

      // Footer
      Zen.Box({
        height: 1, width: "100%", bg: "#18181b", paddingX: 1,
        children: Zen.Text({ fg: "#71717a", children: "Tab/Arrows to navigate • Press 'q' to exit" })
      })
    ]
  });
}
