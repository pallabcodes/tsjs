Exploring the codebase for existing class decorators to provide context.


[11 tools called]


## How Class Decorators Work: From Implementation to Runtime

### 1. Implementing a Class Decorator

A class decorator is a function that receives the class constructor and can modify or replace it.

```typescript
// Simple decorator without parameters
function ClassDecorator(target: any) {
  console.log('Decorator called for:', target.name);
  // You can modify the class here
  return target;
}

// Decorator factory (with parentheses - allows parameters)
function ClassDecorator(options?: { prefix?: string }) {
  return function(target: any) {
    console.log('Decorator called with options:', options);
    // Modify the class
    return target;
  };
}
```

When you write:
```typescript
@ClassDecorator()  // or @ClassDecorator
class Example {}
```

TypeScript transforms it into:
```typescript
let Example = ClassDecorator(class Example {}) || class Example {};
```

### 2. Compile Time (TypeScript Compilation)

When TypeScript compiles your code:

**Step 1: TypeScript reads your source**
- Sees `@ClassDecorator()` above `class Example`
- Checks `tsconfig.json` for `experimentalDecorators: true` and `emitDecoratorMetadata: true`

**Step 2: TypeScript transforms the decorator**
- Converts the decorator syntax into a function call
- If `emitDecoratorMetadata: true`, it also emits metadata about types, parameters, etc.

**Step 3: JavaScript output**
The compiled JavaScript looks like:
```javascript
let Example = __decorate([
    ClassDecorator()
], Example);
```

**Step 4: Metadata emission**
With `emitDecoratorMetadata: true`, TypeScript adds calls like:
```javascript
__metadata("design:type", SomeType)
__metadata("design:paramtypes", [Dependency1, Dependency2])
```

This metadata is stored using the `reflect-metadata` library.

### 3. Development Mode (`npm run start:dev`)

When you run `npm run start:dev`:

**Step 1: NestJS CLI starts**
- Runs `nest start --watch`
- Watches for file changes

**Step 2: TypeScript compilation**
- Compiles `.ts` files to `.js` in memory (or to `dist/`)
- Decorators are transformed to function calls
- Metadata is emitted

**Step 3: Node.js loads the code**
- Executes the compiled JavaScript
- `reflect-metadata` must be imported first (usually in `main.ts`)

**Step 4: Decorator execution**
- Decorators run when the class is defined (not when instantiated)
- For `@Controller('courses')`, NestJS:
  - Registers the class as a controller
  - Stores the route prefix `'courses'`
  - Scans methods for route decorators (`@Get()`, `@Post()`, etc.)

**Step 5: NestJS application bootstrap**
- Scans all classes with `@Controller`, `@Injectable`, `@Module`
- Builds the dependency injection container
- Registers routes
- Starts the HTTP server

**Step 6: Runtime (dev mode)**
- Server listens on a port (e.g., 3000)
- When a request comes in:
  - NestJS matches the route
  - Instantiates the controller (if needed)
  - Executes the handler method
  - Returns the response

### 4. Production Build (`npm run build`)

When you run `npm run build`:

**Step 1: TypeScript compilation**
- Compiles all `.ts` files to `.js` in the `dist/` folder
- Same decorator transformation as dev mode
- Metadata is still emitted

**Step 2: Output files**
- Compiled JavaScript files in `dist/`
- Source maps (if enabled)
- Type declarations (`.d.ts` files)

**Step 3: Deployment**
- Files are copied to the server (DigitalOcean, AWS, etc.)
- `node_modules` are installed (including `reflect-metadata`)

**Step 4: Production runtime**
- Server starts with `node dist/src/main`
- Same process as dev mode:
  - Code loads
  - Decorators execute
  - NestJS bootstraps
  - Server starts listening

**Step 5: User interaction**
- Users make HTTP requests
- NestJS routes to the correct controller method
- Response is sent back

### 5. Metadata and Reflection

**What is metadata?**
Metadata is information about your code (types, parameters, return types) stored at runtime.

**How it works:**

1. **Compile time**: TypeScript emits metadata calls:
```javascript
__metadata("design:type", String)
__metadata("design:paramtypes", [UserService, LoggerService])
```

2. **Runtime**: `reflect-metadata` stores this in a global registry:
```javascript
// When you use @Inject(UserService)
Reflect.getMetadata('design:type', target, propertyKey)
// Returns: UserService class
```

3. **NestJS uses it for**:
   - Dependency injection: `@Inject()` reads parameter types
   - Route registration: `@Controller()` stores route info
   - Guards: `@Public()` stores metadata that guards read
   - Validation: `class-validator` reads property types

**Example from your codebase:**

Looking at your `Public` decorator:

```1:4:src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

When you use `@Public()`:
1. `SetMetadata` stores `{ isPublic: true }` on the method/class
2. At runtime, `JwtAuthGuard` reads this metadata:

```11:16:src/common/guards/jwt-auth.guard.ts
  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
```

**Is metadata known at compilation or runtime?**

- Compilation: TypeScript emits metadata calls (design:type, design:paramtypes, etc.)
- Runtime: The metadata is stored and read when the code executes
- Both: Compile-time emits it, runtime stores and uses it

### Summary Timeline

1. Write code: `@ClassDecorator() class Example {}`
2. Compile: TypeScript transforms decorators and emits metadata
3. Dev mode (`npm run start:dev`): Code compiles, decorators run, NestJS bootstraps, server starts
4. Production (`npm run build`): Same compilation, but output goes to `dist/`
5. Deployment: Files deployed, server runs, decorators execute on startup
6. User requests: NestJS routes requests using decorator-registered routes
7. Metadata: Stored at runtime, read by NestJS for DI, routing, guards, etc.

Decorators run when classes are defined (at module load time), not when instances are created. This lets NestJS build its dependency graph and route table before handling requests.