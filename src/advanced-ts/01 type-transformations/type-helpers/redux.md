[//]: # (https://github.dev/reduxjs/redux)
```ts
export interface Action<T = any> {
  type: T;
}

export interface AnyAction extends Action {
  [extraProps: string]: any;
}

// usage example
// const test: AnyAction = { type: 'greeting' };

export type Reducer<S = any, A extends Action = AnyAction> = (state: S | undefined, action: A) => S;

type MyReducerAction =
  | { type: 'MY_ACTION' }
  | { type: 'OTHER_ACTION' };

// usage
const reducerFn: Reducer<{ count: number }, MyReducerAction> = (state = { count: 0 }, action) => {
  // Now type suggestion should work properly
  if (action.type === 'MY_ACTION') {
    state.count++;
  }
  return state;
};
```