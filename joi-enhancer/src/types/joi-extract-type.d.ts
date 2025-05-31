import { Schema } from 'joi';
import { SchemaWrapper } from '../joiWrapper';

// Support both raw Schema objects and SchemaWrapper objects
export type ExtractType<T> = 
  T extends SchemaWrapper<infer U> ? U :
  T extends Schema ? any : 
  never;

// Alias for consumers
export type InferJoiType<T> = ExtractType<T>;