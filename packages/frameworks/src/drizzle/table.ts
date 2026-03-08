import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { Column, InferSelectModel, InferInsertModel } from 'drizzle-orm';

/**
 * 1. Table & Column Builder Deconstruction
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
});

// Infering models
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Column metadata extraction
export type DeconstructColumn<T extends Column> = {
  name: T['_']['name'];
  data: T['_']['data'];
  notNull: T['_']['notNull'];
};

export type NameColumnInfo = DeconstructColumn<typeof users.name>;

/**
 * mini-module concept for your own ORM
 */
export type MiniBuilder<TData, TNotNull extends boolean = false> = {
  _: { data: TData; notNull: TNotNull };
  notNull(): MiniBuilder<TData, true>;
};
