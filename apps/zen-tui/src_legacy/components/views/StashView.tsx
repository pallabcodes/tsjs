import React from "react";
import { Box, Text, useInput } from "ink";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons } from "../../ui/theme.js";

export function StashView({ height }: { height: number }) {
  const { state, dispatch } = useAppStore();
  const theme = getTheme(state.themeName);
  const { stashes, selectedStashIndex } = state;

  useInput((input, key) => {
    if (state.activeView !== "STASH" || state.isCommandPaletteOpen || state.confirmDialog) return;

    if (key.upArrow || input === "k") {
      dispatch({ type: "SET_SELECTED_STASH", index: Math.max(0, selectedStashIndex - 1) });
    }
    if (key.downArrow || input === "j") {
      dispatch({ type: "SET_SELECTED_STASH", index: Math.min(stashes.length - 1, selectedStashIndex + 1) });
    }
    if (key.return) {
      const s = stashes[selectedStashIndex];
      if (s) {
        dispatch({ type: "APPLY_STASH", id: s.id });
        dispatch({ type: "SET_NOTIFICATION", message: `Applied stash@{${s.id}}: ${s.message}`, notificationType: "success" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
    }
    if (input === "p") {
      const s = stashes[selectedStashIndex];
      if (s) {
        dispatch({ type: "POP_STASH", id: s.id });
        dispatch({ type: "SET_NOTIFICATION", message: `Popped stash@{${s.id}}: ${s.message}`, notificationType: "success" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
    }
    if (input === "d") {
      const s = stashes[selectedStashIndex];
      if (s) {
        dispatch({ type: "DROP_STASH", id: s.id });
        dispatch({ type: "SET_NOTIFICATION", message: `Dropped stash@{${s.id}}`, notificationType: "warning" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor={theme.border} {...({ backgroundColor: theme.bg } as any)}>
      <Box paddingX={1} justifyContent="space-between" borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={theme.border}>
        <Text bold color={theme.accentPurple}>STASH LIST</Text>
        <Text color={theme.textMuted}>{stashes.length} stashed states</Text>
      </Box>

      {stashes.length === 0 && (
        <Box paddingX={1} marginTop={1}>
          <Text color={theme.textMuted}>No stashes found. Save changes with 'git stash'</Text>
        </Box>
      )}

      <Box flexDirection="column" paddingTop={1} flexGrow={1}>
        {stashes.map((stash, i) => {
          const isSelected = i === selectedStashIndex;

          return (
            <Box key={stash.id} paddingX={1} gap={1} {...({ backgroundColor: isSelected ? theme.bgSelected : undefined } as any)}>
              <Text color={isSelected ? theme.accentBlue : theme.textMuted}>{isSelected ? "▸" : " "}</Text>
              <Text color={theme.accentPurple} bold={isSelected}>stash@{"{" + stash.id + "}"}</Text>
              <Box flexDirection="column" flexGrow={1}>
                 <Text color={isSelected ? theme.textPrimary : theme.textSecondary}>{stash.message}</Text>
                 <Text color={theme.textMuted}>on {stash.branch} | {stash.date} | {stash.files} files</Text>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box paddingX={1} borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={1} borderColor={theme.border}>
        <Text color={theme.textMuted}>[Enter] Apply  [p] Pop  [d] Drop  [j/k] Navigate</Text>
      </Box>
    </Box>
  );
}
