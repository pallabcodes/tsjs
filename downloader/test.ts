// test.ts
import { joi } from '@roninbyte/joi-enhancer';

// Simple user schema
const UserSchema = joi.object<{
  username: string;
  age?: number;
}>({
  username: joi.string().required(),
  age: joi.number().optional(),
});

console.log('Valid user:', UserSchema.validate({ username: 'alice', age: 30 }));

// Conditional field example
const AdminSchema = joi.object<{
  role: 'admin' | 'user';
  adminCode?: string;
}>({
  role: joi.string().valid('admin', 'user').required(),
  adminCode: joi.string().when('role', {
    is: 'admin',
    then: joi.string().required(),
    otherwise: joi.forbidden(),
  }),
});

console.log('Valid admin:', AdminSchema.validate({ role: 'admin', adminCode: 'SECRET' }));
console.log('Valid user:', AdminSchema.validate({ role: 'user' }));

// Stripped field example
const StrippedSchema = joi.object({
  visible: joi.string().required(),
  secret: joi.stripField(),
});
console.log('Stripped:', StrippedSchema.validate({ visible: 'show', secret: 'hide' }));