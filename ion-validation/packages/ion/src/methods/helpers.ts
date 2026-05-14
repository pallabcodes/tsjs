import { IonField, SourceField, ComputedField, StaticField, SchemaField, Rule } from '../index';

/**
 * Ion Creation Helpers: Finesse Layer
 * These utilities provide an elegant DX for building strict Ion contracts 
 * without manual 'type' boilerplate.
 */

export const source = <T>(
  key: string, 
  source: string, 
  options: Partial<Omit<SourceField<T>, 'type' | 'key' | 'source'>> = {}
): SourceField<T> => ({
  type: 'source',
  key,
  source,
  ...options
});

export const computed = <T>(
  key: string, 
  compute: (data: T) => unknown | Promise<unknown>,
  options: Partial<Omit<ComputedField<T>, 'type' | 'key' | 'compute'>> = {}
): ComputedField<T> => ({
  type: 'computed',
  key,
  compute,
  ...options
});

export const staticValue = <T>(
  key: string, 
  value: unknown,
  options: Partial<Omit<StaticField<T>, 'type' | 'key' | 'value'>> = {}
): StaticField<T> => ({
  type: 'static',
  key,
  value,
  ...options
});

export const nested = <T>(
  key: string, 
  schema: ReadonlyArray<IonField<any>>,
  options: Partial<Omit<SchemaField<T>, 'type' | 'key' | 'schema'>> = {}
): SchemaField<T> => ({
  type: 'schema',
  key,
  schema,
  ...options
});
