import { joi } from '@roninbyte/joi-enhancer';

// 1. Strongly-typed object schema
const UserSchema = joi.object<{
  username: string;
  age?: number;
}>({
  username: joi.string().required(),
  age: joi.number().optional(),
});
console.log('User:', UserSchema.validate({ username: 'alice', age: 30 }));

// 2. alternatives
const AltSchema = joi.alternatives().try(joi.string(), joi.number());
console.log('Alt (string):', AltSchema.validate('hello'));
console.log('Alt (number):', AltSchema.validate(42));

// 3. conditionalField
const CondSchema = joi.object({
  type: joi.string().required(),
  value: joi.conditionalField('type', [
    { is: 'special', then: joi.string().required(), otherwise: joi.number().optional() }
  ]),
});
console.log('Cond (special):', CondSchema.validate({ type: 'special', value: 'abc' }));
console.log('Cond (other):', CondSchema.validate({ type: 'other', value: 123 }));

// 4. stripField
const StripSchema = joi.object({
  keep: joi.string().required(),
  remove: joi.stripField(),
});
console.log('Strip:', StripSchema.validate({ keep: 'yes', remove: 'no' }));

// 5. requireIf
const ReqIfSchema = joi.object({
  status: joi.string().valid('active', 'inactive'),
  reason: joi.requireIf(joi.string(), 'status', 'inactive'),
});
console.log('RequireIf (inactive):', ReqIfSchema.validate({ status: 'inactive', reason: 'why' }));
console.log('RequireIf (active):', ReqIfSchema.validate({ status: 'active' }));

// 6. isObjectSchema / isStringSchema
console.log('isObjectSchema(UserSchema.raw):', joi.isObjectSchema(UserSchema.raw));
console.log('isStringSchema(joi.string()):', joi.isStringSchema(joi.string()));

// 7. formatError
const Bad = UserSchema.validate({ age: 10 });
console.log('FormatError:', joi.formatError(Bad.error));

// 8. forbidden
const ForbidSchema = joi.object({
  visible: joi.string(),
  secret: joi.forbidden(),
});
console.log('Forbid:', ForbidSchema.validate({ visible: 'ok', secret: 'nope' }));

// 9. atLeastOneOf
const AtLeastOneSchema = joi.atLeastOneOf(['a', 'b'])(joi.object({ a: joi.string(), b: joi.string() }));
console.log('AtLeastOneOf:', AtLeastOneSchema.validate({ a: 'x' }));
console.log('AtLeastOneOf:', AtLeastOneSchema.validate({}));

// 10. mutuallyExclusive
const MutExSchema = joi.mutuallyExclusive(['a', 'b'])(joi.object({ a: joi.string(), b: joi.string() }));
console.log('MutuallyExclusive (a):', MutExSchema.validate({ a: 'x' }));
console.log('MutuallyExclusive (both):', MutExSchema.validate({ a: 'x', b: 'y' }));

// 11. dynamicDefault
const DynDefaultSchema = joi.object({
  now: joi.dynamicDefault(joi.number(), 'now', () => Date.now()),
});
console.log('DynamicDefault:', DynDefaultSchema.validate({}));