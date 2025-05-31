import { InferJoiType } from 'joi-enhancer';

declare module 'joi-extract-type' {
  import { Schema } from 'joi';
  
  // Default export is a function that extracts types from schemas
  export default function ExtractType<T>(schema: T): any;
  
  // Export a type that can be used for type inference
  export type ExtractType<T> = ReturnType<typeof ExtractType<T>>;
}

export type { ExtractType as InferJoiType } from 'joi-extract-type';