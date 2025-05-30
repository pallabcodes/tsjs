# Project Title: JOI Validation Wrapper

## Overview
This project provides a modular validation wrapper built on top of JOI, designed to facilitate user registration and login validation. It promotes code reusability and type safety through TypeScript interfaces and shared validation rules.

## Folder Structure
```
tsjs
├── src
│   ├── index.ts                # Entry point of the application
│   ├── schemas                  # Contains validation schemas
│   │   ├── RegisterSchema.ts    # Validation rules for user registration
│   │   ├── LoginSchema.ts       # Validation rules for user login
│   │   └── shared               # Shared validation rules
│   │       └── rules.ts         # Common validation rules
│   ├── types                    # TypeScript interfaces and types
│   │   └── index.ts             # Exports types for validation
│   └── validators               # JOI validation logic
│       └── JoiValidator.ts      # Encapsulates JOI validation methods
├── package.json                 # npm configuration and dependencies
├── tsconfig.json                # TypeScript configuration
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc.json             # Prettier configuration
├── .prettierignore              # Files to ignore for Prettier
├── .gitignore                   # Files to ignore for Git
└── README.md                    # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd tsjs
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
- Import the validation schemas and the JoiValidator in your application:
  ```typescript
  import { RegisterSchema } from './schemas/RegisterSchema';
  import { LoginSchema } from './schemas/LoginSchema';
  import { JoiValidator } from './validators/JoiValidator';
  ```

- Use the schemas to validate user input:
  ```typescript
  const registerData = { /* user registration data */ };
  const validationResult = JoiValidator.validate(RegisterSchema, registerData);
  ```

- Example of using `joi-enhancer` with JOI:
  ```typescript
  import { joi } from 'joi-enhancer';

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

  const user = UserSchema.validate({
    username: 'alice',
    role: 'admin',
    adminCode: 'SECRET',
  });
  ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the ISC License.

# Usage

# joi-enhancer

A type-safe, ergonomic, and production-ready wrapper around Joi for Node.js and TypeScript.

---

## 🚀 Installation

> **Best Practice:**  
> `joi-enhancer` lists `joi` as a **peer dependency**.  
> This means you should install both in your project to ensure version compatibility and avoid duplicate Joi instances.

```bash
npm install joi joi-enhancer
```

---

## 🛠️ Quick Usage

### 1. Import the API

```typescript
import { joi } from 'joi-enhancer';
```

---

### 2. Define and Validate Schemas

#### Object Schema with Conditional Validation

```typescript
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

const user = UserSchema.validate({
  username: 'alice',
  role: 'admin',
  adminCode: 'SECRET',
});
```

---

#### Alternatives/Conditional Field

```typescript
const AltSchema = joi.object<{
  x: string;
  y: string;
}>({
  x: joi.string().min(1).max(5).required(),
  y: joi.conditionalField('x', [
    { is: 'foo', then: joi.string().valid('bar').required() },
    { not: 'foo', then: joi.string().optional() },
  ]).match('one'),
});

const alt = AltSchema.validate({ x: 'foo', y: 'bar' });
```

---

#### Always Strip a Field

```typescript
const schema = joi.object({
  visible: joi.string().required(),
  secret: joi.stripField(),
});

const result = schema.validate({ visible: 'show', secret: 'hide' });
// result: { visible: 'show' }
```

---

#### Conditionally Require a Field

```typescript
const schema = joi.object({
  status: joi.string().valid('active', 'inactive').required(),
  reason: joi.requireIf('status', 'inactive'),
});
```

---

#### Type Guards

```typescript
joi.isObjectSchema(joi.object({}).raw); // true
joi.isStringSchema(joi.string());       // true
```

---

#### Format Joi Errors

```typescript
const schema = joi.object({ foo: joi.string().required() });
const { error } = schema.raw.validate({});
if (error) {
  const formatted = joi.formatError(error);
  // formatted.message, formatted.details
}
```

---

#### Use Native Joi Directly (for advanced cases)

```typescript
import { Joi } from 'joi-enhancer';

const rawSchema = Joi.object({ foo: Joi.string().required() });
const { error, value } = rawSchema.validate({});
```

---

## 🧩 Schema Fragments (Reusable Parts)

```typescript
const nameFragment = {
  firstName: joi.string().required(),
  lastName: joi.string().required(),
};

const addressFragment = {
  address: joi.string(),
  city: joi.string(),
};

const UserSchema = joi.object({
  ...nameFragment,
  ...addressFragment,
  age: joi.number().min(0),
});
```

---

## 🧪 Testing Helpers

See `/src/examples/helpers.test.ts` for tests of all helpers.

---

## 📁 Where to Put This File

**Place this documentation in:**

```
/home/pallabkayal/Personal/tsjs/joi-enhancer/README.md
```

---

## 👩‍💻 For New Developers

- Use the `joi` object for all schema creation and validation.
- Use helpers like `requireIf`, `stripField`, `conditionalField` for advanced logic.
- Use `.raw` to access the underlying Joi schema if needed.
- Use `formatError` for API-friendly error responses.
- See the `/src/examples/` folder for more real-world usage.

---

## Edge Cases & Advanced Usage

### Alternatives

You can use `joi.alternatives(...)` for schemas that accept multiple shapes:
```typescript
const schema = joi.alternatives().try(
  joi.object({ type: joi.string().valid('a'), value: joi.number() }),
  joi.object({ type: joi.string().valid('b'), value: joi.string() })
);
```

### Custom Extensions

If you need to use custom Joi extensions, use the exported `Joi` object:
```typescript
import { Joi } from 'joi-enhancer';
const customJoi = Joi.extend(/* ... */);
```

---

**You are ready to build robust, type-safe, and production-grade validation with joi-enhancer!**

