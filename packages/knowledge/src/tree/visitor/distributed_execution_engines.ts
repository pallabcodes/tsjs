export type NodeId = string

export type Priority =
    | "immediate"
    | "high"
    | "normal"
    | "low"

export interface TaskContext {
    signal?: AbortSignal
    attempt: number
    checkpoint?: unknown
}

export type TaskFn<T = unknown> =
    (ctx: TaskContext) => Promise<T>

export interface TaskDefinition<T = unknown> {
    id: NodeId
    priority: Priority
    run: TaskFn<T>
    deps?: NodeId[]
}

export interface RetryPolicy {
    retries: number
    backoffMs: number
    factor: number
}

export async function executeWithRetry<T>(
    fn: () => Promise<T>,
    policy: RetryPolicy
): Promise<T> {
    let attempt = 0
    let delay = policy.backoffMs
    while (true) {
        try {
            return await fn()
        } catch (err) {
            if (attempt >= policy.retries) {
                throw err
            }
            await new Promise(r => setTimeout(r, delay))
            delay *= policy.factor
            attempt++
        }
    }
}

export interface CheckpointStore {
    save(taskId: string, data: unknown): Promise<void>
    load(taskId: string): Promise<unknown | undefined>
}

export class InMemoryCheckpointStore implements CheckpointStore {
    private store = new Map<string, unknown>()
    async save(taskId: string, data: unknown) {
        this.store.set(taskId, data)
    }
    async load(taskId: string) {
        return this.store.get(taskId)
    }
}

export class IncrementalCache {
    private cache = new Map<string, unknown>()
    get(key: string) {
        return this.cache.get(key)
    }
    set(key: string, value: unknown) {
        this.cache.set(key, value)
    }
    has(key: string) {
        return this.cache.has(key)
    }
}

export class DAG {
    private tasks = new Map<string, TaskDefinition>()
    private deps = new Map<string, Set<string>>()

    addTask(task: TaskDefinition) {
        this.tasks.set(task.id, task)
        this.deps.set(task.id, new Set(task.deps ?? []))
    }

    getReadyTasks(completed: Set<string>) {
        const ready: TaskDefinition[] = []
        for (const task of this.tasks.values()) {
            if (completed.has(task.id)) continue
            const deps = this.deps.get(task.id)
            if (!deps) continue

            let satisfied = true
            for (const d of deps) {
                if (!completed.has(d)) {
                    satisfied = false
                    break
                }
            }
            if (satisfied) ready.push(task)
        }
        return ready
    }

    getTasks() {
        return this.tasks
    }
}

export class WorkerPool {
    private concurrency: number
    private running = 0
    private queue: (() => Promise<void>)[] = []

    constructor(concurrency: number) {
        this.concurrency = concurrency
    }

    async run(task: () => Promise<void>) {
        if (this.running >= this.concurrency) {
            await new Promise<void>(resolve => {
                this.queue.push(async () => {
                    await task()
                    resolve()
                })
            })
            return
        }
        this.running++
        await task()
        this.running--
        const next = this.queue.shift()
        if (next) {
            this.running++
            await next()
            this.running--
        }
    }
}

// Minimal logic for demo (removed express dependency for clean build)
const remoteWorkerMock = async (id: string) => {
    console.log("Remote worker executing", id)
    await new Promise(r => setTimeout(r, 100))
    return { ok: true }
}

export class Scheduler {
    private dag: DAG
    private pool: WorkerPool
    private cache = new IncrementalCache()
    private checkpoints = new InMemoryCheckpointStore()

    constructor(dag: DAG, workers = 4) {
        this.dag = dag
        this.pool = new WorkerPool(workers)
    }

    async run() {
        const completed = new Set<string>()
        while (completed.size < this.dag.getTasks().size) {
            const ready = this.dag.getReadyTasks(completed)
            for (const task of ready) {
                if (this.cache.has(task.id)) {
                    completed.add(task.id)
                    continue
                }
                await this.pool.run(async () => {
                    const checkpoint = await this.checkpoints.load(task.id)
                    const result = await executeWithRetry(
                        () =>
                            task.run({
                                attempt: 0,
                                checkpoint
                            }),
                        {
                            retries: 3,
                            backoffMs: 200,
                            factor: 2
                        }
                    )
                    this.cache.set(task.id, result)
                    await this.checkpoints.save(task.id, result)
                    completed.add(task.id)
                })
            }
        }
    }
}

export function* filter<T>(iter: Iterable<T>, pred: (v: T) => boolean) {
    for (const v of iter) {
        if (pred(v)) yield v
    }
}

export function* map<T, R>(iter: Iterable<T>, fn: (v: T) => R) {
    for (const v of iter) {
        yield fn(v)
    }
}

export function* take<T>(iter: Iterable<T>, n: number) {
    let count = 0
    for (const v of iter) {
        if (count++ >= n) return
        yield v
    }
}

export async function* infiniteStream() {
    let i = 0
    while (true) {
        await new Promise(r => setTimeout(r, 100))
        yield i++
    }
}

export interface ASTNode {
    type: string
    children?: ASTNode[]
}

export function* walkAST(root: ASTNode) {
    const stack = [root]
    while (stack.length) {
        const node = stack.pop()!
        yield node
        const children = node.children ?? []
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}

const ast: ASTNode = {
    type: "Program",
    children: [
        { type: "Function" },
        { type: "Variable" },
        { type: "Function" }
    ]
}

const nodes =
    take(
        map(
            filter(
                walkAST(ast),
                n => n.type === "Function"
            ),
            n => n.type
        ),
        5
    )

for (const n of nodes) {
    console.log(n)
}