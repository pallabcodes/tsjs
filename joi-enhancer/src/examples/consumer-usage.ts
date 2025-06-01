import {
  joi,
  Joi,
  Infer,  // Updated import
  formatErrorWithTranslations
} from '../index';

// Example 1: Basic usage
const userSchema = joi.object<{
  username: string;
  age?: number;
}>({
  username: joi.string().required(),
  age: joi.number().optional(),
});

type User = Infer<typeof userSchema>;
const validUser: User = userSchema.validate({ username: 'alice', age: 30 });
console.log('Basic user validated:', validUser);

// Example 2: Object-level conditional
const UserSchema = joi.object<{
  username: string;
  role: 'admin' | 'user';
  adminCode?: string;
}>({
  username: joi.string().required(),
  role: joi.string().valid('admin', 'user').required(),
  adminCode: joi.string().when('role', {
    is: 'admin',
    then: joi.string().required(),
    otherwise: joi.forbidden(),
  }),
});
type User2 = Infer<typeof UserSchema>;
const userObj: User2 = UserSchema.validate({
  username: 'alice',
  role: 'admin',
  adminCode: 'SECRET',
});
console.log('User with conditional adminCode validated:', userObj);

// Example 3: Alternatives-level conditional
const AltSchema = joi.object<{
  x: string;
  y?: string;
}>({
  x: joi.string().min(1).max(5).required(),
  y: joi.alternatives().conditional('x', [
    { is: 'foo', then: joi.string().valid('bar').required() },
    { otherwise: joi.string().optional() },
  ]),
});
type Alt = Infer<typeof AltSchema>;
const altValue: Alt = AltSchema.validate({ x: 'foo', y: 'bar' });
console.log('Alt validated:', altValue);

// Example 4: Native Joi usage (for advanced/edge cases)
const rawSchema = Joi.object({
  foo: Joi.string().required(),
  bar: Joi.number().min(0),
});
const { error: rawError, value: rawValue } = rawSchema.validate({ foo: 'hello', bar: 42 });
if (rawError) {
  console.error('Raw Joi validation failed:', rawError.message);
} else {
  console.log('Raw Joi validated:', rawValue);
}

// Example 5: Always strip the `secret` field
const StrippedSchema = joi.object<{
  visible: string;
  secret?: string;
}>({
  visible: joi.string().required(),
  secret: joi.stripField(),
});
const strippedValue = StrippedSchema.validate({ visible: 'show', secret: 'hide-this' });
console.log('Stripped field result:', strippedValue); // { visible: 'show' }

// Example 6: Conditional strip
const ConditionalStripSchema = joi.object<{
  flag: boolean;
  data?: string;
}>({
  flag: joi.boolean(),
  data: joi.string().when('flag', {
    is: true,
    then: joi.stripField(),
    otherwise: joi.string().required(),
  }),
});
console.log(
  'Conditional strip (flag=true):',
  ConditionalStripSchema.validate({ flag: true, data: 'should be stripped' })
); // { flag: true }
console.log(
  'Conditional strip (flag=false):',
  ConditionalStripSchema.validate({ flag: false, data: 'must be present' })
); // { flag: false, data: 'must be present' }

// Example 7: Custom validator example
const schema = joi.object<{
  username: string;
  age: number;
}>({
  username: joi.string().required(),
  age: joi.number().required(),
})
  .withCustomValidator('username', (value) => {
    if (value === 'admin') throw new Error('Username "admin" is reserved');
    return value;
  }, 'Reserved username not allowed');

console.log(schema.validate({ username: 'alice', age: 30 })); // OK
console.log(schema.validate({ username: 'admin', age: 30 })); // Throws with custom error

// Example 8: Redacting sensitive fields
const SensitiveSchema = joi.object<{
  username: string;
  password: string;
  email: string;
}>({
  username: joi.string().required(),
  password: joi.string().required(),
  email: joi.string().email().required(),
});

const user = SensitiveSchema.validate({
  username: 'alice',
  password: 'supersecret',
  email: 'alice@mail.com',
});

// Redact sensitive fields before logging or returning
const redact = SensitiveSchema.withRedactedFields(['password']);
console.log('Redacted user:', redact.redact(user)); // <-- FIXED: use .redact(user)

// Example 9: Async validation pipeline (e.g., uniqueness check)
async function fakeEmailCheck(email: string) {
  // Simulate async DB check
  if (email === 'taken@mail.com') throw new Error('Email already taken');
}

const AsyncUserSchema = joi.object<{
  username: string;
  email: string;
}>({
  username: joi.string().required(),
  email: joi.string().email().required(),
});

(async () => {
  try {
    const user = await AsyncUserSchema.validateAsync(
      { username: 'alice', email: 'taken@mail.com' },
      [
        async (value: { username: string; email: string }) => await fakeEmailCheck(value.email),
      ]
    );
    console.log('Async validated user:', user);
  } catch (e) {
    if (e instanceof Error) {
      console.error('Async validation failed:', e.message);
    } else {
      console.error('Async validation failed:', e);
    }
  }
})();

// Example 10: Error formatting with translations
const schema10 = joi.object<{
  username: string;
}>({
  username: joi.string().required(),
}).withTranslationKey('username', 'form.username');

const translationMap = {
  'form.username': 'Please enter your username.',
};

const { error } = schema10.raw.validate({});
if (error) {
  const formatted = formatErrorWithTranslations(error, schema10.raw, translationMap);
  if (formatted.details && formatted.details.length > 0 && formatted.details[0]) {
    console.log(formatted.details[0].message); // "Please enter your username."
  }
}