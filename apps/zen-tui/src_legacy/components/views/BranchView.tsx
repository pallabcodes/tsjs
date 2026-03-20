import React from "react";
import { Box, Text, useInput } from "ink";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons } from "../../ui/theme.js";

export function BranchView({ height }: { height: number }) {
  const { state, dispatch } = useAppStore();
  const theme = getTheme(state.themeName);
  const { branches, selectedBranchIndex, currentBranch } = state;

  useInput((input, key) => {
    if (state.activeView !== "BRANCHES" || state.isCommandPaletteOpen || state.confirmDialog) return;

    if (key.upArrow || input === "k") {
      dispatch({ type: "SET_SELECTED_BRANCH", index: Math.max(0, selectedBranchIndex - 1) });
    }
    if (key.downArrow || input === "j") {
      dispatch({ type: "SET_SELECTED_BRANCH", index: Math.min(branches.length - 1, selectedBranchIndex + 1) });
    }
    if (key.return) {
      const b = branches[selectedBranchIndex];
      if (b && b.name !== currentBranch) {
        dispatch({ type: "SET_NOTIFICATION", message: `Switched to branch '${b.name}'`, notificationType: "success" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
    }
    if (input === "d") {
      const b = branches[selectedBranchIndex];
      if (b && b.name !== currentBranch) {
        dispatch({ type: "SET_NOTIFICATION", message: `Deleted branch '${b.name}'`, notificationType: "warning" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor={theme.border} {...({ backgroundColor: theme.bg } as any)}>
      <Box paddingX={1} justifyContent="space-between" borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={theme.border}>
        <Text bold color={theme.accentBlue}>LOCAL BRANCHES</Text>
        <Text color={theme.textMuted}>{branches.length} branches</Text>
      </Box>

      <Box flexDirection="column" paddingTop={1} flexGrow={1}>
          {branches.map((branch, i) => {
          const isSelected = i === selectedBranchIndex;
          const isCurrent = branch.name === currentBranch;

          return (
            <Box key={branch.name} paddingX={1} gap={1} {...({ backgroundColor: isSelected ? theme.bgSelected : undefined } as any)}>
              <Text color={isSelected ? theme.accentBlue : theme.textMuted}>{isSelected ? "▸" : " "}</Text>
              <Text color={isCurrent ? theme.branchCurrent : (isSelected ? theme.textPrimary : theme.textSecondary)} bold={isCurrent}>
                {isCurrent ? `${icons.branch} ` : "  "}{branch.name}
              </Text>
              <Text color={theme.commitHash}> {branch.lastCommit} </Text>
              {branch.ahead > 0 && <Text color={theme.accentGreen}>{icons.ahead}{branch.ahead}</Text>}
              {branch.behind > 0 && <Text color={theme.accentRed}>{icons.behind}{branch.behind}</Text>}
              {branch.upstream && <Text color={theme.textMuted}> {icons.arrow} {branch.upstream}</Text>}
            </Box>
          );
        })}
      </Box>

      <Box paddingX={1} borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={1} borderColor={theme.border}>
        <Text color={theme.textMuted}>[Enter] Checkout  [d] Delete  [j/k] Navigate</Text>
      </Box>
    </Box>
  );
}
