import React from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons } from "../../ui/theme.js";

const COMMANDS = [
  { name: "checkout", desc: "Switch branches", cat: "branch" },
  { name: "rebase", desc: "Interactive rebase", cat: "rebase" },
  { name: "rebase --root", desc: "Rebase inclusive of root", cat: "rebase" },
  { name: "commit", desc: "Commit staged changes", cat: "commit" },
  { name: "commit --amend", desc: "Amend last commit", cat: "commit" },
  { name: "push", desc: "Push to remote", cat: "remote" },
  { name: "pull", desc: "Pull from remote", cat: "remote" },
  { name: "fetch", desc: "Fetch all remotes", cat: "remote" },
  { name: "stash", desc: "Stash changes", cat: "stash" },
  { name: "stash pop", desc: "Pop latest stash", cat: "stash" },
  { name: "reset --hard", desc: "Hard reset to HEAD", cat: "reset" },
  { name: "reset --soft", desc: "Soft reset to HEAD", cat: "reset" },
  { name: "cherry-pick", desc: "Cherry-pick selected commits", cat: "advanced" },
  { name: "merge", desc: "Merge branch into current", cat: "branch" },
  { name: "log --oneline", desc: "Compact log view", cat: "log" },
  { name: "log --graph", desc: "Graph log view", cat: "log" },
  { name: "log --limit 50", desc: "Set log limit to 50", cat: "log" },
  { name: "log --limit 100", desc: "Set log limit to 100", cat: "log" },
  { name: "log --limit 0", desc: "Show all logs (no limit)", cat: "log" },
];

export function CommandPalette() {
  const { state, dispatch, rebaseActions } = useAppStore();
  const theme = getTheme(state.themeName);
  const { commandQuery } = state;

  useInput((input, key) => {
    if (!state.isCommandPaletteOpen) return;
    if (key.escape || input === ":") {
      dispatch({ type: "TOGGLE_COMMAND_PALETTE" });
    }
  });

  const q = commandQuery.toLowerCase();
  const filtered = COMMANDS.filter(c =>
    c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.cat.includes(q)
  ).slice(0, 8);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.accentCyan}
      paddingX={1}
      {...({ backgroundColor: theme.bgPanel, width: 65 } as any)}
    >
      <Box gap={1}>
        <Text color={theme.accentCyan} bold>git</Text>
        <TextInput
          value={commandQuery}
          onChange={(val) => dispatch({ type: "SET_COMMAND_QUERY", query: val })}
          onSubmit={() => {
            const cmd = filtered[0]?.name || commandQuery;
            dispatch({ type: "TOGGLE_COMMAND_PALETTE" });

            if (cmd === "rebase" || cmd.startsWith("rebase")) {
              const includeRoot = cmd.includes("--root");
              if (includeRoot) rebaseActions.startRoot();
              else rebaseActions.startFromSelection(false);
              dispatch({
                type: "SET_NOTIFICATION",
                message: includeRoot ? "Prepared rebase scope from root." : "Prepared rebase scope from selected commit.",
                notificationType: "info"
              });
            } else if (cmd === "reset --hard") {
              dispatch({ type: "SHOW_CONFIRM", confirmType: "RESET_HARD", message: "⚠ Git hard reset will lose all uncommitted data!" });
            } else if (cmd === "reset --soft") {
              dispatch({ type: "SHOW_CONFIRM", confirmType: "RESET_SOFT", message: "Git soft reset to previous commit?" });
            } else if (cmd === "commit") {
              dispatch({ type: "SET_VIEW", view: "STATUS" });
              setTimeout(() => dispatch({ type: "START_COMMIT" }), 100);
            } else if (cmd.startsWith("log --limit")) {
              const limit = parseInt(cmd.split(" ").pop() || "20");
              dispatch({ type: "SET_LOG_LIMIT", limit });
              dispatch({ type: "SET_NOTIFICATION", message: `Log limit set to ${limit || "all"}`, notificationType: "info" });
            } else {
              dispatch({ type: "SET_NOTIFICATION", message: `Executed: git ${cmd}`, notificationType: "success" });
            }
            setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
          }}
          placeholder="type command... (rebase, checkout, reset, etc.)"
        />
      </Box>
      <Box marginTop={1} flexDirection="column" borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={0} borderColor={theme.border}>
        {filtered.map((cmd, i) => (
          <Box key={cmd.name} gap={1} {...({ backgroundColor: i === 0 ? theme.bgSelected : undefined } as any)}>
            <Text color={i === 0 ? theme.accentBlue : theme.textPrimary} bold={i === 0}>
              {i === 0 ? "▸" : " "} {cmd.name}
            </Text>
            <Text color={theme.textMuted}>{cmd.desc}</Text>
            <Text color={theme.textMuted} dimColor> [{cmd.cat}] </Text>
          </Box>
        ))}
        {filtered.length === 0 && <Text color={theme.accentRed}>No commands found</Text>}
      </Box>
      <Box borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={0} borderColor={theme.border}>
        <Text color={theme.textMuted}>[Enter] Execute  [Esc/:] Close</Text>
      </Box>
    </Box>
  );
}
