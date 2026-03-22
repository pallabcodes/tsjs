import { Zen } from "@zen-tui/solid";

export const ZenButton = (props: { label: string; focused?: boolean }) => {
  return Zen.Box({
    bg: props.focused ? "#5b9df9" : "#1e1e24",
    paddingX: 2,
    border: true,
    borderColor: props.focused ? "#ffffff" : "#3f3f46",
    children: Zen.Text({ fg: props.focused ? "#000000" : "#ffffff", bold: props.focused, children: props.label })
  });
};
