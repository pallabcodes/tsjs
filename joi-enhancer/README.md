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

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the ISC License.