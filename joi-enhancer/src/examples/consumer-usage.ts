import { joi, Joi, InferJoiType } from '../index';

// Example 1: Basic usage
const userSchema = joi.object<{
  username: string;
  age?: number;
}>({
  username: joi.string().required(),
  age: joi.number().optional(),
});
type User = InferJoiType<typeof userSchema>;
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
type User2 = InferJoiType<typeof UserSchema>;
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
type Alt = InferJoiType<typeof AltSchema>;
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