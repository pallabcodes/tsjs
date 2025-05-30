import { InferJoiType } from 'joi-enhancer';

declare module 'joi-extract-type' {
  // This matches the actual type signature of the default export
  export default function ExtractType<T>(schema: T): any;
  // This type alias allows you to use ExtractType<T> as a type
  export type ExtractType<T> = ReturnType<typeof ExtractType<T>>;
}

export type { ExtractType as InferJoiType } from 'joi-extract-type';