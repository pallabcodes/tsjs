export function toggleSetValue<T>(values: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(values);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export function toggleNumberInList(values: readonly number[], value: number): number[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

export function mapValueOrNull<K, V>(map: ReadonlyMap<K, V>, key: K | null | undefined): V | null {
  if (key === null || key === undefined) return null;
  return map.get(key) ?? null;
}
