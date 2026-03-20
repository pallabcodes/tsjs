import React from "react";
import { Box, Text } from "ink";
import { useAppStore } from "../store/index.js";
import { getTheme, icons } from "../ui/theme.js";
import { rebase } from "../features/rebase/facade.js";

export function StatusBar({ width }: { width: number }) {
  const { state } = useAppStore();
  const theme = getTheme(state.themeName);
  const { currentBranch, status, notification, branches, activeView } = state;

  const info = branches.find(b => b.current);
  const ahead = info?.ahead ?? 0;
  const behind = info?.behind ?? 0;
  const staged = status.filter(f => f.staged).length;
  const unstaged = status.filter(f => !f.staged && f.status !== "??").length;
  const untracked = status.filter(f => f.status === "??").length;

  return (
    <Box flexDirection="column" width="100%">
      {notification && (
        <Box paddingX={1} {...({ backgroundColor: theme.accentCyan } as any)}>
          <Text
            color={notification.type === "success" ? theme.accentGreen
              : notification.type === "warning" ? theme.accentOrange
              : notification.type === "error" ? theme.accentRed
              : theme.accentBlue}
            bold
          >
            {icons.notification} {notification.message}
          </Text>
        </Box>
      )}

      <Box paddingX={1} gap={2} width="100%" borderStyle="single" borderColor={theme.border} borderTop={true} borderBottom={false} borderLeft={false} borderRight={false}>
        <Box gap={1}>
          <Text color={theme.accentBlue}>{icons.circle}</Text>
          <Text color={theme.branchCurrent} bold>{currentBranch}</Text>
          {ahead > 0 && <Text color={theme.accentGreen}>{icons.ahead}{ahead}</Text>}
          {behind > 0 && <Text color={theme.accentRed}>{icons.behind}{behind}</Text>}
        </Box>

        <Box gap={1}>
          {staged > 0 && <Text color={theme.staged}>{icons.staged} {staged}</Text>}
          {unstaged > 0 && <Text color={theme.unstaged}>{icons.unstaged} {unstaged}</Text>}
          {untracked > 0 && <Text color={theme.untracked}>{icons.untracked} {untracked}</Text>}
        </Box>


        <Box flexGrow={1} justifyContent="flex-end">
          <Text color={theme.textMuted}>
            {rebase.selectors.isMessageStage(state.rebase) ? (
              "[5] Go to Rebase to finish message"
            ) : state.rebase.stage === "stopped_for_edit" ? (
              "[o] Status [Enter] Continue [k] Skip [Esc] Abort"
            ) : rebase.selectors.isRuntimeStage(state.rebase) && state.rebase.runtime?.currentIndex !== null ? (
              "[Enter] Continue [k] Skip [o] Status [Esc] Abort"
            ) : (
              <>
                {activeView === "LOG" && "[t] Templ [n/N] Limit [r] Rebase [g] --root"}
                {activeView === "STATUS" && "[s/u] Stage [a] All [Enter] Commit [P] Push"}
                {activeView === "REBASE" && "[a] Cycle [J/K] Move [Enter] Start [Esc] Back"}
                {activeView === "BRANCHES" && "[Enter] Switch [d] Delete"}
                {activeView === "STASH" && "[Enter] Apply [p] Pop [d] Drop"}
                {" [T] Theme [:] Cmd [q] Quit"}
              </>
            )}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
