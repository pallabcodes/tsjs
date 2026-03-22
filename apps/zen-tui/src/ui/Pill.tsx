import { Zen } from "@zen-tui/solid";

export const ZenPill = (props: { text: string; bg?: string; fg?: string }) => {
  return Zen.Box({
    bg: props.bg || "#2a2a35",
    paddingX: 1,
    border: true,
    borderColor: props.fg || "#a1a1aa",
    children: Zen.Text({ fg: props.fg || "#e4e4e7", children: props.text })
  });
};
