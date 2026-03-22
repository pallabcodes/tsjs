/**
 * Zen-TUI — Right Panel Detail/Diff View
 *
 * Renders context-dependent detail based on the active panel and selection:
 *   Panel 1 (Files):    Unified diff of selected file
 *   Panel 2 (Branches): Branch tracking info + recent commits
 *   Panel 3 (Commits):  Full commit detail (hash, author, date, msg, files)
 *   Panel 4 (Stash):    Stash diff
 *   Panel 0 (Status):   Repo overview
 * 
 *  My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

const C = {
  base: "#1e1e2e",
  surface0: "#313244",
  text: "#cdd6f4",
  subtext0: "#a6adc8",
  overlay0: "#6c7086",
  red: "#f38ba8",
  green: "#a6e3a1",
  yellow: "#f9e2af",
  blue: "#89b4fa",
  mauve: "#cba6f7",
  teal: "#94e2d5",
  peach: "#fab387",
};

const FNAMES = ["src/engine/app.ts", "src/app/App.tsx", "src/features/log.tsx", "package.json"];

export default function LogView(props: { selectedIndex: number; activePanel: number }) {

  // ── Panel 0: Status / repo overview ──
  if (props.activePanel === 0) {
    return (
      <Zen.Box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <Zen.Box height={1} bg={C.base}><Zen.Text bold fg={C.mauve}>Repository Overview</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Branch:   </Zen.Text><Zen.Text bold fg={C.green}>main</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Remote:   </Zen.Text><Zen.Text fg={C.text}>origin (git@github.com:user/project.git)</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Tracking: </Zen.Text><Zen.Text fg={C.teal}>origin/main (up to date)</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Changes:  </Zen.Text><Zen.Text fg={C.yellow}>4 unstaged, 0 staged</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Stash:    </Zen.Text><Zen.Text fg={C.text}>2 entries</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Submodules:</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.teal}>  libs/core </Zen.Text><Zen.Text fg={C.green}>(clean, v2.1.0)</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Available workflows:</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [e] Edit .gitconfig   [o] Open submodule</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [u] Update submodule  [i] Init submodule</Zen.Text></Zen.Box>
      </Zen.Box>
    );
  }

  // ── Panel 1: Diff for selected file ──
  if (props.activePanel === 1) {
    const f = FNAMES[props.selectedIndex] || FNAMES[0];
    return (
      <Zen.Box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <Zen.Box height={1} bg={C.base}><Zen.Text bold fg={C.mauve}>{f}</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>@@ -120,6 +120,10 @@ export class ZenApp</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>   const style = node.props;</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.red}>-  const padding = style.padding || 0;</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.red}>-  this.layout.clear();</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>+  const pTop = style.paddingTop || 0;</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>+  const pLeft = style.paddingLeft || 0;</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>+  const pRight = style.paddingRight || 0;</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>+  this.layout.resize(w, h);</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>   this.renderer.flush();</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Operations: [s]tage file  [S]tage all  [d]iscard changes</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>            [c]ommit  [a]mend  [A]mend author name</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>            [p]ush  [P]ull  [f]etch from remote</Zen.Text></Zen.Box>
      </Zen.Box>
    );
  }

  // ── Panel 2: Branch info ──
  if (props.activePanel === 2) {
    const bnames = ["main", "feat/sovereign", "fix/clipping"];
    const b = bnames[props.selectedIndex] || bnames[0];
    return (
      <Zen.Box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <Zen.Box height={1} bg={C.base}><Zen.Text bold fg={C.green}>{b}</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Tracking: origin/{b}</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.teal}>Last: 7c2e1f4 feat: sovereignty (2m ago)</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Recent commits on {b}:</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  * 7c2e1f4 feat: architectural sovereignty</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  * 4d3b0c2 refactor: zen-transformer</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  * 2e9a8d4 fix: ANSI style bleeding</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Operations:</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [Enter] Checkout    [n] New branch from here</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [m] Merge into current  [r] Rebase onto this</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [R] Rename branch   [d] Delete branch</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [f] Fetch remote    [u] Set upstream</Zen.Text></Zen.Box>
      </Zen.Box>
    );
  }

  // ── Panel 3: Commit detail ──
  if (props.activePanel === 3) {
    const hashes = ["7c2e1f4", "4d3b0c2", "2e9a8d4", "b5c7d8k", "a1b2c3d"];
    const msgs = ["feat: total architectural sovereignty", "refactor: zen-transformer plugin", "fix: resolve ANSI style bleeding", "chore: finalize hardware renderer", "docs: update industrial plan"];
    const h = hashes[props.selectedIndex] || hashes[0];
    const m = msgs[props.selectedIndex] || msgs[0];
    return (
      <Zen.Box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <Zen.Box height={1} bg={C.base}><Zen.Text bold fg={C.yellow}>commit {h}</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.teal}>Author: picon &lt;picon@google.com&gt;</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Date:   2 minutes ago</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text bold fg={C.text}>    {m}</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>  M src/engine/app.ts  | 12 +++---</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>  A src/features/log   | 52 ++++++</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>  2 files changed, 42(+), 8(-)</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base} />
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Operations:</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [c] Cherry-pick this commit</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [r] Revert this commit</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [g] Reset to here: [s]oft [m]ixed [h]ard</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [R] Rebase: [i]nteractive [o]nto [a]bort [C]ontinue</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [A] Amend author name/email</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [f] Fixup into this commit</Zen.Text></Zen.Box>
        <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [S] Squash with previous</Zen.Text></Zen.Box>
      </Zen.Box>
    );
  }

  // ── Panel 4: Stash detail ──
  return (
    <Zen.Box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
      <Zen.Box height={1} bg={C.base}><Zen.Text bold fg={C.yellow}>stash@{"{" + props.selectedIndex + "}"}</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>WIP on main: 7c2e1f4</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base} />
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.green}>+ const pTop = style.paddingTop;</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.red}>- const padding = style.padding;</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  this.renderer.flush();</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base} />
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.overlay0}>Operations:</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [Enter] Apply stash (keep in stash list)</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [g] Pop stash (apply + drop)</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [d] Drop stash (discard)</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [n] New stash from current changes</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [r] Rename stash entry</Zen.Text></Zen.Box>
      <Zen.Box height={1} bg={C.base}><Zen.Text fg={C.text}>  [b] Create branch from stash</Zen.Text></Zen.Box>
    </Zen.Box>
  );
}
