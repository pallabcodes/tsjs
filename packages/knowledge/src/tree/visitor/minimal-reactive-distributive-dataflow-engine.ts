export interface Event<T> {
    key: string
    timestamp: number
    value: T
}

export interface Operator<I, O> {
    process(event: Event<I>): Event<O>[]
}

export interface WorkerStatus {
    queueSize: number
}

export interface Checkpoint {
    operatorState: unknown
    timestamp: number
}