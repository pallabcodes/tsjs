import express, { Application, Request, Response, NextFunction } from 'express';

// Dummy User Data
const users = [
  { userId: '1', name: 'Alice', role: 'user' },
  { userId: '2', name: 'Bob', role: 'admin' },
];

// 1. Role Decorator
function Role(requiredRole: string) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    // Step 1: Get the original method
    const originalMethod = descriptor.value;
    console.info('Original method: ', originalMethod.toString());

    // Step 2: Override the method with our new function
    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      // Simulate fetching the user from the database using userId from headers
      const userId = req.headers['user-id'] as string;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Simulate a user lookup
      const user = users.find(u => u.userId === userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Step 3: Check if the user has the required role
      if (user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }

      // Step 4: Attach the user to the request object
      req.user = user;
      console.log('User found and role validated:', user);

      // Step 5: Call the original method
      return originalMethod.apply(this, [req, res, next]);
    };

    // Step 6: Return the modified descriptor
    return descriptor;
  };
}

// 2. UserController Class
class UserController {
  @Role('admin') // Requires the user to have the 'admin' role
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAdminPage(req: Request, res: Response, next: NextFunction) {
    // @ts-expect-error  whatever
    res.json({ message: `Welcome, ${req.user.name}`, role: req.user.role });
  }
}

// 1. Get the method descriptor
// const descriptor = Object.getOwnPropertyDescriptor(UserController.prototype, 'getAdminPage');

// 2. Apply the decorator manually
// Object.defineProperty(UserController.prototype, 'getAdminPage', Role('admin')(UserController.prototype, 'getAdminPage', descriptor));

// 3. Express Server Setup
const app: Application = express();
const userController = new UserController();

app.get('/admin', (req, res, next) => userController.getAdminPage(req, res, next));

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
