// core types
import { performance } from "node:perf_hooks";

export type WorkPriority =
    | "immediate"
    | "high"
    | "normal"
    | "low"

export interface WorkTask {
    id: string
    priority: WorkPriority
    run: () => Generator<void, void, unknown>
}

// Priority Queue
export class PriorityQueue<T> {
    private queues: Record<string, T[]> = {
        immediate: [],
        high: [],
        normal: [],
        low: []
    }

    enqueue(priority: WorkPriority, item: T) {
        this.queues[priority].push(item)
    }

    dequeue(): T | undefined {
        if (this.queues.immediate.length) return this.queues.immediate.shift();
        if (this.queues.high.length) return this.queues.high.shift();
        if (this.queues.normal.length) return this.queues.normal.shift();
        return this.queues.low.shift()
    }

    isEmpty() {
        return (
            !this.queues.immediate.length &&
            !this.queues.high.length &&
            !this.queues.normal.length &&
            !this.queues.low.length
        )
    }
}

// Cooperative Scheduler (The scheduler processes small work chunks)
const TIME_SLICE = 5

// Shim for requestIdleCallback in Node.js
const requestIdleCallbackShim = (callback: () => void) => setImmediate(callback);

export class Scheduler {
    private queue = new PriorityQueue<WorkTask>()

    schedule(task: WorkTask) {
        this.queue.enqueue(task.priority, task)
    }

    run() {
        const start = performance.now()

        while (!this.queue.isEmpty()) {
            if (performance.now() - start > TIME_SLICE) {
                requestIdleCallbackShim(() => this.run())
                return
            }

            const task = this.queue.dequeue()
            if (!task) continue

            const generator = task.run()
            let result = generator.next()

            while (!result.done) {
                if (performance.now() - start > TIME_SLICE) {
                    // In a real implementation, we would need to save the generator state
                    // and resume it later. For this example, we just finish the task.
                    result = generator.next()
                } else {
                    result = generator.next()
                }
            }
        }
    }
}

// Cooperative Tree traversal (Traversal becomes generator-based) since we have used yield so traversal can pause
export type TreeNode<T> = {
    id: string
    value: T
    children?: TreeNode<T>[]
}

export function* dfsWork<T>(
    root: TreeNode<T>,
    visit: (node: TreeNode<T>) => void
): Generator<void> {
    const stack: TreeNode<T>[] = [root]

    while (stack.length) {
        const node = stack.pop()!;
        visit(node);
        yield;

        const children = node.children ?? []
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}

const cameraTree: TreeNode<any> = {
    id: "root",
    value: { name: "Root", severity: 0 },
    children: [
        { id: "camera-1", value: { name: "Camera 1", severity: 5 } },
        { id: "camera-2", value: { name: "Camera 2", severity: 3 } },
    ]
};

// Scheduling a Tree Traversal
const scheduler = new Scheduler()

if (typeof cameraTree !== 'undefined') {
    scheduler.schedule({
        id: "tree-traversal",
        priority: "normal",
        run: () => dfsWork(cameraTree, node => {
            console.log("Processing node:", node.id)
        }),
    })

    scheduler.run();
}

// DFS Generator
export function* dfs<T>(root: TreeNode<T>) {
    const stack = [root]
    while (stack.length) {
        const node = stack.pop()!;
        yield node;
        const children = node.children ?? [];
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}

// Generator operators
export function* filter<T>(iter: Iterable<T>,  predicate: (v: T) => boolean) {
    for (const item of iter) {
        if (predicate(item)) {
            yield item
        }
    }
}

export function* map<T, R>(iter: Iterable<T>, fn: (v: T) => R) {
    for (const item of iter) {
        yield fn(item);
    }
}

export function* take<T>(iter: Iterable<T>, n: number) {
    let count = 0;
    for (const item of iter) {
        if (count++ >= n) return;
        yield item;
    }
}

const nodes =
    take(
        map(
            filter(
                dfs(cameraTree),
                n => n.value.severity > 4
            ),
            n => n.value.name
        ),
        3
    )

for (const name of nodes) {
    console.log(name);
}

// Cycle Detection
export function* dfsGraph<T>(
    root: TreeNode<T>
) {
    const stack = [root]
    const visited = new Set<string>()
    while (stack.length) {
        const node = stack.pop()!
        if (visited.has(node.id)) continue
        visited.add(node.id)
        yield node
        const children = node.children ?? []
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}