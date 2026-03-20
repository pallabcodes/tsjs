import React from "react";
import { Box, Text } from "ink";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons, box } from "../../ui/theme.js";
import { ViewType } from "../../types/index.js";
import { rebase } from "../../features/rebase/facade.js";

const TABS: { label: string; view: ViewType; key: string }[] = [
  { label: "LOG", view: "LOG", key: "1" },
  { label: "STATUS", view: "STATUS", key: "2" },
  { label: "BRANCHES", view: "BRANCHES", key: "3" },
  { label: "STASH", view: "STASH", key: "4" },
  { label: "REBASE", view: "REBASE", key: "5" },
];

export function Header({ width }: { width: number }) {
  const { state } = useAppStore();
  const theme = getTheme(state.themeName);
  const runtime = state.rebase.runtime;

  return (
    <Box paddingX={1} width="100%" justifyContent="space-between" borderStyle="single" borderColor={theme.border} borderTop={false} borderLeft={false} borderRight={false}>
      {/* Left Column: Brand & Active Rebase Status */}
      <Box gap={1} alignItems="center">
        <Text bold color={theme.accentCyan}>ZEN-TUI</Text>
        {rebase.selectors.isRuntimeStage(state.rebase) && runtime?.currentIndex !== null && (
          <Box {...({ backgroundColor: theme.accentOrange } as any)} paddingX={1}>
            <Text color={theme.bg} bold>
               {(runtime?.currentIndex ?? 0) + 1}/{runtime?.total ?? 0}
               {state.rebase.stage === "stopped_for_edit" ? " EDIT" : rebase.selectors.isMessageStage(state.rebase) ? " MSG" : ""}
            </Text>
          </Box>
        )}
        {(state.rebase.stage === "scope_draft" || rebase.selectors.isPlanStage(state.rebase)) && state.activeView === "REBASE" && (
          <Box gap={1}>
            <Box {...({ backgroundColor: theme.accentOrange } as any)} paddingX={1}>
              <Text color={theme.bg} bold> {state.rebase.stage === "scope_draft" ? " SCOPE " : " PLAN "} </Text>
            </Box>
            {state.rebase.scope && <Text color={theme.accentCyan}>{rebase.selectors.getScopeLabel(state.rebase)}</Text>}
          </Box>
        )}
      </Box>

      {/* Middle Column: Primary Navigation View Tabs */}
      <Box gap={0}>
        {TABS.map((tab) => {
          const isActive = state.activeView === tab.view;
          return (
            <Box key={tab.view} paddingX={1} {...(isActive ? { backgroundColor: theme.bgSelected } as any : {})}>
              <Text color={isActive ? theme.accentBlue : theme.textMuted} bold={isActive}>
                {tab.key} {tab.label}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Right Column: Contextual Info & Theme */}
      <Box gap={1} alignItems="center">
        {state.upstreamAlert && (
          <Box {...({ backgroundColor: theme.accentOrange } as any)} paddingX={1} marginRight={1}>
            <Text color={theme.bg} bold> ↓{state.upstreamAlert.newCommits} new </Text>
          </Box>
        )}
        <Text color={theme.textMuted}>{state.themeName.toUpperCase()}</Text>
        <Text color={theme.textMuted}>|</Text>
        <Text color={theme.branchCurrent} bold>{icons.branch} {state.currentBranch}</Text>
      </Box>
    </Box>
  );
}
