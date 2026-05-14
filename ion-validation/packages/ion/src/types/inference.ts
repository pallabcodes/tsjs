import { IonField } from './fields';

/**
 * InferSchema: The recursive engine that derives a static TypeScript type from an Ion Schema.
 * It thoughtfully resolves the Discriminated Union of IonField to produce a perfect data contract.
 */
export type InferSchema<S extends ReadonlyArray<IonField<any>>> = {
  [P in S[number] as P['key']]: (P['type'] extends undefined ? 'source' : P['type']) extends 'schema'
    ? P extends { schema: infer Nested }
      ? Nested extends ReadonlyArray<IonField<any>>
        ? InferSchema<Nested>
        : any
      : any
    : any; 
};

/**
 * PathValue: Utility to resolve the type of a property based on a dot-notation string path.
 */
export type PathValue<T, P extends string> = 
  P extends `${infer K}.${infer R}` 
    ? K extends keyof T ? PathValue<T[K], R> : unknown 
    : P extends keyof T ? T[P] : unknown;
