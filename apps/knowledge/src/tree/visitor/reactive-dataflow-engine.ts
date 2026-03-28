export type StreamId = string;

export interface Event<T> {
    timestamp: number
    value: T
}

export interface Operator<I, O> {
    process(event: Event<I>): Iterable<Event<O>>
}

export class StreamNode<I, O> {
    readonly id: string
    private operator: Operator<I, O>
    private downstream: StreamNode<O, any>[] = []

    constructor(id: string, operator: Operator<I, O>) {
        this.id = id
        this.operator = operator
    }

    connect(node: StreamNode<O, any>) {
        this.downstream.push(node)
    }

    push(event: Event<I>) {
        const outputs = this.operator.process(event)
        for (const out of outputs) {
            for (const next of this.downstream) {
                next.push(out)
            }
        }
    }
}

export class FilterOperator<T> implements Operator<T, T> {
    private predicate: (v: T) => boolean
    constructor(pred: (v: T) => boolean) {
        this.predicate = pred
    }
    *process(event: Event<T>) {
        if (this.predicate(event.value)) {
            yield event
        }
    }
}

export class MapOperator<I, O> implements Operator<I, O> {
    private fn: (v: I) => O
    constructor(fn: (v: I) => O) {
        this.fn = fn
    }
    *process(event: Event<I>) {
        yield {
            timestamp: event.timestamp,
            value: this.fn(event.value)
        }
    }
}

export class WindowSumOperator implements Operator<number, number> {
    private window: number
    private values: number[] = []
    constructor(window: number) {
        this.window = window
    }
    *process(event: Event<number>) {
        this.values.push(event.value)
        if (this.values.length > this.window) {
            this.values.shift()
        }
        const sum = this.values.reduce((a, b) => a + b, 0)
        yield {
            timestamp: event.timestamp,
            value: sum
        }
    }
}

export class DataflowGraph {
    private sources: StreamNode<any, any>[] = []
    addSource(node: StreamNode<any, any>) {
        this.sources.push(node)
    }
    pushEvent<T>(source: StreamNode<T, any>, value: T) {
        const event: Event<T> = {
            timestamp: Date.now(),
            value
        }
        source.push(event)
    }
}

// Demo setup
const source = new StreamNode("camera-source", {
    *process(e) { yield e }
})

const filterNode = new StreamNode(
    "severity-filter",
    new FilterOperator<number>(v => v > 5)
)

const mapNode = new StreamNode(
    "alert-map",
    new MapOperator<number, string>(
        v => `ALERT severity=${v}`
    )
)

// Minimal mock node for output
const outputNode = new StreamNode<string, string>("output", {
    *process(e) {
        console.log("ALERT STREAM:", e.value)
        yield e
    }
})

source.connect(filterNode)
filterNode.connect(mapNode)
mapNode.connect(outputNode)

const graph = new DataflowGraph()
graph.addSource(source)

// Minimal main function for demonstration (loop removed for build)
async function main() {
    graph.pushEvent(source, 2)
    graph.pushEvent(source, 7)
    graph.pushEvent(source, 10)
}

// Export for usage or execute if main
if (typeof require !== 'undefined' && require.main === module) {
    main().catch(console.error)
}