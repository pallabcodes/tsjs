tsjs/
├── node_modules/
├── package.json         # Root config (optionally use workspaces)
├── package-lock.json
├── .gitignore
├── .prettierrc / .eslintrc etc.
├── joi-enhancer/
│   ├── package.json
│   ├── tsconfig.json
│   ├── rollup.config.js
│   ├── src/
│   │   ├── index.ts
│   │   ├── joiWrapper.ts
│   │   ├── joiWrapper.d.ts
│   │   └── examples/
│   │       └── usage.ts
│   └── dist/
├── zod-enhancer/        # (future)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   └── dist/
└── ... (other wrappers)