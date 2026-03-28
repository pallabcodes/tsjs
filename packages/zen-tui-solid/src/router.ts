import { createSignal, createContext, useContext, createMemo as memo, createComponent } from "solid-js";

// 1. Navigation Context
const RouterContext = createContext<{ 
  path: () => string; 
  setPath: (p: string) => void 
}>();

export const ZenRouter = (props: { initialPath?: string, children: any }) => {
  const [path, setPath] = createSignal(props.initialPath || "/");
  return createComponent(RouterContext.Provider as any, {
    value: { path, setPath },
    children: props.children
  }) as any;
};

export const ZenRoute = (props: { path: string, children: any }) => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("<ZenRoute> must be used inside <ZenRouter>");

  return memo(() => {
    return ctx.path() === props.path ? props.children : null;
  }) as any;
};

// Hook for drawing updates
export function useZenNavigation() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useZenNavigation must be used inside <ZenRouter>");
  return ctx;
}
