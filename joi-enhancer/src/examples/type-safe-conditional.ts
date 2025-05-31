import { joi, InferJoiType, requireIf, Joi } from '../index';
import { ConditionalRequired } from '../types/conditional-helper';

const schema = joi.object({
  role: joi.string().valid('admin', 'user').required(),
  adminCode: requireIf(joi.string(), 'role', 'admin'),
});

type RawUser = InferJoiType<typeof schema>;
type User = ConditionalRequired<RawUser, 'role', 'admin', 'adminCode'>;
// User =
// | { role: 'admin'; adminCode: string }
// | { role: 'user'; adminCode?: string }

console.log(schema.validate({ role: 'user' })); // valid, adminCode optional
console.log(schema.validate({ role: 'admin', adminCode: '1234' })); // valid, adminCode required
console.log(schema.validate({ role: 'admin' })); // invalid, adminCode required