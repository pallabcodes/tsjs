import { ObjectSchema, Schema } from 'joi';

// Example: Schema diff (very basic structural diff)
export function diffSchemas(a: ObjectSchema, b: ObjectSchema) {
  const aDesc = a.describe();
  const bDesc = b.describe();
  const diff: Record<string, { a?: any; b?: any }> = {};

  const aKeys = aDesc.keys ? Object.keys(aDesc.keys) : [];
  const bKeys = bDesc.keys ? Object.keys(bDesc.keys) : [];
  const allKeys = Array.from(new Set([...aKeys, ...bKeys]));

  for (const key of allKeys) {
    const aVal = aDesc.keys?.[key];
    const bVal = bDesc.keys?.[key];
    if (JSON.stringify(aVal) !== JSON.stringify(bVal)) {
      diff[key] = { a: aVal, b: bVal };
    }
  }
  return diff;
}

// Example: Dependency graph (finds which fields depend on which others via presence/when)
export function getDependencyGraph(schema: ObjectSchema) {
  const desc = schema.describe();
  const graph: Record<string, string[]> = {};
  if (desc.dependencies) {
    for (const dep of desc.dependencies) {
      if (
        typeof dep.key === 'string' &&
        Array.isArray(dep.peers) &&
        dep.peers.every((p: unknown) => typeof p === 'string')
      ) {
        graph[dep.key] = dep.peers;
      }
    }
  }
  return graph;
}

// Helper type guard for flags
function hasFlags(val: any): val is { flags?: { presence?: string }, type: string } {
  return typeof val === 'object' && val !== null && 'type' in val;
}

// Example: Example generation (returns a simple example object based on required fields)
export function generateExample(schema: Schema): any {
  const desc = schema.describe();
  if (desc.type === 'object' && desc.keys) {
    const obj: Record<string, any> = {};
    for (const [key, val] of Object.entries(desc.keys)) {
      if (hasFlags(val)) {
        if (val.flags?.presence === 'required' || val.flags?.presence === undefined) {
          if (val.type === 'string') obj[key] = 'example';
          else if (val.type === 'number') obj[key] = 42;
          else if (val.type === 'boolean') obj[key] = true;
          else if (val.type === 'object') obj[key] = {};
          else if (val.type === 'array') obj[key] = [];
          else obj[key] = null;
        }
      }
    }
    return obj;
  }
  if (desc.type === 'string') return 'example';
  if (desc.type === 'number') return 42;
  if (desc.type === 'boolean') return true;
  if (desc.type === 'array') return [];
  return null;
}