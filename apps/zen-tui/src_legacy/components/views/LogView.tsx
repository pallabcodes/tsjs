import React from "react";
import { Box, Text, useInput } from "ink";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons } from "../../ui/theme.js";
import { CommitGraph } from "../common/CommitGraph.js";
import { LogTemplate } from "../../types/index.js";

const TEMPLATES: LogTemplate[] = ["focus", "review", "surgery", "graph"];
const TEMPLATE_LABELS: Record<LogTemplate, string> = {
  focus: "Focus",
  review: "Review",
  surgery: "Surgery",
  graph: "Graph",
};

export function LogView({ height, width }: { height: number; width: number }) {
  const { state, dispatch, rebaseActions } = useAppStore();
  const theme = getTheme(state.themeName);
  const { commits, selectedCommitIndex, selectedCommitHashes, focusedPanel, logTemplate, logLimit } = state;

  const isMainFocused = focusedPanel === "MAIN";
  const isSideFocused = focusedPanel === "SIDE";

  const effectiveCommits = logLimit > 0 ? commits.slice(0, logLimit) : commits;
  const viewportHeight = Math.max(1, height - 5);
  const scrollOffset = Math.max(0, Math.min(selectedCommitIndex - Math.floor(viewportHeight / 2), effectiveCommits.length - viewportHeight));
  const visibleCommits = effectiveCommits.slice(scrollOffset, scrollOffset + viewportHeight);

  useInput((input, key) => {
    if (state.activeView !== "LOG" || state.isCommandPaletteOpen || state.confirmDialog) return;

    if (isMainFocused) {
      if (key.upArrow || input === "k") {
        dispatch({ type: "SET_SELECTED_COMMIT", index: Math.max(0, selectedCommitIndex - 1) });
      }
      if (key.downArrow || input === "j") {
        dispatch({ type: "SET_SELECTED_COMMIT", index: Math.min(effectiveCommits.length - 1, selectedCommitIndex + 1) });
      }
      if (input === " ") {
        const commit = effectiveCommits[selectedCommitIndex];
        if (commit) dispatch({ type: "TOGGLE_COMMIT_SELECTION", hash: commit.hash });
      }
      if (input === "t") {
        const idx = TEMPLATES.indexOf(logTemplate);
        dispatch({ type: "SET_LOG_TEMPLATE", template: TEMPLATES[(idx + 1) % TEMPLATES.length]! });
      }
      if (input === "n") {
         dispatch({ type: "SET_LOG_LIMIT", limit: Math.max(5, logLimit - 5) });
      }
      if (input === "N") {
         dispatch({ type: "SET_LOG_LIMIT", limit: logLimit + 5 });
      }
      if (input === "r") {
        rebaseActions.startFromSelection(false);
      }
      if (input === "g") {
        rebaseActions.startRoot();
      }

      // Restore missing actions
      const commit = effectiveCommits[selectedCommitIndex];
      if (commit) {
        if (input === "b") {
          dispatch({ type: "SET_NOTIFICATION", message: `Branch created from ${commit.shortHash}`, notificationType: "success" });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
        }
        if (input === "c") {
          dispatch({ type: "SET_NOTIFICATION", message: `Checked out ${commit.shortHash} (detached)`, notificationType: "info" });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
        }
        if (input === "p") {
          dispatch({ type: "SET_NOTIFICATION", message: `Cherry-picked ${commit.shortHash}`, notificationType: "success" });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
        }
        if (input === "R") {
          dispatch({ 
            type: "SHOW_CONFIRM", 
            confirmType: "RESET_HARD", 
            message: `⚠ HARD RESET to ${commit.shortHash}? All uncommitted data will be lost.`,
            payload: commit.hash
          });
        }
        if (input === "S") {
          dispatch({ 
            type: "SHOW_CONFIRM", 
            confirmType: "RESET_SOFT", 
            message: `Confirm SOFT RESET to ${commit.shortHash}?`,
            payload: commit.hash
          });
        }
      }
    }

    if (isSideFocused) {
       if (key.escape) dispatch({ type: "SET_FOCUS", panel: "MAIN" });
    }
  });

  const showGraph = logTemplate === "graph" || logTemplate === "focus";

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor={isMainFocused ? theme.accentBlue : theme.border}>
      <Box paddingX={1} justifyContent="space-between" borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={theme.border}>
        <Box gap={2}>
          <Text bold color={isMainFocused ? theme.accentBlue : theme.textSecondary}>COMMIT LOG</Text>
          <Text color={theme.accentCyan}>{icons.gear} {TEMPLATE_LABELS[logTemplate]} (limit: {logLimit || "all"})</Text>
        </Box>
        <Text color={theme.textMuted}>{selectedCommitIndex + 1}/{effectiveCommits.length} shown ({commits.length} total)</Text>
      </Box>

      <Box paddingX={1} paddingTop={0} flexGrow={1}>
        {showGraph && <CommitGraph commits={visibleCommits} height={viewportHeight} themeName={state.themeName} />}

        <Box flexDirection="column" paddingLeft={showGraph ? 1 : 0} flexGrow={1}>
          {visibleCommits.map((commit, i) => {
            const absIdx = i + scrollOffset;
            const isSelected = absIdx === selectedCommitIndex;
            const isMulti = selectedCommitHashes.has(commit.hash);
            const tag = commit.tags?.[0];

            return (
              <Box key={commit.hash}>
                <Text color={isMulti ? theme.accentGreen : (isSelected ? theme.accentBlue : theme.textMuted)}>
                  {isMulti ? icons.staged : (isSelected ? "▸" : " ")} 
                </Text>
                <Text color={theme.commitHash} bold={isSelected}> {commit.shortHash} </Text>
                {tag && <Text color={theme.tagColor}>({tag}) </Text>}
                <Text
                  color={isSelected ? theme.textPrimary : theme.textSecondary}
                  inverse={isSelected && isMainFocused}
                  wrap="truncate"
                >
                  {commit.message}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
