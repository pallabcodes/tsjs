import express, { Request, Response } from 'express';
import { joi, formatErrorWithTranslations } from '@roninbyte/joi-enhancer';
import type { Infer } from '@roninbyte/joi-enhancer';

const app = express();
app.use(express.json());

// --- 1. Define handler type ---
type ExpressHandler = (req: Request, res: Response) => Promise<void> | void;

// --- 2. Registration Schema & Handler ---
const RegisterSchema = joi.object<{
  username: string;
  password: string;
  email: string;
}>({
  username: joi.string().min(3).max(32).required(),
  password: joi.string().min(8).required(),
  email: joi.string().email().required(),
});
type RegisterInput = Infer<typeof RegisterSchema>;

// Use Pick from the schema type instead of redundant interface
const registerHandler: ExpressHandler = (req, res) => {
  const { value, error } = RegisterSchema.safeValidate(req.body);
  if (error) {
    const formatted = formatErrorWithTranslations(
      error,
      RegisterSchema.raw,
      {
        'form.username': 'Please enter a valid username.',
        'form.password': 'Password must be at least 8 characters.',
        'form.email': 'Please enter a valid email address.'
      }
    );
    res.status(400).json({ error: formatted.details[0]?.message });
    return;
  }

  if (!value) {
    res.status(500).json({
      error: 'Internal validation error'
    });
    return;
  }

  // Use SchemaWrapper's .pick() method instead of TypeScript's Pick type
  const safeUser = RegisterSchema.pick(['username', 'email']).validate(value);
  res.status(201).json({ user: safeUser });
};

// --- 3. Login Schema & Handler ---
const LoginSchema = joi.object<{
  username: string;
  password: string;
}>({
  username: joi.string().required(),
  password: joi.string().required(),
}).withCustomValidator('username', (value) => {
  if (value === 'admin') throw new Error('Reserved username');
  return value;
});
type LoginInput = Infer<typeof LoginSchema>;

const loginHandler: ExpressHandler = (req, res) => {
  const { value, error } = LoginSchema.safeValidate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  const login: LoginInput = value!;
  res.status(200).json({ message: `Welcome, ${login.username}!` });
};

// --- 4. Profile Update Schema & Handler ---
const ProfileSchema = RegisterSchema.partial();
type ProfileInput = Infer<typeof ProfileSchema>;

const profileHandler: ExpressHandler = (req, res) => {
  const { value, error } = ProfileSchema.safeValidate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  const profile: ProfileInput = value!;
  res.status(200).json({ updated: profile });
};

// --- 5. User Schema & Handler with Redacted and Omitted Fields ---
const UserWithSecretSchema = RegisterSchema.withRedactedFields(['password']);

const UserWithoutSecretSchema = RegisterSchema.withOmittedFields(['password']);

type UserWithSecret = Infer<typeof UserWithSecretSchema>;
type UserWithoutSecret = Infer<typeof UserWithoutSecretSchema>;

const userHandler: ExpressHandler = (req, res) => {
  const user = {
    username: req.params.username,
    email: 'user@example.com',
    password: 'should-not-be-exposed'
  };

  // Redact password (mask value)
  const redactedUser = UserWithSecretSchema.redact(user);

  // Omit password (remove field)
  const omittedUser = UserWithoutSecretSchema.omitFields(user);

  res.json({
    redacted: redactedUser, // { username, email, password: '[REDACTED]' }
    omitted: omittedUser    // { username, email }
  });
};

// --- 6. Register Routes ---
app.post('/register', registerHandler);
app.post('/login', loginHandler);
app.put('/profile', profileHandler);
app.get('/user/:username', userHandler);

// --- 7. Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});