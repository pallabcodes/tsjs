import React from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useAppStore } from "../../store/index.js";
import { getTheme } from "../../ui/theme.js";
import { rebase } from "../../features/rebase/facade.js";

export function RebaseView({ height }: { height: number }) {
  const { state, dispatch, rebaseActions } = useAppStore();
  const theme = getTheme(state.themeName);
  const scopeVm = rebase.presenter.getScopeViewModel(state.rebase);
  const planVm = rebase.presenter.getPlanViewModel(state.rebase);
  const runtimeVm = rebase.presenter.getRuntimeViewModel(state.rebase);
  const selected = rebase.selectors.getSelectedPlanItem(state.rebase);

  useInput((input, key) => {
    if (state.activeView !== "REBASE" || state.isCommandPaletteOpen || state.confirmDialog) return;

    if (rebase.selectors.isScopeDraft(state.rebase)) {
      if (input === "a") dispatch({ type: "REBASE_CYCLE_SCOPE_KIND" });
      if (input === "m") dispatch({ type: "REBASE_TOGGLE_SCOPE_OPTION", option: "preserveMerges" });
      if (input === "u") dispatch({ type: "REBASE_TOGGLE_SCOPE_OPTION", option: "autosquash" });
      if (key.return) dispatch({ type: "REBASE_CONFIRM_SCOPE" });
      if (key.escape) void rebaseActions.abort();
      return;
    }

    if (rebase.selectors.isPlanStage(state.rebase)) {
      if (key.upArrow || input === "k") dispatch({ type: "REBASE_SELECT_INDEX", index: Math.max(0, state.rebase.selectedIndex - 1) });
      if (key.downArrow || input === "j") dispatch({ type: "REBASE_SELECT_INDEX", index: Math.min(state.rebase.plan.length - 1, state.rebase.selectedIndex + 1) });
      if (input === "p") dispatch({ type: "REBASE_SET_ACTION", index: state.rebase.selectedIndex, action: "pick" });
      if (input === "w") dispatch({ type: "REBASE_SET_ACTION", index: state.rebase.selectedIndex, action: "reword" });
      if (input === "e") dispatch({ type: "REBASE_SET_ACTION", index: state.rebase.selectedIndex, action: "edit" });
      if (input === "s") dispatch({ type: "REBASE_SET_ACTION", index: state.rebase.selectedIndex, action: "squash" });
      if (input === "f") dispatch({ type: "REBASE_SET_ACTION", index: state.rebase.selectedIndex, action: "fixup" });
      if (input === "d") dispatch({ type: "REBASE_SET_ACTION", index: state.rebase.selectedIndex, action: "drop" });
      if (input === "K" || (key.shift && key.upArrow)) {
        if (state.rebase.selectedIndex > 0) dispatch({ type: "REBASE_MOVE_ITEM", from: state.rebase.selectedIndex, to: state.rebase.selectedIndex - 1 });
      }
      if (input === "J" || (key.shift && key.downArrow)) {
        if (state.rebase.selectedIndex < state.rebase.plan.length - 1) dispatch({ type: "REBASE_MOVE_ITEM", from: state.rebase.selectedIndex, to: state.rebase.selectedIndex + 1 });
      }
      if (key.return && rebase.canBegin(state.rebase)) void rebaseActions.begin();
      if (key.escape) void rebaseActions.abort();
      return;
    }

    if (rebase.selectors.isMessageStage(state.rebase)) {
      if (key.escape) void rebaseActions.abort();
      if (key.return) void rebaseActions.submitMessage();
      return;
    }

    if (rebase.selectors.isRuntimeStage(state.rebase)) {
      if (key.return && rebase.selectors.canContinue(state.rebase)) void rebaseActions.continue();
      if (input === "k" && rebase.selectors.canSkip(state.rebase)) void rebaseActions.skip();
      if (input === "o") dispatch({ type: "SET_VIEW", view: "STATUS" });
      if (key.escape) void rebaseActions.abort();
    }
  });

  if (state.rebase.stage === "idle" || state.rebase.stage === "completed" || state.rebase.stage === "aborted") {
    return (
      <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor={theme.border} padding={1} justifyContent="center">
        <Text bold color={theme.accentPurple}>REBASE</Text>
        <Text color={theme.textPrimary}>Start from the log or command palette.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor={theme.accentPurple}>
      <Box paddingX={1} justifyContent="space-between" borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={theme.border}>
        <Text bold color={theme.accentPurple}>
          {rebase.selectors.isScopeDraft(state.rebase) ? scopeVm.title : rebase.selectors.isPlanStage(state.rebase) ? planVm.title : runtimeVm.title}
        </Text>
        <Text color={theme.accentCyan}>{state.rebase.scope ? rebase.selectors.getScopeLabel(state.rebase) : ""}</Text>
      </Box>

      {rebase.selectors.isScopeDraft(state.rebase) && (
        <Box flexDirection="column" flexGrow={1} padding={1} gap={1}>
          {scopeVm.options.map((option) => (
            <Text key={option.kind} color={option.active ? theme.accentPurple : theme.textMuted}>
              {option.active ? "> " : "  "}{option.label}
            </Text>
          ))}
          <Box marginTop={1} flexDirection="column">
            {scopeVm.settings.map((setting) => (
              <Text key={setting.label} color={setting.enabled ? theme.accentGreen : theme.textMuted}>
                [{setting.enabled ? "x" : " "}] {setting.label}
              </Text>
            ))}
          </Box>
          <Box marginTop={1}>
            <Text color={theme.textPrimary}>Scope: {scopeVm.summary}</Text>
          </Box>
        </Box>
      )}

      {rebase.selectors.isPlanStage(state.rebase) && (
        <Box flexDirection="column" flexGrow={1} paddingTop={1}>
          <Box flexDirection="column" flexGrow={1}>
            {planVm.rows.map((row) => (
              <Box key={row.hash} paddingX={1}>
                <Text color={row.selected ? theme.accentPurple : theme.textMuted}>{row.selected ? "> " : "  "}</Text>
                <Box width={8}><Text color={row.dropped ? theme.accentRed : theme.accentBlue}>{row.action}</Text></Box>
                <Text color={theme.commitHash}> {row.hash} </Text>
                <Text color={row.dropped ? theme.textMuted : theme.textPrimary} strikethrough={row.dropped} wrap="truncate">{row.subject}</Text>
              </Box>
            ))}
          </Box>
          <Box borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} borderColor={theme.border} paddingX={1} paddingTop={1} flexDirection="column">
            <Text color={theme.textMuted}>[p/w/e/s/f/d] Action [J/K] Move [Enter] Begin [Esc] Abort</Text>
            {state.rebase.validationErrors.length > 0 && state.rebase.validationErrors.map((error) => (
              <Text key={error.code} color={theme.accentRed}>{error.message}</Text>
            ))}
            {selected && (
              <Text color={theme.textMuted}>Allowed: {selected.allowedActions.join(", ")}</Text>
            )}
          </Box>
        </Box>
      )}

      {rebase.selectors.isRuntimeStage(state.rebase) && !rebase.selectors.isMessageStage(state.rebase) && (
        <Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" padding={1}>
          <Box borderStyle="double" borderColor={theme.accentOrange} paddingX={2} paddingY={1} width={60} flexDirection="column">
            <Text color={theme.accentOrange} bold>{runtimeVm.title}</Text>
            <Box marginTop={1}><Text color={theme.textPrimary}>{runtimeVm.reason}</Text></Box>
            <Box marginTop={1}><Text color={theme.textMuted}>{runtimeVm.detail}</Text></Box>
            {state.rebase.recoveryTarget && (
              <Box marginTop={1}><Text color={theme.textMuted}>Abort target: {state.rebase.recoveryTarget.label}</Text></Box>
            )}
          </Box>
        </Box>
      )}

      {rebase.selectors.isMessageStage(state.rebase) && (
        <Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center">
          <Box flexDirection="column" borderStyle="double" borderColor={theme.accentCyan} paddingX={1} width={60} {...({ backgroundColor: theme.bgPanel } as any)}>
            <Text color={theme.accentCyan} bold>{state.rebase.stage === "stopped_for_squash_message" ? "SQUASH MESSAGE" : "REWORD MESSAGE"}</Text>
            <Box marginY={1}>
              <TextInput value={state.rebase.messageBuffer} onChange={(message) => dispatch({ type: "REBASE_SET_MESSAGE", message })} />
            </Box>
            <Text color={theme.textMuted}>[Enter] Submit  [Esc] Abort</Text>
          </Box>
        </Box>
      )}

      <Box paddingX={1} borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={1} borderColor={theme.border}>
        <Text color={theme.textMuted}>{runtimeVm.actions.map((action) => `[${action.key}] ${action.label}`).join("  ")}</Text>
      </Box>
    </Box>
  );
}
