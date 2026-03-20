import React, { createContext, ReactNode, useContext, useMemo, useReducer } from "react";
import { AppState } from "./model.js";
import { ShellAction } from "./intents.js";
import { getMockRepoState } from "../../store/mock-data.js";
import { THEME_NAMES, setActiveTheme } from "../../ui/theme.js";
import { toggleNumberInList, toggleSetValue } from "../../lib/collections.js";
import { rebase } from "../../features/rebase/facade.js";
import { Commit, Stash } from "../../types/core.js";

const initialState: AppState = {
  activeView: "LOG",
  currentBranch: "main",
  commits: [],
  selectedCommitIndex: 0,
  selectedCommitHashes: new Set(),
  status: [],
  selectedStatusIndex: 0,
  branches: [],
  selectedBranchIndex: 0,
  stashes: [],
  selectedStashIndex: 0,
  rebase: rebase.createIdleState(),
  diffs: new Map(),
  isCommandPaletteOpen: false,
  commandQuery: "",
  notification: null,
  focusedPanel: "MAIN",
  selectedFile: null,
  logTemplate: "focus",
  logLimit: 20,
  themeName: "midnight",
  upstreamAlert: null,
  isCommitting: false,
  commitMessage: "",
  diffScrollOffset: 0,
  selectedHunkIndex: 0,
  confirmDialog: null,
};

function shellReducer(state: AppState, action: ShellAction): AppState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, activeView: action.view, focusedPanel: "MAIN", isCommitting: false, confirmDialog: null };
    case "SET_SELECTED_COMMIT":
      return { ...state, selectedCommitIndex: action.index };
    case "TOGGLE_COMMIT_SELECTION":
      return { ...state, selectedCommitHashes: toggleSetValue(state.selectedCommitHashes, action.hash) };
    case "SET_SELECTED_STATUS":
      return { ...state, selectedStatusIndex: action.index, diffScrollOffset: 0, selectedHunkIndex: 0 };
    case "SET_SELECTED_BRANCH":
      return { ...state, selectedBranchIndex: action.index };
    case "SET_SELECTED_STASH":
      return { ...state, selectedStashIndex: action.index };
    case "SET_NOTIFICATION":
      return { ...state, notification: { message: action.message, type: action.notificationType } };
    case "CLEAR_NOTIFICATION":
      return { ...state, notification: null };
    case "TOGGLE_COMMAND_PALETTE":
      return { ...state, isCommandPaletteOpen: !state.isCommandPaletteOpen, commandQuery: "" };
    case "SET_COMMAND_QUERY":
      return { ...state, commandQuery: action.query };
    case "SET_FOCUS":
      return { ...state, focusedPanel: action.panel };
    case "SELECT_FILE":
      return { ...state, selectedFile: action.file, diffScrollOffset: 0, selectedHunkIndex: 0 };
    case "SET_LOG_TEMPLATE":
      return { ...state, logTemplate: action.template };
    case "SET_LOG_LIMIT":
      return { ...state, logLimit: action.limit };
    case "CYCLE_THEME": {
      const currentIdx = THEME_NAMES.indexOf(state.themeName);
      const nextTheme = THEME_NAMES[(currentIdx + 1) % THEME_NAMES.length]!;
      setActiveTheme(nextTheme);
      return { ...state, themeName: nextTheme };
    }
    case "STAGE_FILE":
      return { ...state, status: state.status.map((file) => file.path === action.path ? { ...file, staged: true } : file) };
    case "UNSTAGE_FILE":
      return { ...state, status: state.status.map((file) => file.path === action.path ? { ...file, staged: false } : file) };
    case "STAGE_ALL":
      return { ...state, status: state.status.map((file) => ({ ...file, staged: true, stagedHunkIndexes: [] })) };
    case "TOGGLE_HUNK_STAGING": {
      const status = state.status.map((file) => {
        if (file.path !== action.path) return file;
        const hunkArray = toggleNumberInList(file.stagedHunkIndexes || [], action.hunkIndex);
        const diff = state.diffs.get(file.path);
        const allHunksStaged = diff ? hunkArray.length === diff.hunks.length : false;
        return { ...file, staged: allHunksStaged, stagedHunkIndexes: allHunksStaged ? [] : hunkArray };
      });
      return { ...state, status };
    }
    case "START_COMMIT":
      return { ...state, isCommitting: true, commitMessage: "" };
    case "CANCEL_COMMIT":
      return { ...state, isCommitting: false, commitMessage: "" };
    case "SET_COMMIT_MESSAGE":
      return { ...state, commitMessage: action.message };
    case "FINISH_COMMIT": {
      const newCommit: Commit = {
        hash: "new_hash_" + Math.random().toString(36).substring(7),
        shortHash: "h" + Math.random().toString(36).substring(2, 5),
        message: state.commitMessage,
        author: "You",
        date: "Just now",
        parents: [state.commits[0]?.hash || ""],
        branch: state.currentBranch,
      };
      return { ...state, commits: [newCommit, ...state.commits], status: state.status.filter((file) => !file.staged), isCommitting: false, commitMessage: "" };
    }
    case "PUSH":
      return state;
    case "STASH_CHANGES": {
      const newStash: Stash = {
        id: state.stashes.length,
        message: action.message,
        branch: state.currentBranch,
        hash: "stash_" + Math.random().toString(36).substring(7),
        date: "Just now",
        files: state.status.length,
      };
      return { ...state, stashes: [newStash, ...state.stashes], status: [] };
    }
    case "POP_STASH":
      return { ...state, stashes: state.stashes.filter((stash) => stash.id !== action.id) };
    case "DROP_STASH":
      return { ...state, stashes: state.stashes.filter((stash) => stash.id !== action.id) };
    case "APPLY_STASH":
      return state;
    case "SHOW_CONFIRM":
      return { ...state, confirmDialog: { type: action.confirmType, message: action.message, payload: action.payload } };
    case "HIDE_CONFIRM":
      return { ...state, confirmDialog: null };
    case "SCROLL_DIFF":
      return { ...state, diffScrollOffset: Math.max(0, state.diffScrollOffset + action.offset) };
    case "SET_SELECTED_HUNK": {
      const file = state.selectedFile;
      if (!file) return { ...state, selectedHunkIndex: action.index };
      const diff = state.diffs.get(file.path);
      if (!diff) return { ...state, selectedHunkIndex: action.index };
      let offset = 0;
      for (let i = 0; i < action.index; i++) {
        offset += (diff.hunks[i]?.lines.length || 0) + 1;
      }
      return { ...state, selectedHunkIndex: action.index, diffScrollOffset: offset };
    }
    case "RESET_HARD":
      return { ...state, status: [], selectedCommitIndex: 0, confirmDialog: null };
    case "RESET_SOFT":
      return { ...state, status: [...state.status], selectedCommitIndex: 0, confirmDialog: null };
    case "SET_REBASE_STATE":
      return {
        ...state,
        rebase: action.state,
        activeView: action.state.stage === "stopped_for_edit" || action.state.stage === "stopped_for_conflict" ? "STATUS" : action.state.stage === "idle" || action.state.stage === "completed" || action.state.stage === "aborted" ? "LOG" : "REBASE",
        focusedPanel: "MAIN",
      };
    case "REBASE_SELECT_INDEX":
      return { ...state, rebase: rebase.selectIndex(state.rebase, action.index) };
    case "REBASE_SET_ACTION":
      return { ...state, rebase: rebase.setAction(state.rebase, { index: action.index, action: action.action }) };
    case "REBASE_MOVE_ITEM":
      return { ...state, rebase: rebase.move(state.rebase, { from: action.from, to: action.to }) };
    case "REBASE_CYCLE_SCOPE_KIND":
      return { ...state, rebase: rebase.cycleScopeKind(state.rebase) };
    case "REBASE_TOGGLE_SCOPE_OPTION":
      return { ...state, rebase: rebase.toggleScopeOption(state.rebase, action.option) };
    case "REBASE_CONFIRM_SCOPE":
      return { ...state, rebase: rebase.confirmScope(state.rebase), activeView: "REBASE" };
    case "REBASE_SET_MESSAGE":
      return { ...state, rebase: rebase.setMessage(state.rebase, action.message) };
    case "RESOLVE_CONFLICT":
      return { ...state, rebase: rebase.resolveConflict(state.rebase), notification: { message: "All conflicts resolved. You can now continue.", type: "success" } };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<ShellAction>;
  rebaseActions: {
    startFromSelection(includeRoot?: boolean): void;
    startRoot(): void;
    begin(): Promise<void>;
    continue(): Promise<void>;
    skip(): Promise<void>;
    abort(): Promise<void>;
    submitMessage(): Promise<void>;
  };
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shellReducer, {
    ...initialState,
    ...(getMockRepoState() as Partial<AppState>),
  });

  const rebaseActions = useMemo(() => ({
    startFromSelection(includeRoot = false) {
      dispatch({
        type: "SET_REBASE_STATE",
        state: rebase.startFromSelection({
          commits: state.commits,
          selectedIndex: state.selectedCommitIndex,
          includeRoot,
          currentBranch: state.currentBranch,
        }),
      });
    },
    startRoot() {
      dispatch({
        type: "SET_REBASE_STATE",
        state: rebase.startRoot({
          commits: state.commits,
          currentBranch: state.currentBranch,
        }),
      });
    },
    async begin() {
      const next = await rebase.begin(state.rebase);
      dispatch({ type: "SET_REBASE_STATE", state: next });
    },
    async continue() {
      const next = await rebase.continue(state.rebase);
      dispatch({ type: "SET_REBASE_STATE", state: next });
    },
    async skip() {
      const next = await rebase.skip(state.rebase);
      dispatch({ type: "SET_REBASE_STATE", state: next });
    },
    async abort() {
      const next = await rebase.abort(state.rebase);
      dispatch({ type: "SET_REBASE_STATE", state: next });
      dispatch({ type: "SET_NOTIFICATION", message: "Rebase aborted. Workspace restored.", notificationType: "warning" });
    },
    async submitMessage() {
      const next = await rebase.submitMessage(state.rebase);
      dispatch({ type: "SET_REBASE_STATE", state: next });
    },
  }), [state]);

  return <AppContext.Provider value={{ state, dispatch, rebaseActions }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within an AppProvider");
  return context;
}
