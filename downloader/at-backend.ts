import express, { Request, Response } from 'express';
import { joi, formatErrorWithTranslations } from '@roninbyte/joi-enhancer';
import type { Infer } from '@roninbyte/joi-enhancer';

const app = express();
app.use(express.json());

// --- 1. Registration Schema ---
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

// --- 2. Registration Endpoint ---
// @ts-expect-error req, res types are not fully compatible with Express
app.post('/register', (req: Request, res: Response) => {
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
    return res.status(400).json({ error: formatted.details[0]?.message });
  }

  // value is now fully typed as RegisterInput
  const user: RegisterInput = value!;
  res.status(201).json({ user: { username: user.username, email: user.email } });
});

// --- 3. Login Schema with Custom Validator ---
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

// @ts-expect-error req, res types are not fully compatible with Express
app.post('/login', (req: Request<any, any, LoginInput>, res: Response) => {
  const { value, error } = LoginSchema.safeValidate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const login: LoginInput = value!;
  res.status(200).json({ message: `Welcome, ${login.username}!` });
});

// --- 4. Profile Update with Partial Schema ---
const ProfileSchema = RegisterSchema.partial();
type ProfileInput = Infer<typeof ProfileSchema>;

// @ts-expect-error req, res types are not fully compatible with Express
app.put('/profile', (req: Request<any, any, ProfileInput>, res: Response) => {
  const { value, error } = ProfileSchema.safeValidate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const profile: ProfileInput = value!;
  res.status(200).json({ updated: profile });
});

// --- 5. Example: Redacted fields ---
const UserWithSecretSchema = RegisterSchema.withRedactedFields(['password']);

type UserWithSecret = Infer<typeof UserWithSecretSchema>;

const SafePartial = RegisterSchema.withRedactedFields(['password']).partial();

type SafePartialUser = Infer<typeof SafePartial>;

app.get('/user/:username', (req: Request, res: Response) => {
  // Simulate fetching user
  const user: UserWithSecret = {
    username: req.params.username,
    email: 'user@example.com',
    password: 'should-not-be-exposed'
  };

  const safeUser = UserWithSecretSchema.redact(user);
  // safeUser: { username: 'alice', email: 'alice@mail.com', password: '[REDACTED]' }

  res.json(safeUser);
});

// --- 6. Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});