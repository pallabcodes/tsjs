import Joi from 'joi';

export declare class SchemaWrapper<T> {
  constructor(schema: Joi.Schema);

  validate(input: unknown): T;

  get raw(): Joi.Schema;

  extend(extension: Joi.Schema): SchemaWrapper<T & any>;

  pick<K extends keyof T>(keys: K[]): SchemaWrapper<Pick<T, K>>;
}

export declare function createSchema<T>(schema: Joi.Schema): SchemaWrapper<T>;
