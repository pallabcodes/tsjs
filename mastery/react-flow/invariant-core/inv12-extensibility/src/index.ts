/**
 * Invariant 12: Extensibility (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's custom types:
 * 1. Component Injection via Lookup.
 * 2. Fallback resolution.
 */

export type ComponentType = any;

export interface ComponentMap {
  [key: string]: ComponentType;
}

/**
 * The "Injection" DNA.
 * Resolves a component based on a type string with a robust fallback.
 */
export function resolveComponent(
  type: string | undefined,
  userTypes: ComponentMap,
  builtinTypes: ComponentMap
): ComponentType {
  const resolvedType = type || 'default';
  
  // 1. Check user-defined types first (Allows overriding built-ins)
  if (userTypes[resolvedType]) {
    return userTypes[resolvedType];
  }

  // 2. Fallback to built-in types
  if (builtinTypes[resolvedType]) {
    return builtinTypes[resolvedType];
  }

  // 3. Ultimate fallback to the 'default' built-in
  return builtinTypes['default'];
}

/**
 * The "Plugin" DNA (Conceptual).
 * Plugins are just functions/components that take the shared state.
 */
export function createPlugin(state: any, config: any) {
  // Plugin logic here...
  return {
    update: () => { /* reacts to state changes */ }
  };
}
