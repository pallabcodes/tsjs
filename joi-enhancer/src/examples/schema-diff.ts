import { joi } from '../index';

// Define two versions of a schema
const v1 = joi.object({
  name: joi.string().required(),
  age: joi.number(),
  email: joi.string(),
});

const v2 = joi.object({
  name: joi.string().required(),
  age: joi.string(), // type changed!
  phone: joi.string(), // new field
});

// Use the diff method to compare schemas
const diff = v1.diff(v2);
/*
diff = {
  added: ['phone'],
  removed: ['email'],
  changed: ['age']
}
*/
console.log('Schema diff:', diff);