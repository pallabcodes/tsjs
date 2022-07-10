interface Game<T> {
  id: number | string;
  prop: T;
  method: (...args: any[]) => void;
  released: string;
}

interface ESports {
  title: string;
  released: number;
}

// Extending the multiple interfaces
// interface Gamers extends Game<boolean>, ESports { venue: string }