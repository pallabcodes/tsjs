import { joi, formatErrorWithTranslations, Infer, alternatives, createAlternativesSchema, Joi, createSchema } from '@roninbyte/joi-enhancer';

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
// const altStringBool = AltSchema.validate(false); // ❌ Error: Argument of type 'false' is not assignable to parameter of type 'string | number'

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


// --- 4. stripField with type hints ---
const StripSchema = joi.object<{
  keep: string;
  remove?: never;  // TypeScript will ensure this field is never present
}>({
  keep: joi.string().required(),
  remove: joi.stripField(),
});

type StripType = Infer<typeof StripSchema>;
const stripped: StripType = StripSchema.validate({ keep: "value" });

// console.log('Strip:', StripSchema.validate({ keep: 'value', remove: 'should not be here' }));

// Type error if you try to access stripped.remove

// --- 5. requireIf with proper type inference ---
const ReqIfSchema = joi.object<{
  status: 'active' | 'inactive';
  reason?: string;
}>({
  status: joi.string().valid('active', 'inactive'),
  reason: joi.requireIf(joi.string(), 'status', 'inactive'),
});


type ReqIfType = Infer<typeof ReqIfSchema>;
// This will error if status is 'inactive' and reason is missing
const activeCase: ReqIfType = ReqIfSchema.validate({ status: 'active' });
const inactiveCase: ReqIfType = ReqIfSchema.validate({
  status: 'inactive',
  reason: 'why'
});

// 6. isObjectSchema / isStringSchema
console.log('isObjectSchema(UserSchema.raw):', joi.isObjectSchema(UserSchema.raw));
console.log('isStringSchema(joi.string()):', joi.isStringSchema(joi.string()));

// 7. formatError
const badResult = UserSchema.safeValidate({ age: 10 });
if (badResult.value) {
  // Now badResult.value is of type { username: string; age?: number }
}

// --- 8. forbidden with type hints ---
const ForbidSchema = joi.object<{
  visible: string;
  secret?: never;  // TypeScript will ensure this can never exist
}>({
  visible: joi.string(),
  secret: joi.forbidden(),
});

type ForbidType = Infer<typeof ForbidSchema>;
const forbidResult: ForbidType = ForbidSchema.validate({ visible: 'ok' });
// Error: const invalid = ForbidSchema.validate({ visible: 'ok', secret: 'nope' });

// --- 9. atLeastOneOf with union types ---
type AtLeastOneType = {
  a?: string;
  b?: string;
} & ({ a: string } | { b: string });  // Ensure at least one exists

const AtLeastOneSchema = joi.object<AtLeastOneType>({
  a: joi.string(),
  b: joi.string(),
});

// Access the raw Joi schema for atLeastOneOf, then wrap result back in SchemaWrapper
const withAtLeastOne = createSchema<AtLeastOneType>(
  // joi.atLeastOneOf(['a', 'b'])(AtLeastOneSchema.raw)
  joi.atLeastOneOf(['a', 'b'])(AtLeastOneSchema.raw as Joi.ObjectSchema)
);

type AtLeastOneResult = Infer<typeof withAtLeastOne>;

// Now you get proper type hints and runtime validation
const invalid = withAtLeastOne.validate({}); // Will fail at runtime, type: AtLeastOneType
const valid = withAtLeastOne.validate({ b: 'ok' }); // OK, type: AtLeastOneType

// TypeScript will error on this:
// withAtLeastOne.validate({ c: 'invalid' }); // Error: Object literal may only specify known properties

// 10. mutuallyExclusive

// Type-level mutually exclusive utility
type MutuallyExclusive<A extends string, B extends string> =
  | { [K in A]: string; } & { [K in B]?: never }
  | { [K in B]: string; } & { [K in A]?: never };

type MutExType = MutuallyExclusive<'a', 'b'>;

const MutExSchema = createSchema<MutExType>(
  joi.mutuallyExclusive(['a', 'b'])(
    joi.object({
      a: joi.string(),
      b: joi.string(),
    }).raw as Joi.ObjectSchema
  )
);

type MutExResult = Infer<typeof MutExSchema>;

// Valid: only 'a'
const onlyA: MutExResult = MutExSchema.validate({ a: 'x' });
// Valid: only 'b'
const onlyB: MutExResult = MutExSchema.validate({ b: 'y' });


// Uncommenting these lines will show TS errors in your IDE:
// const both: MutExResult = MutExSchema.validate({ a: 'x', b: 'y' }); // ❌ TS error
// const neither: MutExResult = MutExSchema.validate({}); // ❌ TS error

console.log('MutuallyExclusive (a):', onlyA);
console.log('MutuallyExclusive (b):', onlyB);


// 11. dynamicDefault
const DynDefaultSchema = joi.object<{ now?: number }>({
  now: joi.dynamicDefault(joi.number(), 'now', () => 42),
});

type DynDefaultType = Infer<typeof DynDefaultSchema>;

// Valid: omitted, gets default
const withDefault: DynDefaultType = DynDefaultSchema.validate({});
// Valid: provided, must be number
const withNow: DynDefaultType = DynDefaultSchema.validate({ now: 100 });

// Uncommenting this will show a TS error:
// const invalid: DynDefaultType = DynDefaultSchema.validate({ now: "oops" }); // ❌ TS error

console.log('DynamicDefault (empty):', withDefault); // { now: 42 }
console.log('DynamicDefault (with now):', withNow);  // { now: 100 }



const DeepSchema = joi.object<{ foo: { bar: string; baz: number } }>({
  foo: joi.object({
    bar: joi.string().required(),
    baz: joi.number().required(),
  }),
});

const DeepPartial = DeepSchema.deepPartial();
type DeepPartialType = Infer<typeof DeepPartial>;

// All fields optional at all levels
const partial1: DeepPartialType = {};
const partial2: DeepPartialType = { foo: {} };
const partial3: DeepPartialType = { foo: { bar: 'ok' } };
const partial4: DeepPartialType = { foo: { baz: 42 } };
const partial5: DeepPartialType = { foo: { bar: 'ok', baz: 42 } };

// Uncommenting this will show a TS error (extra field):
// const invalid: DeepPartialType = { foo: { qux: true } }; // ❌ TS error

console.log('DeepPartial:', DeepPartial.validate(partial3));

// 13. pick and omit
const Picked = UserSchema.pick(['username']);
console.log('Pick:', Picked.validate({ username: 'john' }));

const Omitted = UserSchema.omit(['age']);
console.log('Omit:', Omitted.validate({ username: 'no age' }));

// 14. merge and extend
const Extra = joi.object<{ extra: string }>({
  extra: joi.string().required()
});

// Merge approach
const Merged = UserSchema.merge(Extra);
type MergedType = Infer<typeof Merged>;

// ExtendWith approach
const Extended = UserSchema.extendWith<{ extra: string }>({
  extra: joi.string().required()
});
type ExtendedType = Infer<typeof Extended>;

// Now both of these will work without TypeScript errors
const mergedValid = Merged.validate({
  username: 'a',
  extra: 'b'
});

const extendedValid = Extended.validate({
  username: 'a',
  extra: 'b'
});

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