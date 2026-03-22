import { createSignal, onMount, createComponent, Show } from "solid-js";
import { Zen } from "@zen-tui/solid";
import { ZenPill } from "../ui/Pill.tsx";

export default function App(props: { onInput?: (e: any) => void }) {
  const [activePanel, setActivePanel] = createSignal("sidebar");
  const [selectedFile, setSelectedFile] = createSignal(0);
  const [showModal, setShowModal] = createSignal(false);

  onMount(() => {
    if (props.onInput) {
      props.onInput(handleInput);
    }
  });

  const handleInput = (e: any) => {
    if (e.name === "q") process.exit(0);

    if (showModal()) {
      if (e.name === "escape") setShowModal(false);
      return; 
    }
    
    if (e.name === "tab") {
      setActivePanel(s => (s === "sidebar" ? "commits" : "sidebar"));
    }

    if (e.name === "n") {
       setShowModal(true);
    }

    if (activePanel() === "sidebar") {
      if (e.name === "down") setSelectedFile(s => Math.min(s + 1, 3));
      if (e.name === "up") setSelectedFile(s => Math.max(s - 1, 0));
    }
  };

  const files = [
    { name: "src/main.tsx", icon: "" },
    { name: "src/app/App.tsx", icon: "" },
    { name: "reconciler.ts", icon: "" },
    { name: "package.json", icon: "" }
  ];

  const commits = [
    { hash: "cf03a5d", msg: "fix: layout crashes", date: "22:29" },
    { hash: "910db75", msg: "refactor: architecture", date: "20:37" },
    { hash: "df98e6c", msg: "wip: layout bounds", date: "08:56" }
  ];

  return Zen.Box({
    flexDirection: "column", width: "100%", height: "100%", bg: "#09090b",
    children: [
      Zen.Box({
        flexDirection: "row", width: "100%", gap: 2, height: 1, paddingX: 2, bg: "#111827",
        children: [
          Zen.Text({ bold: true, fg: "#60a5fa", children: "ZEN TUI" }),
          ZenPill({ text: " main", bg: "#1e3a8a", fg: "#93c5fd" }),
          Zen.Text({ fg: "#71717a", flexGrow: 1, children: "tsjs/apps/zen-tui" }),
          Zen.Text({ fg: "#10b981", children: "󰊢 Connected" })
        ]
      }),

      Zen.Box({
        flexDirection: "row", flexGrow: 1, width: "100%",
        children: [
          Zen.Box({
            width: "25%", flexDirection: "column", paddingX: 1, paddingY: 1, border: true, 
            borderColor: activePanel() === "sidebar" ? "#60a5fa" : "#27272a",
            children: [
              Zen.Text({ bold: true, fg: activePanel() === "sidebar" ? "#60a5fa" : "#e4e4e7", children: "WORKSPACE" }),
              Zen.Box({ height: 1 }),
              ...files.map((f, i) => Zen.Box({
                bg: i === selectedFile() && activePanel() === "sidebar" ? "#27272a" : "transparent",
                paddingX: 1,
                children: Zen.Text({ 
                  fg: i === selectedFile() && activePanel() === "sidebar" ? "#ffffff" : "#a1a1aa", 
                  children: `${f.icon} ${f.name}` 
                })
              }))
            ]
          }),

          Zen.Box({
            flexGrow: 1, flexDirection: "column",
            children: [
              Zen.Box({
                height: "60%", flexDirection: "column", paddingX: 1, paddingY: 1, border: true, 
                borderColor: activePanel() === "commits" ? "#60a5fa" : "#27272a",
                children: [
                  Zen.Text({ bold: true, fg: activePanel() === "commits" ? "#60a5fa" : "#e4e4e7", children: "COMMIT LOGS" }),
                  Zen.Box({ height: 1 }),
                  ...commits.map(c => Zen.Box({
                    paddingX: 1,
                    children: Zen.Text({ fg: "#e4e4e7", children: `  󰊢 ${c.hash} | ${c.msg} (${c.date})` })
                  }))
                ]
              }),

              Zen.Box({
                flexGrow: 1, flexDirection: "column", paddingX: 1, paddingY: 1, border: true, borderColor: "#27272a",
                children: [
                  Zen.Text({ bold: true, fg: "#e4e4e7", children: "FILE PREVIEW" }),
                  Zen.Box({ height: 1 }),
                  Zen.Text({ fg: "#10b981", children: "  + import { createSignal } from 'solid-js';" }),
                  Zen.Text({ fg: "#10b981", children: "  + export default function App() {" }),
                  Zen.Text({ fg: "#ef4444", children: "  - console.log('Legacy UI');" })
                ]
              })
            ]
          })
        ]
      }),

      Zen.Box({
        height: 1, width: "100%", bg: "#111827", paddingX: 2, flexDirection: "row", gap: 3,
        children: [
          Zen.Text({ fg: "#71717a", children: "N: New Branch" }),
          Zen.Text({ fg: "#71717a", children: "Tab: Focus" }),
          Zen.Text({ fg: "#f87171", children: "q: Exit" })
        ]
      }),

      createComponent(Show, {
        when: showModal,
        keyed: true,
        get children() {
          return Zen.Box({
            fixedPosition: { x: 30, y: 8, w: 52, h: 7 },
            bg: "#1e1b4b", border: true, borderColor: "#60a5fa", flexDirection: "column", paddingX: 1, paddingY: 1,
            children: [
              Zen.Text({ bold: true, fg: "#ffffff", children: "  CREATE NEW BRANCH" }),
              Zen.Box({ height: 1 }),
              Zen.Text({ fg: "#a1a1aa", children: "  Enter branch name:" }),
              Zen.Text({ fg: "#22c55e", children: "  > feature/modal-glow█" }),
              Zen.Box({ height: 1 }),
              Zen.Text({ fg: "#71717a", children: "  Press [ESC] to cancel" })
            ]
          });
        }
      })
    ]
  });
}
