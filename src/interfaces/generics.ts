interface Game<T> {
  id: number | string;
  prop: T;
  method: (...args: any[]) => void;
  released: string;
}
