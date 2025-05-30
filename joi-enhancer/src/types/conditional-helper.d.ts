/**
 * Makes K required if D is a certain value.
 * Usage: ConditionalRequired<Base, 'discriminant', 'value', 'field'>
 */
export type ConditionalRequired<
  Base,
  Discriminant extends keyof Base,
  Value extends Base[Discriminant],
  Field extends keyof Base
> =
  | (Base & { [K in Discriminant]: Value } & Required<Pick<Base, Field>>)
  | (Base & { [K in Discriminant]: Exclude<Base[Discriminant], Value> });