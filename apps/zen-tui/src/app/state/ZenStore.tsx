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

  // 🧱 Operational Hub: Industrial Metadata
  memoryUsage: () => number;
  currentTime: () => string;

  // 🧱 Sync Engine: Delta Tracking
  upstreamDelta: () => { ahead: number, behind: number } | null;
  currentUser: () => string;
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
 * createZenStore: Deterministic State Factory (Industrial Sync Enabled)
 */
export function createZenStore() {
  // --- UI Signals ---
  const [mode, setMode] = createSignal<'navigation' | 'review' | 'command'>('navigation');
  const [selectedCommitId, setSelectedCommitId] = createSignal<string | null>(null);
  const [selectedIndex, setSelectedIndex] = createSignal<number>(0);
  const [selectedBranchIdx, setSelectedBranchIdx] = createSignal<number>(0);
  const [currentBranch, setCurrentBranch] = createSignal<string>('main');
  const [statusMessage, setStatusMessage] = createSignal<string>('Ready');
  const [modalVisible, setModalVisible] = createSignal<boolean>(false);
  const [selectedStatusIndex, setSelectedStatusIndex] = createSignal<number>(0);

  // --- Data Signals ---
  const [commits, setCommits] = createSignal<CommitData[]>([]);
  const [stagedFiles, setStagedFiles] = createSignal<string[]>([]);
  const [unstagedFiles, setUnstagedFiles] = createSignal<string[]>([]);
  const [branches, setBranches] = createSignal<string[]>([]);
  const [diffContent, setDiffContent] = createSignal<string>("");

  // --- Operational Signals ---
  const [memoryUsage, setMemoryUsage] = createSignal<number>(0);
  const [currentTime, setCurrentTime] = createSignal<string>("");

  // --- Sync Engine Signals ---
  const [upstreamDelta, setUpstreamDelta] = createSignal<{ ahead: number, behind: number } | null>(null);
  const [currentUser, setCurrentUser] = createSignal<string>("unknown");

  /**
   * sync: Industrial Lifecycle Bridge
   * Synchronizes native Git state, host telemetry, and branch divergence.
   */
  const sync = () => {
    try {
      const log = GitProvider.getCommitLog(50);
      const repoStatus = GitProvider.getStatus() as { path: string, state: string }[];
      const repoBranches = GitProvider.getBranches();

      setCommits(log);
      
      const staged = repoStatus.filter((s: any) => s.state === 'staged').map((s: any) => s.path);
      const unstaged = repoStatus.filter((s: any) => s.state !== 'staged').map((s: any) => s.path);
      
      setStagedFiles(staged);
      setUnstagedFiles(unstaged);
      setBranches(repoBranches);

      // ╼ Update Operational Telemetry
      setMemoryUsage(GitProvider.getMemoryUsage());
      setCurrentTime(GitProvider.getTime());

      // ╼ Update Sync Divergence & Identity
      setUpstreamDelta(GitProvider.getSyncDelta());
      setCurrentUser(GitProvider.getCurrentUser());

      if (log.length > 0 && !selectedCommitId()) {
        setSelectedCommitId(log[0].hash);
        setSelectedIndex(0);
      }
    } catch (e) {
      console.error("[ZenStore] Sync Failure:", e);
    }
  };

  // Immediate Sync for Bit-Perfect Frame 1
  sync();

  Zen.onMount(() => {
    // 🧱 SYNC HEARTBEAT: Standard lifecycle synchronization (Fast)
    const interval = setInterval(sync, 1000);
    
    // 🧱 BACKGROUND FETCH: Periodic upstream synchronization (Slow - 30s)
    // This allows the TUI to detect when other engineers push to base branches.
    const fetchInterval = setInterval(() => {
        GitProvider.fetchOrigin();
        sync();
    }, 30000);

    return () => {
        clearInterval(interval);
        clearInterval(fetchInterval);
    };
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
    selectedStatusIndex,
    memoryUsage,
    currentTime,
    upstreamDelta,
    currentUser
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
      case 'STAGE_FILE':
        GitProvider.stageFile(action.path);
        sync();
        break;
      case 'UNSTAGE_FILE':
        GitProvider.unstageFile(action.path);
        sync();
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
        const files = mode() === 'review' ? stagedFiles() : unstagedFiles();
        const next = action.direction === 'up' ? Math.max(0, idx - 1) : Math.min(files.length - 1, idx + 1);
        setSelectedStatusIndex(next);
        break;
      }
      case 'COMMIT':
        GitProvider.commit(action.message);
        setMode('navigation');
        sync();
        break;
    }
  };

  // ╼ Industrial Keyboard Bridge
  const input = Zen.createZenInput();
  
  let themeIdx = 0;
  const themeModes = ['industrial', 'emerald', 'cobalt'] as const;

  input.startPolling((key: string) => {
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
    } else if (curMode === 'command') {
        if (k === 'escape') dispatch({ type: 'SET_MODE', mode: 'navigation' });
    }
  });

  return { state, dispatch };
}

/**
 * useStore: Direct Component Bridge
 * Hardened access to the Sovereign Store Context.
 */
export function useStore(): { state: ZenState, dispatch: (action: ZenAction) => void } {
  const context = useContext(Zen.StoreContext) as any;
  if (!context) throw new Error("useStore must be used within ZenStore.Provider");
  return context;
}

export type ZenStore = ReturnType<typeof createZenStore>;