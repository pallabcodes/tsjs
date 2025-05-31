import Joi from 'joi';

const schema = Joi.object({
  username: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').required(),
  adminCode: Joi.string()
});

const validationResult = schema.validate({ 
  username: 'admin1', 
  role: 'admin', 
  adminCode: 'secret'
});

// TypeScript knows the type:
if (!validationResult.error) {
  // validationResult.value is typed
}