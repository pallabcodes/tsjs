import { joi, formatErrorWithTranslations } from '@roninbyte/joi-enhancer';

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
const badResult = UserSchema.safeValidate({ age: 10 });
if (badResult.value) {
  // Now badResult.value is of type { username: string; age?: number }
}

// 8. forbidden
const ForbidSchema = joi.object({
  visible: joi.string(),
  secret: joi.forbidden(),
});
console.log('Forbid:', ForbidSchema.validate({ visible: 'ok', secret: 'nope' }));

// 9. atLeastOneOf
const AtLeastOneSchema = joi.atLeastOneOf(['a', 'b'])(joi.object({ a: joi.string(), b: joi.string() }).raw);
console.log('AtLeastOneOf:', AtLeastOneSchema.validate({ a: 'x' }));
console.log('AtLeastOneOf:', AtLeastOneSchema.validate({}));

// 10. mutuallyExclusive
const MutExSchema = joi.mutuallyExclusive(['a', 'b'])(joi.object({ a: joi.string(), b: joi.string() }).raw);
console.log('MutuallyExclusive (a):', MutExSchema.validate({ a: 'x' }));
console.log('MutuallyExclusive (both):', MutExSchema.validate({ a: 'x', b: 'y' }));

// 11. dynamicDefault
const DynDefaultSchema = joi.object({
  now: joi.dynamicDefault(joi.number(), 'now', () => Date.now()),
});
console.log('DynamicDefault:', DynDefaultSchema.validate({}));

// 12. deepPartial
const DeepSchema = joi.object({
  foo: joi.object({
    bar: joi.string().required(),
    baz: joi.number().required(),
  }),
});
const DeepPartial = DeepSchema.deepPartial();
console.log('DeepPartial:', DeepPartial.validate({ foo: { bar: 'ok' } }));

// 13. pick and omit
const Picked = UserSchema.pick(['username']);
console.log('Pick:', Picked.validate({ username: 'only' }));
const Omitted = UserSchema.omit(['age']);
console.log('Omit:', Omitted.validate({ username: 'no age' }));

// 14. merge and extend
const Extra = joi.object({ extra: joi.string() });
const Merged = UserSchema.merge(Extra);
console.log('Merge:', Merged.validate({ username: 'a', extra: 'b' }));
const Extended = UserSchema.extendWith({ extra: joi.string() });
console.log('ExtendWith:', Extended.validate({ username: 'a', extra: 'b' }));

// 15. withCustomValidator
const CustomSchema = UserSchema.withCustomValidator('username', (value) => {
  if (value === 'admin') throw new Error('Reserved');
  return value;
});
try {
  CustomSchema.validate({ username: 'admin' });
} catch (e) {
  console.log('CustomValidator:', (e as Error).message);
}

// 16. withRedactedFields
const SensitiveSchema = joi.object<{ username: string; password: string }>({
  username: joi.string(),
  password: joi.string(),
});
const user = SensitiveSchema.validate({ username: 'alice', password: 'secret' });
const redact = SensitiveSchema.withRedactedFields(['password']);
const { value: safeUser } = SensitiveSchema.safeValidate({ username: 'alice', password: 'secret' });
if (safeUser) {
  console.log('Redacted:', redact(safeUser));
}

// 17. validateAsync
const AsyncSchema = joi.object<{ email: string }>({
  email: joi.string().email(),
});

AsyncSchema.validateAsync({ email: 'bad' }, [
  async (value) => {
    // value is now { email: string }
    if (value.email === 'bad') throw new Error('Email taken');
  }
]).catch(e => console.log('Async validation:', e.message));

// 18. diff
const v1 = joi.object({ a: joi.string(), b: joi.number() });
const v2 = joi.object({ a: joi.number(), c: joi.string() });
console.log('Diff:', v1.diff(v2));

// 19. generateExample
console.log('Example:', UserSchema.generateExample());

// 20. withTranslationKey + formatErrorWithTranslations
const I18nSchema = joi.object<{ username: string }>({
  username: joi.string().required(),
}).withTranslationKey('username', 'form.username');
const translationMap = { 'form.username': 'Please enter your username.' };
const { error: i18nError } = I18nSchema.raw.validate({});
if (i18nError) {
  const formatted = formatErrorWithTranslations(i18nError, I18nSchema.raw, translationMap);
  console.log('I18n error:', formatted.details[0]?.message);
}

// 21. partial, required, extendWithDefaults
const Partial = UserSchema.partial();
console.log('Partial:', Partial.validate({}));
const Required = UserSchema.required();
console.log('Required:', Required.safeValidate({ username: 'a', age: 1 }));
const Defaults = UserSchema.extendWithDefaults({ age: 99 });
console.log('Defaults:', Defaults.validate({ username: 'a' }));

// 22. pickBy, pickByType, omitBy
const PickBy = UserSchema.pickBy((schema, key) => key === 'username');
console.log('PickBy:', PickBy.validate({ username: 'a' }));
const PickByType = UserSchema.pickByType('string');
console.log('PickByType:', PickByType.validate({ username: 'a' }));
const OmitBy = UserSchema.omitBy((schema, key) => key === 'age');
console.log('OmitBy:', OmitBy.validate({ username: 'a' }));

// 23. describeWithExamples, getDependencyGraph, getFieldPresence, getVersion
console.log('DescribeWithExamples:', UserSchema.describeWithExamples());
console.log('DependencyGraph:', UserSchema.getDependencyGraph());
console.log('FieldPresence:', UserSchema.getFieldPresence());
console.log('Version:', UserSchema.withVersion('1.2.3').getVersion());