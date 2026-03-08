// Export core logic from each deconstruction phase with unique names to avoid collisions.

export { performUnitOfWork as performBasicUnitOfWork, Scheduler as BasicScheduler } from './tree/framework-processor/1-basic-hybrid';
export { Reconciler as FiberReconcilerStep2 } from './tree/framework-processor/2-authentic-fiber';
export { Scheduler as LaneScheduler, FiberReconciler as LaneReconciler } from './tree/framework-processor/3-scheduler-lanes';
export { reconcile as reconcileKeyed } from './tree/framework-processor/4-keyed-reconciliation';
export { renderWithHooks, useState, useReducer } from './tree/framework-processor/5-hooks-engine';
export { useEffect, useLayoutEffect, commitEffects } from './tree/framework-processor/6-hooks-effects';
export { createContext, useContext, propagateContextChange } from './tree/framework-processor/7-context-propagation';
export { renderComponent, SuspenseTag, ErrorBoundaryTag } from './tree/framework-processor/8-suspense-logic';
