import { joi, formatErrorWithTranslations, Infer, createSchema, alternatives, createAlternativesSchema } from '@roninbyte/joi-enhancer';

// 1. Strongly-typed object schema
const UserSchema = joi.object<{ username: string; age?: number }>({
  username: joi.string().required(),
  age: joi.number().optional(),
});

// Type hint works perfectly now
type User = Infer<typeof UserSchema>;
const john: User = { username: 'john', age: 25 };

console.log('User:', UserSchema.validate({ username: 'alice', age: 30 }));

// 2. alternatives
const AltSchema = createAlternativesSchema(
  alternatives<string | number>().try(joi.string(), joi.number())
);
type AltType = Infer<typeof AltSchema>;

// Now this will be a TS error (as expected):
const altStringBool = AltSchema.validate(false); // ❌ Error: Argument of type 'false' is not assignable to parameter of type 'string | number'

const altString = AltSchema.validate('hello'); // ✅ OK, type hint: string | number
const altNumber = AltSchema.validate(42);      // ✅ OK, type hint: string | number

console.log('Alt (string):', altString);
console.log('Alt (number):', altNumber); // number

// 3. conditionalField
const CondSchema = joi.object<{
  type: string;
  value: string | number;
}>({
  type: joi.string().required(),
  value: joi.conditionalField('type', [
    { is: 'special', then: joi.string().required(), otherwise: joi.number().optional() }
  ]),
});

type CondType = Infer<typeof CondSchema>;

const condExample: CondType = { type: 'other', value: 123 }; // This is valid
console.log('Cond (valid):', CondSchema.validate(condExample));


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
  now: joi.dynamicDefault(joi.number().optional(), 'now', () => 42),
});

console.log('DynamicDefault (empty):', DynDefaultSchema.validate({})); // Should print { now: 42 }
console.log('DynamicDefault (with now):', DynDefaultSchema.validate({ now: 100 })); // Should print { now: 100 }

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

// --- Type hinting and error highlighting ---
const user1 = UserSchema.validate({ username: 'alice' }); // age is optional, type hint shows both fields
// Uncommenting the next line should show a TS error in your editor (missing username):
// const user2 = UserSchema.validate({}); // Error: Property 'username' is missing

// --- Type extraction and extension ---
type UserType = Infer<typeof UserSchema>;
type AdminUser = UserType & { adminCode: string };
const admin: AdminUser = { username: 'bob', adminCode: 'SECRET' }; // type hint for adminCode

// --- Pick/Omit and type hints ---
const OnlyUsernameSchema = UserSchema.pick(['username']);
type OnlyUsername = Infer<typeof OnlyUsernameSchema>;
const onlyUsername: OnlyUsername = OnlyUsernameSchema.validate({ username: 'foo' }); // type hint: { username: string }

const NoAgeSchema = UserSchema.omit(['age']);
type NoAge = Infer<typeof NoAgeSchema>;
const noAge: NoAge = NoAgeSchema.validate({ username: 'bar' }); // type hint: { username: string }

// --- DeepPartial and type hints ---
const DeepPartialSchema = UserSchema.deepPartial();
type DeepPartialUser = Infer<typeof DeepPartialSchema>;
const partialUser: DeepPartialUser = {}; // both fields optional, type hint shows this

// --- Custom validator and type hint ---
const CustomUserSchema = UserSchema.withCustomValidator('username', (value) => {
  if (value === 'root') throw new Error('Reserved');
  return value;
});
const customUser = CustomUserSchema.validate({ username: 'alice' }); // type hint: { username: string; age?: number }