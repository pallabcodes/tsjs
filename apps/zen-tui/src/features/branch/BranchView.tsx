/**
 * Zen-TUI: Branch View (Refactored)
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
    <box flexDirection="column">
       <box bg="#1A1A2E" padding={1}>
         <text fg="#AB47BC">⎇ BRANCHES </text>
         <text fg="#81D4FA">│ {current()} │ </text>
         <text fg="#78909C">{branches().length} total</text>
       </box>

       <box flexDirection="column">
         <For each={branches()}>
           {(branch, idx) => {
             const isSelected = createMemo(() => idx() === selectedIndex())
             return (
               <box bg={isSelected() ? "#1A237E" : undefined}>
                  <text fg={branch.isCurrent ? "#66BB6A" : isSelected() ? "#E0E0E0" : "#90A4AE"}>
                    {branch.isCurrent ? "● " : "  "}
                    {branch.name.padEnd(20)}
                    <text fg="#546E7A"> → {branch.upstream || "no upstream"}</text>
                  </text>
               </box>
             )
           }}
         </For>
       </box>
    </box>
  )
}

function createMemo<T>(fn: () => T) {
  const [val, setVal] = createSignal(fn());
  return val;
}
