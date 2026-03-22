/**
 * Zen-TUI: Branch View (Refactored)
 * 
 *  My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

import { createSignal, For, onMount } from "solid-js"
import {
  getBranches,
  getCurrentBranch,
  type GitBranch,
} from "../../services/git.js"

export default function BranchView() {
  const [branches, setBranches] = createSignal<GitBranch[]>([])
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [current, setCurrent] = createSignal("")

  onMount(() => {
    setBranches(getBranches())
    setCurrent(getCurrentBranch())
  })

  return (
    <Zen.Box flexDirection="column">
      <Zen.Box bg="#1A1A2E" padding={1}>
        <Zen.Text fg="#AB47BC">⎇ BRANCHES </Zen.Text>
        <Zen.Text fg="#81D4FA">│ {current()} │ </Zen.Text>
        <Zen.Text fg="#78909C">{branches().length} total</Zen.Text>
      </Zen.Box>

      <Zen.Box flexDirection="column">
        <Zen.For each={branches()}>
          {(branch, idx) => {
            const isSelected = createMemo(() => idx() === selectedIndex())
            return (
              <Zen.Box bg={isSelected() ? "#1A237E" : undefined}>
                <Zen.Text fg={branch.isCurrent ? "#66BB6A" : isSelected() ? "#E0E0E0" : "#90A4AE"}>
                  {branch.isCurrent ? "● " : "  "}
                  {branch.name.padEnd(20)}
                  <Zen.Text fg="#546E7A"> → {branch.upstream || "no upstream"}</Zen.Text>
                </Zen.Text>
              </Zen.Box>
            )
          }}
        </Zen.For>
      </Zen.Box>
    </Zen.Box>
  )
}

function createMemo<T>(fn: () => T) {
  const [val, setVal] = createSignal(fn());
  return val;
}
