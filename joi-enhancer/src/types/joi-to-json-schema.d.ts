declare module 'joi-to-json-schema' {
  import { Schema } from 'joi';
  function toJsonSchema(schema: Schema): object;
  export default toJsonSchema;
}