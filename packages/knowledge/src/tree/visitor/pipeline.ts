export type TaskPriority =
    | "immediate"
    | "high"
    | "normal"
    | "low"

export interface TaskContext {
    signal?: AbortSignal
}

export type TaskFn = (ctx: TaskContext) => Promise<void>

export class Task {
    readonly id: string
    readonly deps: Set<string> = new Set()
    readonly dependents: Set<string> = new Set()
    readonly priority: TaskPriority

    readonly run: TaskFn

    constructor(
        id: string,
        run: TaskFn,
        priority: TaskPriority = "normal"
    ) {

        this.id = id
        this.run = run
        this.priority = priority
    }

}

export class PriorityQueue<T> {

    private queues: Record<string, T[]> = {
        immediate: [],
        high: [],
        normal: [],
        low: []
    }

    enqueue(priority: string, item: T) {

        this.queues[priority].push(item)
    }

    dequeue(): T | undefined {

        if (this.queues.immediate.length)
            return this.queues.immediate.shift()

        if (this.queues.high.length)
            return this.queues.high.shift()

        if (this.queues.normal.length)
            return this.queues.normal.shift()

        return this.queues.low.shift()
    }

    isEmpty(): boolean {

        return (
            !this.queues.immediate.length &&
            !this.queues.high.length &&
            !this.queues.normal.length &&
            !this.queues.low.length
        )
    }
}

export class DAG {

    private tasks = new Map<string, Task>()

    addTask(task: Task) {

        if (this.tasks.has(task.id)) {
            throw new Error(`Task already exists: ${task.id}`)
        }

        this.tasks.set(task.id, task);
    }

    addDependency(taskId: string, dependsOn: string) {

        const task = this.tasks.get(taskId)
        const dep = this.tasks.get(dependsOn)

        if (!task || !dep) {
            throw new Error("Invalid dependency")
        }

        task.deps.add(dependsOn)
        dep.dependents.add(taskId)
    }

    detectCycle() {

        const visited = new Set<string>()
        const stack = new Set<string>()

        const visit = (id: string): boolean => {

            if (stack.has(id)) return true
            if (visited.has(id)) return false

            visited.add(id)
            stack.add(id)

            const task = this.tasks.get(id)!

            for (const dep of task.deps) {

                if (visit(dep)) {
                    return true
                }
            }

            stack.delete(id)

            return false
        }

        for (const id of this.tasks.keys()) {

            if (visit(id)) {
                throw new Error("Cycle detected")
            }
        }
    }

    getTasks() {
        return this.tasks
    }

}

export class WorkerPool {

    private size: number
    private active = 0
    private queue: (() => Promise<void>)[] = []

    constructor(size: number) {

        this.size = size
    }

    async run(task: () => Promise<void>) {

        if (this.active >= this.size) {

            await new Promise<void>(resolve => {

                this.queue.push(async () => {
                    await task()
                    resolve()
                })
            })

            return
        }

        this.active++

        await task()

        this.active--

        const next = this.queue.shift()

        if (next) {

            this.active++

            await next()

            this.active--
        }
    }
}

export class Scheduler {

    private dag: DAG
    private pool: WorkerPool

    constructor(dag: DAG, workers = 4) {

        this.dag = dag
        this.pool = new WorkerPool(workers)
    }

    async run() {

        this.dag.detectCycle()

        const tasks = this.dag.getTasks()

        const queue = new PriorityQueue<Task>()

        const remainingDeps = new Map<string, number>()

        for (const task of tasks.values()) {

            remainingDeps.set(task.id, task.deps.size)

            if (task.deps.size === 0) {

                queue.enqueue(task.priority, task)
            }
        }

        while (!queue.isEmpty()) {

            const task = queue.dequeue()

            if (!task) continue

            await this.pool.run(async () => {

                console.log("Running task", task.id)

                await task.run({})

                for (const depId of task.dependents) {

                    const count = remainingDeps.get(depId)!

                    remainingDeps.set(depId, count - 1)

                    if (count - 1 === 0) {

                        const next = tasks.get(depId)!

                        queue.enqueue(next.priority, next)
                    }
                }

            })
        }
    }
}

// Usage

const dag = new DAG()

const A = new Task("A", async () => {

    console.log("Task A running")
})

const B = new Task("B", async () => {

    console.log("Task B running")
})

const C = new Task("C", async () => {

    console.log("Task C running")
})

const D = new Task("D", async () => {

    console.log("Task D running")
})

dag.addTask(A)
dag.addTask(B)
dag.addTask(C)
dag.addTask(D)

dag.addDependency("B", "A")
dag.addDependency("C", "A")

dag.addDependency("D", "B")
dag.addDependency("D", "C")

const scheduler = new Scheduler(dag, 4)

scheduler.run();
