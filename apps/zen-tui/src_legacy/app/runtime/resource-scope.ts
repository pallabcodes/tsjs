export interface Disposable {
  dispose(): Promise<void> | void;
}

export interface ResourceScope {
  track(disposable: Disposable): void;
  flush(): Promise<void>;
}
