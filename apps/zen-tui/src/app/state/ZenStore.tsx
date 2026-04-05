import { 
  Zen, 
  GitProvider, 
  type CommitData, 
  createSignal, 
  createEffect,
  useContext
} from '@zen-tui/core';

export interface ZenState {
  // Navigation & UI State
  mode: () => 'navigation' | 'review' | 'command';
  selectedCommitId: () => string | null;
  selectedIndex: () => number;
  selectedBranchIdx: () => number;
  currentBranch: () => string;
  statusMessage: () => string;

  // Data State
  commits: () => CommitData[];
  stagedFiles: () => string[];
  unstagedFiles: () => string[];
  branches: () => string[];
  diffContent: () => string;

  // Viewport
  modalVisible: () => boolean;
  selectedStatusIndex: () => number;
}

export type ZenAction =
  | { type: 'SELECT_COMMIT', id: string, index?: number }
  | { type: 'SET_MODE', mode: 'navigation' | 'review' | 'command' }
  | { type: 'TOGGLE_MODAL', visible: boolean }
  | { type: 'UPDATE_COMMITS', commits: CommitData[] }
  | { type: 'UPDATE_DIFF', content: string }
  | { type: 'MOVE_SELECTION', direction: 'up' | 'down' }
  | { type: 'MOVE_STATUS_SELECTION', direction: 'up' | 'down' }
  | { type: 'SET_BRANCH', branch: string }
  | { type: 'STAGE_FILE', path: string }
  | { type: 'UNSTAGE_FILE', path: string }
  | { type: 'COMMIT', message: string };

/**
 * createZenStore: Deterministic State Factory
 */
export function createZenStore() {
  const [mode, setMode] = createSignal<'navigation' | 'review' | 'command'>('navigation');
  const [selectedCommitId, setSelectedCommitId] = createSignal<string | null>(null);
  const [selectedIndex, setSelectedIndex] = createSignal<number>(0);
  const [selectedBranchIdx, setSelectedBranchIdx] = createSignal<number>(0);
  const [currentBranch, setCurrentBranch] = createSignal<string>('main');
  const [statusMessage, setStatusMessage] = createSignal<string>('Ready');
  const [commits, setCommits] = createSignal<CommitData[]>([]);
  const [stagedFiles, setStagedFiles] = createSignal<string[]>([]);
  const [unstagedFiles, setUnstagedFiles] = createSignal<string[]>([]);
  const [branches, setBranches] = createSignal<string[]>([]);
  const [diffContent, setDiffContent] = createSignal<string>('');
  const [modalVisible, setModalVisible] = createSignal<boolean>(false);
  const [selectedStatusIndex, setSelectedStatusIndex] = createSignal<number>(0);

  // --- Industrial Lifecycle Bridge ---
  const sync = () => {
    const log = GitProvider.getCommitLog(50);
    // 🧱 Type Hardening: Cast to structured status
    const repoStatus = GitProvider.getStatus() as { path: string, state: string }[];
    const repoBranches = GitProvider.getBranches();

    setCommits(log);
    
    // 🧱 Explorer Synchronization: Distinguish between staged and unstaged/untracked
    const staged = (repoStatus as any[]).filter(s => s.state === 'staged').map(s => s.path);
    const unstaged = (repoStatus as any[]).filter(s => s.state !== 'staged').map(s => s.path);
    
    setStagedFiles(staged);
    setUnstagedFiles(unstaged);
    setBranches(repoBranches);

    if (log.length > 0 && !selectedCommitId()) {
      setSelectedCommitId(log[0].hash);
      setSelectedIndex(0);
    }
  };

  // Immediate Sync for bit-perfect Frame 1
  sync();

  Zen.onMount(() => {
    sync();
  });

  createEffect(() => {
    const id = selectedCommitId();
    if (id) {
      const diffText = GitProvider.getCommitDiff(id);
      setDiffContent(diffText);
    }
  });

  const state: ZenState = {
    mode,
    selectedCommitId,
    selectedIndex,
    selectedBranchIdx,
    currentBranch,
    statusMessage,
    commits,
    stagedFiles,
    unstagedFiles,
    branches,
    diffContent,
    modalVisible,
    selectedStatusIndex
  };

  const dispatch = (action: ZenAction) => {
    switch (action.type) {
      case 'SELECT_COMMIT':
        setSelectedCommitId(action.id);
        if (action.index !== undefined) setSelectedIndex(action.index);
        break;
      case 'SET_MODE':
        setMode(action.mode);
        break;
      case 'TOGGLE_MODAL':
        setModalVisible(action.visible);
        break;
      case 'UPDATE_COMMITS':
        setCommits(action.commits);
        break;
      case 'STAGE_FILE':
        (GitProvider as any).stageFile(action.path);
        setStagedFiles((GitProvider.getStatus() as any[]).filter(s => s.state === 'staged').map(s => s.path));
        break;
      case 'UNSTAGE_FILE':
        (GitProvider as any).unstageFile(action.path);
        setStagedFiles((GitProvider.getStatus() as any[]).filter(s => s.state === 'staged').map(s => s.path));
        break;
      case 'UPDATE_DIFF':
        setDiffContent(action.content);
        break;
      case 'SET_BRANCH':
        setCurrentBranch(action.branch);
        sync();
        break;
      case 'MOVE_SELECTION': {
        const idx = selectedIndex();
        const next = action.direction === 'up' ? Math.max(0, idx - 1) : Math.min(commits().length - 1, idx + 1);
        setSelectedIndex(next);
        const c = commits()[next];
        if (c) setSelectedCommitId(c.hash);
        break;
      }
      case 'MOVE_STATUS_SELECTION': {
        const idx = selectedStatusIndex();
        const next = action.direction === 'up' ? Math.max(0, idx - 1) : Math.min(stagedFiles().length - 1, idx + 1);
        setSelectedStatusIndex(next);
        break;
      }
      case 'COMMIT':
        (GitProvider as any).commit(action.message);
        setMode('navigation');
        sync();
        break;
    }
  };

  // ╼ Industrial Keyboard Bridge
  const input = Zen.createZenInput();
  
  let themeIdx = 0;
  const themeModes = ['industrial', 'emerald', 'cobalt'] as const;

  const stopInput = input.startPolling((key: string) => {
    const k = key.toLowerCase();
    const curMode = mode();

    if (curMode === 'navigation') {
      if (k === 'tab') dispatch({ type: 'SET_MODE', mode: 'review' });
      if (k === 'j' || k === '\u001b[b') dispatch({ type: 'MOVE_SELECTION', direction: 'down' });
      if (k === 'k' || k === '\u001b[a') dispatch({ type: 'MOVE_SELECTION', direction: 'up' });
      
      // 🧱 Live Theme Switching
      if (k === 't') {
          themeIdx = (themeIdx + 1) % themeModes.length;
          Zen.Theme.setZenMode(themeModes[themeIdx]);
          Zen.pulse(true); 
      }

      if (k === 'c') dispatch({ type: 'SET_MODE', mode: 'command' });
      if (k === 'q') GitProvider.exit();
    } else if (curMode === 'review') {
        if (k === 'tab') dispatch({ type: 'SET_MODE', mode: 'navigation' });
        if (k === 'j' || k === '\u001b[b') dispatch({ type: 'MOVE_STATUS_SELECTION', direction: 'down' });
        if (k === 'k' || k === '\u001b[a') dispatch({ type: 'MOVE_STATUS_SELECTION', direction: 'up' });
        if (k === 'v') dispatch({ type: 'SET_MODE', mode: 'navigation' }); 
    } else if (curMode === 'command') {
        if (k === 'escape') dispatch({ type: 'SET_MODE', mode: 'navigation' });
    }
  });

  return { state, dispatch };
}

/**
 * useStore: Direct Component Bridge
 */
export function useStore(): { state: ZenState, dispatch: (action: ZenAction) => void } {
  const context = useContext(Zen.StoreContext) as any;
  if (!context) throw new Error("useStore must be used within ZenStore.Provider");
  return context;
}

export type ZenStore = ReturnType<typeof createZenStore>;